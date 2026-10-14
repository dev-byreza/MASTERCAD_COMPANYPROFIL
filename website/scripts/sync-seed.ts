import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { initialSettings, services, faqs, processSteps, concept } from "../src/lib/seed.js";

const db = new DatabaseSync(".data/mastercad.sqlite");
db.exec("BEGIN IMMEDIATE");

try {
  const now = new Date().toISOString();
  db.prepare("DELETE FROM records WHERE type IN ('service', 'faq', 'page', 'settings', 'portfolio')").run();

  const insert = db.prepare(
    "INSERT INTO records (id, type, slug, draft, published, status, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'Published', ?, ?, ?)"
  );

  insert.run(
    randomUUID(),
    "settings",
    "site",
    JSON.stringify(initialSettings),
    JSON.stringify(initialSettings),
    0,
    now,
    now
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
      now
    )
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
      now
    )
  );

  processSteps.forEach((item, i) =>
    insert.run(
      randomUUID(),
      "page",
      item.slug,
      JSON.stringify(item),
      JSON.stringify(item),
      i,
      now,
      now
    )
  );

  insert.run(
    randomUUID(),
    "portfolio",
    concept.slug,
    JSON.stringify(concept),
    JSON.stringify(concept),
    0,
    now,
    now
  );

  db.exec("COMMIT");
  console.log("Database successfully synchronized with 3 core services, faqs, and settings!");
} catch (error) {
  db.exec("ROLLBACK");
  console.error("Failed to sync database:", error);
  process.exit(1);
}
