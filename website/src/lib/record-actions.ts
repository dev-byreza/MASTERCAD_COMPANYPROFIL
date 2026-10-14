import { z } from "zod";
import { randomUUID } from "node:crypto";
import { getDb, transaction, audit } from "./db";
import { ApiError } from "./security";
import { allRecords } from "./content";
const typeSchema = z.enum(["service", "faq", "page", "portfolio", "settings"]);
const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100);
const text = z.string().max(5000);
const payloadSchema = z
  .object({
    title: z.string().max(150).optional(),
    slug: z.string().max(100).optional(),
    category: z.string().max(100).optional(),
    description: text.optional(),
    body: text.optional(),
    deliverables: text.optional(),
    kind: z.enum(["PROJECT", "CONCEPT"]).optional(),
    permission: z.boolean().optional(),
    images: z.array(z.string().max(200)).max(6).optional(),
    alts: z.array(z.string().max(300)).max(6).optional(),
    name: z.string().max(100).optional(),
    tagline: z.string().max(100).optional(),
    headline: z.string().max(200).optional(),
    intro: text.optional(),
    about: text.optional(),
    email: z.union([z.email(), z.literal("")]).optional(),
    phone: z
      .string()
      .max(30)
      .regex(/^[+\d\s().-]*$/)
      .optional(),
    whatsapp: z.string().max(20).regex(/^\d*$/).optional(),
    address: z.string().max(500).optional(),
    seoTitle: z.string().max(150).optional(),
    seoDescription: z.string().max(300).optional(),
  })
  .strict();
function validate(input: unknown) {
  const parsed = z
    .object({
      type: typeSchema,
      slug: slugSchema,
      payload: payloadSchema,
      sortOrder: z.number().int().min(0).max(9999).default(0),
      expectedVersion: z.number().int().positive().optional(),
    })
    .strict()
    .safeParse(input);
  if (!parsed.success)
    throw new ApiError(
      422,
      "VALIDATION",
      "Periksa judul, slug, kontak, dan panjang konten.",
    );
  const data = parsed.data;
  if (data.type !== "settings" && !data.payload.title?.trim())
    throw new ApiError(422, "TITLE", "Judul wajib diisi.");
  for (const image of data.payload.images || []) {
    if (
      image !== "/assets/engineering-hero.webp" &&
      !/^\/api\/v1\/media\/[0-9a-f-]{36}$/.test(image)
    )
      throw new ApiError(422, "IMAGE", "Gunakan gambar dari media studio.");
  }
  return data;
}
export function saveRecord(input: unknown, actor: string, id?: string) {
  const data = validate(input);
  return transaction((db) => {
    const old = id ? allRecords().find((r) => r.id === id) : undefined;
    if (id && !old)
      throw new ApiError(404, "NOT_FOUND", "Konten tidak ditemukan.");
    if (old && (old.version !== data.expectedVersion || old.type !== data.type))
      throw new ApiError(
        409,
        "CONFLICT",
        "Konten telah diperbarui. Muat ulang sebelum menyimpan.",
      );
    if (old?.published && old.slug !== data.slug)
      throw new ApiError(
        422,
        "SLUG",
        "Unpublish konten sebelum mengganti slug URL.",
      );
    if (data.type === "settings" && data.slug !== "site")
      throw new ApiError(422, "SETTINGS", "Pengaturan hanya satu per website.");
    if (
      db
        .prepare("SELECT id FROM records WHERE type=? AND slug=? AND id!=?")
        .get(data.type, data.slug, id || "")
    )
      throw new ApiError(409, "SLUG", "Slug sudah digunakan.");
    const recordId = id || randomUUID(),
      now = new Date().toISOString(),
      payload = { ...data.payload, slug: data.slug };
    if (old)
      db.prepare(
        "UPDATE records SET slug=?,draft=?,version=version+1,sort_order=?,updated_at=? WHERE id=?",
      ).run(data.slug, JSON.stringify(payload), data.sortOrder, now, recordId);
    else
      db.prepare(
        "INSERT INTO records(id,type,slug,draft,status,sort_order,created_at,updated_at) VALUES (?,?,?,?,'Draft',?,?,?)",
      ).run(
        recordId,
        data.type,
        data.slug,
        JSON.stringify(payload),
        data.sortOrder,
        now,
        now,
      );
    audit(actor, id ? "record.edit" : "record.create", recordId);
    return allRecords().find((r) => r.id === recordId)!;
  });
}
export function publishRecord(
  id: string,
  action: string,
  version: number,
  actor: string,
) {
  if (!["publish", "unpublish", "archive"].includes(action))
    throw new ApiError(404, "NOT_FOUND", "Aksi tidak ditemukan.");
  return transaction((db) => {
    const row = allRecords().find((r) => r.id === id);
    if (!row) throw new ApiError(404, "NOT_FOUND", "Konten tidak ditemukan.");
    if (row.version !== version)
      throw new ApiError(
        409,
        "CONFLICT",
        "Konten berubah. Muat ulang halaman.",
      );
    if (row.type === "settings" && action !== "publish")
      throw new ApiError(
        422,
        "SETTINGS",
        "Pengaturan website harus tetap diterbitkan; edit Draft lalu terbitkan versi baru.",
      );
    if (action === "publish") {
      const p = row.draft;
      if (row.type === "portfolio") {
        if (
          !p.title ||
          !p.category ||
          !p.description ||
          !p.kind ||
          !p.images?.length ||
          p.alts?.length !== p.images.length ||
          p.alts.some((a: string) => !a.trim())
        )
          throw new ApiError(
            422,
            "INCOMPLETE",
            "Lengkapi judul, kategori, deskripsi, jenis karya, gambar, dan alt text.",
          );
        if (p.kind === "PROJECT" && !p.permission)
          throw new ApiError(
            422,
            "PERMISSION",
            "Konfirmasi izin publikasi proyek terlebih dahulu.",
          );
        for (const image of p.images) {
          if (
            image.startsWith("/api/v1/media/") &&
            !db
              .prepare("SELECT id FROM media WHERE id=?")
              .get(image.split("/").pop())
          )
            throw new ApiError(422, "MEDIA", "Gambar tidak ditemukan.");
        }
      }
      if (row.type === "settings" && (!p.name || !p.headline || !p.intro))
        throw new ApiError(
          422,
          "INCOMPLETE",
          "Lengkapi nama, headline dan pengantar.",
        );
      db.prepare(
        "UPDATE records SET published=draft,status='Published',version=version+1,updated_at=? WHERE id=?",
      ).run(new Date().toISOString(), id);
    } else
      db.prepare(
        "UPDATE records SET published=NULL,status=?,version=version+1,updated_at=? WHERE id=?",
      ).run(
        action === "archive" ? "Archived" : "Draft",
        new Date().toISOString(),
        id,
      );
    audit(actor, "record." + action, id);
    return allRecords().find((r) => r.id === id)!;
  });
}
export function mediaUsed(id: string, publishedOnly = false) {
  const url = "/api/v1/media/" + id;
  return allRecords().some((row) => {
    const pub =
      row.status === "Published" && row.published?.images?.includes(url);
    return publishedOnly ? pub : pub || row.draft?.images?.includes(url);
  });
}
