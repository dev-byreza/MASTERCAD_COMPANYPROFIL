import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { initialSettings, services, faqs, concept, processSteps } from "./seed";

const globalDb = globalThis as unknown as { mastercadDb?: DatabaseSync };
export const dataDirectory = () =>
  dirname(resolve(process.env.DATABASE_PATH || ".data/mastercad.sqlite"));
export function getDb() {
  if (globalDb.mastercadDb) return globalDb.mastercadDb;
  const location = resolve(
    process.env.DATABASE_PATH || ".data/mastercad.sqlite",
  );
  mkdirSync(dirname(location), { recursive: true });
  const db = new DatabaseSync(location);
  db.exec("PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;");
  db.exec(readFileSync(resolve("db/migrations/001-domain.sql"), "utf8"));
  if (!db.prepare("SELECT id FROM migrations WHERE id = '001-domain'").get()) {
    db.exec("BEGIN IMMEDIATE");
    try {
      const now = new Date().toISOString();
      const insert = db.prepare(
        "INSERT INTO records (id,type,slug,draft,published,status,sort_order,created_at,updated_at) VALUES (?,?,?,?,?,'Published',?,?,?)",
      );
      services.forEach((item, i) =>
        insert.run(
          randomUUID(),
          "service",
          item.slug,
          JSON.stringify(item),
          JSON.stringify(item),
          i,
          now,
          now,
        ),
      );
      faqs.forEach((item, i) =>
        insert.run(
          randomUUID(),
          "faq",
          item.slug,
          JSON.stringify(item),
          JSON.stringify(item),
          i,
          now,
          now,
        ),
      );
      insert.run(
        randomUUID(),
        "portfolio",
        concept.slug,
        JSON.stringify(concept),
        JSON.stringify(concept),
        0,
        now,
        now,
      );
      insert.run(
        randomUUID(),
        "settings",
        "site",
        JSON.stringify(initialSettings),
        JSON.stringify(initialSettings),
        0,
        now,
        now,
      );
      db.prepare("INSERT INTO migrations VALUES (?,?)").run("001-domain", now);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  if (!db.prepare("SELECT id FROM migrations WHERE id = '002-process'").get()) {
    db.exec("BEGIN IMMEDIATE");
    try {
      const now = new Date().toISOString();
      const insert = db.prepare(
        "INSERT OR IGNORE INTO records(id,type,slug,draft,published,status,sort_order,created_at,updated_at) VALUES (?,'page',?,?,?,'Published',?,?,?)",
      );
      processSteps.forEach((item, i) =>
        insert.run(
          randomUUID(),
          item.slug,
          JSON.stringify(item),
          JSON.stringify(item),
          i,
          now,
          now,
        ),
      );
      db.prepare("INSERT INTO migrations VALUES (?,?)").run("002-process", now);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  globalDb.mastercadDb = db;
  return db;
}
export function transaction<T>(callback: (db: DatabaseSync) => T): T {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = callback(db);
    db.exec("COMMIT");
    return result;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
export function audit(actor: string, action: string, id: string) {
  getDb()
    .prepare("INSERT INTO audit VALUES (?,?,?,?,?)")
    .run(randomUUID(), actor, action, id, new Date().toISOString());
}
