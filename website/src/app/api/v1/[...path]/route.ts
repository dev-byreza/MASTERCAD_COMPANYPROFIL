import { z } from "zod";
import { getDb } from "@/lib/db";
import { allRecords, publicContent, publicItem, settings } from "@/lib/content";
import { saveRecord, publishRecord, mediaUsed } from "@/lib/record-actions";
import { createInquiry, updateInquiry, deleteInquiry } from "@/lib/inquiries";
import { uploadMedia, readMedia, deleteMedia } from "@/lib/media";
import {
  ApiError,
  checkOrigin,
  requireAdmin,
  jsonBody,
  response,
  handleError,
  limit,
} from "@/lib/security";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };
async function handler(request: Request, context: Context) {
  try {
    const { path } = await context.params,
      method = request.method,
      url = new URL(request.url);
    if (method !== "GET") checkOrigin(request);
    if (path[0] === "inquiries" && path.length === 1 && method === "POST") {
      const result = createInquiry(
        await jsonBody(request),
        request.headers.get("idempotency-key"),
        "local-network",
      );
      return response(
        { reference: result.reference },
        result.replay ? 200 : 201,
      );
    }
    if (path[0] === "media" && path.length === 2 && method === "GET") {
      if (!z.uuid().safeParse(path[1]).success)
        throw new ApiError(404, "NOT_FOUND", "Gambar tidak ditemukan.");
      if (!mediaUsed(path[1], true)) {
        try {
          await requireAdmin(request);
        } catch {
          throw new ApiError(404, "NOT_FOUND", "Gambar tidak ditemukan.");
        }
      }
      return new Response(new Uint8Array(await readMedia(path[1])), {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
    if (method === "GET" && path[0] === "portfolio") {
      if (path.length === 2) {
        const item = publicItem("portfolio", path[1]);
        if (!item)
          throw new ApiError(404, "NOT_FOUND", "Karya tidak ditemukan.");
        return response(item);
      }
      if (path.length !== 1)
        throw new ApiError(404, "NOT_FOUND", "Tidak ditemukan.");
      const category = url.searchParams.get("category"),
        limitValue = Number(url.searchParams.get("limit") || 20),
        cursor = Number(url.searchParams.get("cursor") || 0);
      if (
        !Number.isInteger(limitValue) ||
        limitValue < 1 ||
        limitValue > 50 ||
        !Number.isInteger(cursor) ||
        cursor < 0
      )
        throw new ApiError(422, "QUERY", "Pagination tidak valid.");
      const items = publicContent("portfolio").filter(
        (item) => !category || item.category === category,
      );
      return response({
        items: items.slice(cursor, cursor + limitValue),
        nextCursor:
          cursor + limitValue < items.length
            ? String(cursor + limitValue)
            : null,
      });
    }
    if (
      method === "GET" &&
      path[0] === "content" &&
      path.length === 3 &&
      ["service", "faq", "page"].includes(path[1])
    ) {
      const item = publicItem(path[1], path[2]);
      if (!item)
        throw new ApiError(404, "NOT_FOUND", "Konten tidak ditemukan.");
      return response(item);
    }
    if (method === "GET" && path.join("/") === "settings")
      return response(settings());
    if (path[0] !== "admin")
      throw new ApiError(404, "NOT_FOUND", "Halaman tidak ditemukan.");
    const admin = await requireAdmin(request);
    if (method !== "GET") limit("admin:" + admin.id, 60, 60);
    if (path[1] === "records") {
      if (method === "GET" && path.length === 2)
        return response({ items: allRecords() });
      if (method === "POST" && path.length === 2)
        return response(saveRecord(await jsonBody(request), admin.id), 201);
      if (method === "PATCH" && path.length === 3)
        return response(saveRecord(await jsonBody(request), admin.id, path[2]));
      if (method === "POST" && path.length === 4) {
        const body = z
          .object({ expectedVersion: z.number().int().positive() })
          .strict()
          .safeParse(await jsonBody(request));
        if (!body.success) throw new ApiError(422, "VERSION", "Version wajib.");
        return response(
          publishRecord(path[2], path[3], body.data.expectedVersion, admin.id),
        );
      }
    }
    if (path[1] === "inquiries") {
      if (method === "GET" && path.length === 2) {
        const status = url.searchParams.get("status") || "",
          offset = Number(url.searchParams.get("cursor") || 0);
        if (
          !Number.isInteger(offset) ||
          offset < 0 ||
          (status && !["NEW", "IN_PROGRESS", "CLOSED"].includes(status))
        )
          throw new ApiError(422, "QUERY", "Filter tidak valid.");
        const items = status
          ? getDb()
              .prepare(
                "SELECT * FROM inquiries WHERE status=? ORDER BY created_at DESC,id LIMIT 21 OFFSET ?",
              )
              .all(status, offset)
          : getDb()
              .prepare(
                "SELECT * FROM inquiries ORDER BY created_at DESC,id LIMIT 21 OFFSET ?",
              )
              .all(offset);
        return response({
          items: items.slice(0, 20),
          nextCursor: items.length > 20 ? String(offset + 20) : null,
        });
      }
      if (method === "GET" && path.length === 3) {
        const item = getDb()
          .prepare("SELECT * FROM inquiries WHERE id=?")
          .get(path[2]);
        if (!item)
          throw new ApiError(404, "NOT_FOUND", "Pesan tidak ditemukan.");
        return response(item);
      }
      if (method === "PATCH" && path.length === 3)
        return response(
          updateInquiry(path[2], await jsonBody(request), admin.id),
        );
      if (method === "DELETE" && path.length === 3) {
        const body = z
          .object({ expectedVersion: z.number().int().positive() })
          .strict()
          .safeParse(await jsonBody(request));
        if (!body.success) throw new ApiError(422, "VERSION", "Version wajib.");
        deleteInquiry(path[2], body.data.expectedVersion, admin.id);
        return new Response(null, {
          status: 204,
          headers: { "Cache-Control": "no-store" },
        });
      }
    }
    if (path[1] === "media") {
      if (method === "GET" && path.length === 2)
        return response({
          items: getDb()
            .prepare("SELECT * FROM media ORDER BY created_at DESC LIMIT 200")
            .all(),
        });
      if (method === "POST" && path.length === 2) {
        limit("upload:" + admin.id, 20, 900);
        return response(await uploadMedia(request, admin.id), 201);
      }
      if (method === "DELETE" && path.length === 3) {
        await deleteMedia(path[2], admin.id);
        return new Response(null, { status: 204 });
      }
    }
    throw new ApiError(404, "NOT_FOUND", "Operasi tidak ditemukan.");
  } catch (error) {
    return handleError(error);
  }
}
export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
