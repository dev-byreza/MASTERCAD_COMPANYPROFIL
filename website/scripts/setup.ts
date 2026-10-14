import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
mkdirSync(".data", { recursive: true });
if (!existsSync(".env.local"))
  writeFileSync(
    ".env.local",
    `APP_URL=http://127.0.0.1:3000\nBETTER_AUTH_SECRET=${randomBytes(48).toString("hex")}\nDATABASE_PATH=.data/mastercad.sqlite\n`,
  );
process.loadEnvFile(".env.local");
const { getDb } = await import("../src/lib/db");
getDb();
const { authOptions } = await import("../src/lib/auth");
const { getMigrations } = await import("better-auth/db/migration");
const migration = await getMigrations(authOptions());
await migration.runMigrations();
console.log(
  "Database dan autentikasi siap. Tidak ada password default. Buat admin dengan npm run admin:create.",
);
