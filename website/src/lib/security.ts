import { createHmac, randomUUID } from "node:crypto";
import { getDb } from "./db";
import { getAuth } from "./auth";
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}
export function digest(value: string) {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("Secret missing");
  return createHmac("sha256", secret).update(value).digest("hex");
}
export function limit(subject: string, max: number, window: number) {
  const bucket = Math.floor(Date.now() / 1000 / window),
    expires = (bucket + 1) * window;
  const key = digest(subject + ":" + bucket);
  const row = getDb()
    .prepare(
      "INSERT INTO rate_limits(subject,count,expires_at) VALUES (?,1,?) ON CONFLICT(subject) DO UPDATE SET count=count+1 RETURNING count",
    )
    .get(key, expires) as { count: number };
  if (row.count > max)
    throw new ApiError(
      429,
      "RATE_LIMIT",
      "Terlalu banyak permintaan. Silakan coba kembali nanti.",
    );
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin"),
    expected = process.env.APP_URL || "http://127.0.0.1:3000";
  const allowed =
    process.env.NODE_ENV === "production"
      ? [expected]
      : [expected, "http://localhost:3000", "http://127.0.0.1:3000"];
  if (!origin || !allowed.includes(origin))
    throw new ApiError(403, "ORIGIN", "Permintaan tidak diizinkan.");
}
export async function requireAdmin(request: Request) {
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session)
    throw new ApiError(401, "UNAUTHENTICATED", "Silakan masuk kembali.");
  const active = getDb()
    .prepare("SELECT active FROM admin_profiles WHERE user_id=?")
    .get(session.user.id) as { active: number } | undefined;
  if (!active?.active)
    throw new ApiError(403, "FORBIDDEN", "Akun tidak memiliki akses admin.");
  return session.user;
}
export async function jsonBody(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new ApiError(415, "CONTENT_TYPE", "Gunakan JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(422, "INVALID", "Data diperlukan.");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 16384) {
      await reader.cancel();
      throw new ApiError(413, "TOO_LARGE", "Data terlalu besar.");
    }
    chunks.push(value);
  }
  try {
    const text = Buffer.concat(chunks).toString("utf8");
    return JSON.parse(text);
  } catch {
    throw new ApiError(422, "INVALID_JSON", "Data tidak valid.");
  }
}
export function response(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "X-Request-ID": randomUUID(),
    },
  });
}
export function handleError(error: unknown) {
  if (error instanceof ApiError)
    return response(
      {
        error: {
          code: error.code,
          message: error.message,
          fields: error.fields,
        },
      },
      error.status,
    );
  const id = randomUUID();
  console.error(JSON.stringify({ requestId: id, code: "SERVER_ERROR" }));
  return response(
    {
      error: {
        code: "SERVER_ERROR",
        message: "Layanan sedang tidak tersedia. Silakan coba kembali.",
      },
      requestId: id,
    },
    503,
  );
}
