import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  renameSync,
} from "node:fs";
import { resolve } from "node:path";
import { dataDirectory } from "./db";
export function deletionLedger() {
  const path = resolve(dataDirectory(), "deletion-ledger.json");
  return existsSync(path)
    ? (JSON.parse(readFileSync(path, "utf8")) as { id: string; at: string }[])
    : [];
}
export function recordDeletion(id: string) {
  mkdirSync(dataDirectory(), { recursive: true });
  const now = new Date().toISOString(),
    rows = deletionLedger().filter(
      (r) => Date.now() - Date.parse(r.at) < 31 * 86400000 && r.id !== id,
    );
  rows.push({ id, at: now });
  const temp = resolve(dataDirectory(), "deletion-ledger.tmp");
  writeFileSync(temp, JSON.stringify(rows));
  renameSync(temp, resolve(dataDirectory(), "deletion-ledger.json"));
}
