import { z } from "zod";
import { randomUUID } from "node:crypto";
import { getDb, transaction, audit } from "./db";
import { ApiError, digest, limit } from "./security";
import { publicContent } from "./content";
import { recordDeletion } from "./deletion-ledger";
export const noticeVersion = "2026-10-05-v1";
const schema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z
      .email()
      .max(254)
      .transform((v) => v.toLowerCase()),
    phone: z
      .string()
      .trim()
      .max(30)
      .regex(/^[+\d\s().-]*$/)
      .optional()
      .default(""),
    company: z.string().trim().max(150).optional().default(""),
    service: z.string().max(100).optional().default(""),
    message: z.string().trim().min(20).max(5000),
    consent: z.literal(true),
    website: z.string().max(0).optional().default(""),
  })
  .strict();
export function createInquiry(
  input: unknown,
  key: string | null,
  network: string,
) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    parsed.error.issues.forEach((e) => {
      fields[String(e.path[0])] = "Periksa isian ini.";
    });
    throw new ApiError(
      422,
      "VALIDATION",
      "Lengkapi nama, email, brief minimal 20 karakter, dan persetujuan.",
      fields,
    );
  }
  if (!key || !z.uuid().safeParse(key).success)
    throw new ApiError(422, "IDEMPOTENCY_KEY", "Kunci pengiriman tidak valid.");
  const data = parsed.data;
  if (
    data.service &&
    !publicContent("service").some((s) => s.slug === data.service)
  )
    throw new ApiError(422, "SERVICE", "Layanan tidak tersedia.");
  const keyHash = digest("key:" + key),
    payloadHash = digest("payload:" + JSON.stringify(data));
  limit("contact-general:" + network, 30, 900);
  return transaction((db) => {
    const existing = db
      .prepare(
        "SELECT payload_hash,inquiry_id,expires_at FROM idempotency WHERE key_hash=?",
      )
      .get(keyHash) as
      | { payload_hash: string; inquiry_id: string; expires_at: number }
      | undefined;
    if (existing && existing.expires_at > Date.now()) {
      if (existing.payload_hash !== payloadHash)
        throw new ApiError(
          409,
          "CONFLICT",
          "Isian berubah. Silakan kirim ulang.",
        );
      const row = db
        .prepare("SELECT reference FROM inquiries WHERE id=?")
        .get(existing.inquiry_id) as { reference: string } | undefined;
      if (row) return { reference: row.reference, replay: true };
    }
    if (existing)
      db.prepare("DELETE FROM idempotency WHERE key_hash=?").run(keyHash);
    limit("contact-new:" + network, 5, 900);
    limit("contact-email:" + data.email, 3, 3600);
    const id = randomUUID(),
      reference = "MC-" + randomUUID().slice(0, 8).toUpperCase(),
      now = new Date().toISOString();
    db.prepare(
      "INSERT INTO inquiries(id,reference,name,email,phone,company,service,message,consent_at,notice_version,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    ).run(
      id,
      reference,
      data.name,
      data.email,
      data.phone,
      data.company,
      data.service,
      data.message,
      now,
      noticeVersion,
      now,
      now,
    );
    db.prepare("INSERT INTO idempotency VALUES (?,?,?,?)").run(
      keyHash,
      payloadHash,
      id,
      Date.now() + 86400000,
    );
    return { reference, replay: false };
  });
}
export function updateInquiry(id: string, input: unknown, actor: string) {
  const parsed = z
    .object({
      status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]),
      expectedVersion: z.number().int().positive(),
    })
    .strict()
    .safeParse(input);
  if (!parsed.success)
    throw new ApiError(422, "VALIDATION", "Status tidak valid.");
  return transaction((db) => {
    const old = db
      .prepare("SELECT status,version FROM inquiries WHERE id=?")
      .get(id) as { status: string; version: number } | undefined;
    if (!old) throw new ApiError(404, "NOT_FOUND", "Pesan tidak ditemukan.");
    if (old.version !== parsed.data.expectedVersion)
      throw new ApiError(
        409,
        "CONFLICT",
        "Pesan telah diperbarui. Muat ulang halaman.",
      );
    const target = parsed.data.status;
    const allowed: Record<string, string[]> = {
      NEW: ["NEW", "IN_PROGRESS"],
      IN_PROGRESS: ["IN_PROGRESS", "CLOSED"],
      CLOSED: ["CLOSED", "IN_PROGRESS"],
    };
    if (!allowed[old.status].includes(target))
      throw new ApiError(
        422,
        "TRANSITION",
        "Tandai ditindaklanjuti sebelum menutup pesan.",
      );
    db.prepare(
      "UPDATE inquiries SET status=?,version=version+1,updated_at=? WHERE id=?",
    ).run(target, new Date().toISOString(), id);
    audit(actor, "inquiry.status", id);
    return { status: target };
  });
}
export function deleteInquiry(id: string, version: number, actor: string) {
  transaction((db) => {
    const old = db
      .prepare("SELECT version FROM inquiries WHERE id=?")
      .get(id) as { version: number } | undefined;
    if (!old) return;
    if (old.version !== version)
      throw new ApiError(
        409,
        "CONFLICT",
        "Pesan telah berubah. Muat ulang halaman.",
      );
    recordDeletion(id);
    db.prepare("INSERT OR REPLACE INTO deletions VALUES (?,?)").run(
      id,
      new Date().toISOString(),
    );
    db.prepare("DELETE FROM inquiries WHERE id=?").run(id);
    audit(actor, "inquiry.delete", id);
  });
}
