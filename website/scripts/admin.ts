import { writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
process.loadEnvFile(".env.local");
const local = process.argv.includes("--local");
if (local && process.env.NODE_ENV === "production")
  throw new Error("--local hanya untuk development.");
const { getDb } = await import("../src/lib/db");
const { authOptions } = await import("../src/lib/auth");
const { betterAuth } = await import("better-auth");
const { getMigrations } = await import("better-auth/db/migration");
await (await getMigrations(authOptions())).runMigrations();
const prompt = createInterface({
  input: process.stdin,
  output: process.stdout,
});
const email = local
  ? "admin@mastercad.local"
  : process.env.ADMIN_EMAIL || (await prompt.question("Email admin: "));
const password = local
  ? randomBytes(18).toString("base64url")
  : process.env.ADMIN_PASSWORD;
prompt.close();
if (!password || password.length < 12)
  throw new Error(
    "Atur ADMIN_PASSWORD ≥12 karakter melalui environment; tidak ada default password produksi.",
  );
const existing = getDb()
  .prepare('SELECT id FROM "user" WHERE email=?')
  .get(email) as { id: string } | undefined;
if (existing) {
  console.log("Akun sudah tersedia; password tidak diubah.");
  process.exit(0);
}
const user = await betterAuth(authOptions(true)).api.signUpEmail({
  body: { email, password, name: "MasterCAD Admin" },
});
getDb()
  .prepare("INSERT INTO admin_profiles(user_id,active) VALUES (?,1)")
  .run(user.user.id);
if (local) {
  writeFileSync(
    ".data/admin-access.txt",
    `AKSES LOKAL DEVELOPMENT — jangan digunakan untuk produksi\nURL: http://127.0.0.1:3000/admin/login\nEmail: ${email}\nPassword: ${password}\n`,
  );
  console.log(
    "Akses admin lokal dibuat. Lihat .data/admin-access.txt (diabaikan Git).",
  );
} else
  console.log(
    "Admin berhasil dibuat. Hapus environment password setelah selesai.",
  );
