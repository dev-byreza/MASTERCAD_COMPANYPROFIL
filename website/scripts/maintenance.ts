import { backup, DatabaseSync } from "node:sqlite";
import {
  mkdir,
  readFile,
  writeFile,
  readdir,
  copyFile,
  unlink,
  stat,
} from "node:fs/promises";
import { resolve, basename } from "node:path";
import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  scryptSync,
  createHash,
} from "node:crypto";
process.loadEnvFile(".env.local");
const { getDb, transaction } = await import("../src/lib/db");
const { mediaUsed } = await import("../src/lib/record-actions");
const { recordDeletion, deletionLedger } =
  await import("../src/lib/deletion-ledger");
const db = getDb(),
  operation = process.argv[2];
if (operation === "purge") {
  const before = new Date(Date.now() - 180 * 86400000).toISOString();
  const rows = db
    .prepare("SELECT id FROM inquiries WHERE created_at<?")
    .all(before) as { id: string }[];
  if (!process.argv.includes("--apply")) {
    console.log(
      JSON.stringify({
        operation: "purge-dry-run",
        expiredInquiries: rows.length,
        status: "ok",
        note: "Tidak ada data dihapus. Operator dapat memakai --apply setelah menyetujui retensi.",
      }),
    );
    process.exit(0);
  }
  transaction((tx) => {
    for (const row of rows) {
      recordDeletion(row.id);
      tx.prepare("INSERT OR REPLACE INTO deletions VALUES (?,?)").run(
        row.id,
        new Date().toISOString(),
      );
      tx.prepare("DELETE FROM inquiries WHERE id=?").run(row.id);
    }
    tx.prepare("DELETE FROM idempotency WHERE expires_at<?").run(Date.now());
    tx.prepare("DELETE FROM rate_limits WHERE expires_at<?").run(
      Date.now() / 1000,
    );
    tx.prepare("DELETE FROM audit WHERE created_at<?").run(
      new Date(Date.now() - 90 * 86400000).toISOString(),
    );
    tx.prepare("DELETE FROM deletions WHERE deleted_at<?").run(
      new Date(Date.now() - 31 * 86400000).toISOString(),
    );
  });
  const media = db
    .prepare("SELECT id,filename,created_at FROM media")
    .all() as { id: string; filename: string; created_at: string }[];
  for (const item of media)
    if (
      Date.now() - Date.parse(item.created_at) > 7 * 86400000 &&
      !mediaUsed(item.id)
    ) {
      await unlink(resolve(".data/media", item.filename)).catch(() => {});
      db.prepare("DELETE FROM media WHERE id=?").run(item.id);
    }
  console.log(
    JSON.stringify({
      operation: "purge",
      removedInquiries: rows.length,
      status: "ok",
    }),
  );
} else if (operation === "backup") {
  const secret = process.env.BACKUP_SECRET || process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("Backup secret required");
  await mkdir(".data/backups", { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const temp = resolve(`.data/backups/${timestamp}.sqlite`);
  await backup(db, temp);
  const snapshot = new DatabaseSync(temp, { readOnly: true });
  const media = snapshot.prepare("SELECT filename FROM media").all() as {
    filename: string;
  }[];
  snapshot.close();
  try {
    const files: { name: string; data: string; checksum: string }[] = [];
    for (const name of [
      temp,
      ...media.map((m) => resolve(".data/media", m.filename)),
    ]) {
      const buffer = await readFile(name);
      files.push({
        name: basename(name),
        data: buffer.toString("base64"),
        checksum: createHash("sha256").update(buffer).digest("hex"),
      });
    }
    const bundle = Buffer.from(
      JSON.stringify({
        version: 1,
        created_at: new Date().toISOString(),
        database: basename(temp),
        files,
      }),
    );
    const salt = randomBytes(16),
      iv = randomBytes(12),
      key = scryptSync(secret, salt, 32),
      cipher = createCipheriv("aes-256-gcm", key, iv);
    const encoded = Buffer.concat([cipher.update(bundle), cipher.final()]);
    const target = resolve(`.data/backups/${timestamp}.mcbackup`);
    await writeFile(
      target,
      Buffer.concat([
        Buffer.from("MCB1"),
        salt,
        iv,
        cipher.getAuthTag(),
        encoded,
      ]),
    );
    console.log(
      JSON.stringify({
        operation: "backup",
        file: target,
        status: "ok",
        media: media.length,
      }),
    );
    for (const file of await readdir(".data/backups"))
      if (
        file.endsWith(".mcbackup") &&
        (await stat(resolve(".data/backups", file))).mtimeMs <
          Date.now() - 30 * 86400000
      )
        await unlink(resolve(".data/backups", file));
  } finally {
    await unlink(temp).catch(() => {});
  }
} else if (operation === "restore-check") {
  const file = process.argv[3];
  if (!file) throw new Error("Specify backup file");
  const raw = await readFile(file);
  if (raw.subarray(0, 4).toString() !== "MCB1")
    throw new Error("Invalid backup");
  const secret = process.env.BACKUP_SECRET || process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("Secret required");
  const key = scryptSync(secret, raw.subarray(4, 20), 32),
    decrypt = createDecipheriv("aes-256-gcm", key, raw.subarray(20, 32));
  decrypt.setAuthTag(raw.subarray(32, 48));
  const bundle = JSON.parse(
    Buffer.concat([
      decrypt.update(raw.subarray(48)),
      decrypt.final(),
    ]).toString(),
  );
  // Isolated restore only; never replaces the live database.
  const target = resolve(".data/restore-check", randomBytes(6).toString("hex"));
  await mkdir(target, { recursive: true });
  for (const item of bundle.files) {
    if (basename(item.name) !== item.name)
      throw new Error("Invalid archive path");
    const buffer = Buffer.from(item.data, "base64");
    if (createHash("sha256").update(buffer).digest("hex") !== item.checksum)
      throw new Error("Checksum mismatch");
    await writeFile(resolve(target, item.name), buffer);
  }
  const restored = new DatabaseSync(resolve(target, bundle.database));
  restored.exec("PRAGMA foreign_keys=ON");
  for (const entry of deletionLedger())
    restored.prepare("DELETE FROM inquiries WHERE id=?").run(entry.id);
  const integrity = restored.prepare("PRAGMA integrity_check").get();
  restored.close();
  console.log(
    JSON.stringify({
      operation: "restore-check",
      target,
      integrity,
      status: "ok",
    }),
  );
} else throw new Error("Use backup, purge, or restore-check <backup-file>.");
