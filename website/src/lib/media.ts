import { randomUUID } from "node:crypto";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import sharp, { type Metadata } from "sharp";
import { getDb, audit, dataDirectory } from "./db";
import { ApiError } from "./security";
import { mediaUsed } from "./record-actions";
export const mediaDirectory = () => resolve(dataDirectory(), "media");
export async function uploadMedia(request: Request, actor: string) {
  if (Number(request.headers.get("content-length") || 0) > 6 * 1024 * 1024)
    throw new ApiError(413, "TOO_LARGE", "Ukuran gambar maksimal 5 MB.");
  // Bound streamed body before multipart parsing, even without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(422, "FILE", "Pilih gambar.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 6 * 1024 * 1024) {
      await reader.cancel();
      throw new ApiError(413, "TOO_LARGE", "Ukuran gambar maksimal 5 MB.");
    }
    chunks.push(value);
  }
  const bounded = new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: Buffer.concat(chunks),
  });
  const data = await bounded.formData(),
    file = data.get("file");
  if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || file.size < 1)
    throw new ApiError(422, "FILE", "Pilih JPEG, PNG, atau WebP hingga 5 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());
  let metadata: Metadata;
  try {
    metadata = await sharp(bytes, { limitInputPixels: 20000000 }).metadata();
  } catch {
    throw new ApiError(415, "FORMAT", "Gambar tidak dapat dibaca.");
  }
  if (
    !["jpeg", "png", "webp"].includes(metadata.format || "") ||
    (metadata.pages || 1) > 1
  )
    throw new ApiError(
      415,
      "FORMAT",
      "Hanya JPEG, PNG, atau WebP tanpa animasi.",
    );
  const output = await sharp(bytes, { limitInputPixels: 20000000 })
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 86 })
    .toBuffer({ resolveWithObject: true });
  const id = randomUUID(),
    filename = id + ".webp";
  await mkdir(mediaDirectory(), { recursive: true });
  await writeFile(resolve(mediaDirectory(), filename), output.data);
  try {
    getDb()
      .prepare("INSERT INTO media VALUES (?,?,?,?,?,?,?)")
      .run(
        id,
        filename,
        "image/webp",
        output.data.length,
        output.info.width,
        output.info.height,
        new Date().toISOString(),
      );
    audit(actor, "media.upload", id);
  } catch (e) {
    await unlink(resolve(mediaDirectory(), filename));
    throw e;
  }
  return {
    id,
    url: "/api/v1/media/" + id,
    width: output.info.width,
    height: output.info.height,
  };
}
export async function readMedia(id: string) {
  const row = getDb()
    .prepare("SELECT filename FROM media WHERE id=?")
    .get(id) as { filename: string } | undefined;
  if (!row) throw new ApiError(404, "NOT_FOUND", "Gambar tidak ditemukan.");
  return readFile(resolve(mediaDirectory(), row.filename));
}
export async function deleteMedia(id: string, actor: string) {
  if (mediaUsed(id))
    throw new ApiError(
      409,
      "IN_USE",
      "Gambar masih digunakan di Draft atau Published.",
    );
  const row = getDb()
    .prepare("SELECT filename FROM media WHERE id=?")
    .get(id) as { filename: string } | undefined;
  if (!row) return;
  await unlink(resolve(mediaDirectory(), row.filename));
  getDb().prepare("DELETE FROM media WHERE id=?").run(id);
  audit(actor, "media.delete", id);
}
