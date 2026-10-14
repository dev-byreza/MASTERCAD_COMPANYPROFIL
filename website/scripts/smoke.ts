import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
const origin = "http://127.0.0.1:3000";
const access = readFileSync(".data/admin-access.txt", "utf8");
const email = access.match(/Email: (.+)/)![1].trim(),
  password = access.match(/Password: (.+)/)![1].trim();
const results: { check: string; status: string }[] = [];
let cookie = "";
async function call(
  path: string,
  method = "GET",
  body?: unknown,
  extra: Record<string, string> = {},
) {
  const res = await fetch(origin + path, {
    method,
    headers: {
      ...(method !== "GET" ? { Origin: origin } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(body && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...extra,
    },
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  return res;
}
for (const path of [
  "/",
  "/tentang",
  "/layanan",
  "/layanan/pemodelan-cad-3d",
  "/portofolio",
  "/portofolio/assembly-mekanikal",
  "/kontak",
  "/privasi",
  "/robots.txt",
  "/sitemap.xml",
  "/health/ready",
]) {
  assert.equal((await call(path)).status, 200, path);
  results.push({ check: "public " + path, status: "pass" });
}
assert.equal((await call("/api/v1/admin/records")).status, 401);
results.push({ check: "anonymous admin API rejected", status: "pass" });
const csrf = await call(
  "/api/v1/admin/records",
  "POST",
  {},
  { Origin: "https://hostile.example" },
);
assert.equal(csrf.status, 403);
results.push({ check: "cross-origin mutation rejected", status: "pass" });
const auth = await call("/api/auth/sign-in/email", "POST", { email, password });
assert.equal(auth.status, 200);
cookie = auth.headers
  .getSetCookie()
  .map((s) => s.split(";")[0])
  .join("; ");
assert.ok(cookie);
results.push({ check: "admin login", status: "pass" });
const inbox = await call("/api/v1/admin/inquiries");
assert.equal(inbox.status, 200);
assert.ok(
  (await inbox.json()).items.some(
    (i: { reference: string; name: string }) =>
      i.name === "Uji Lokal MasterCAD",
  ),
);
results.push({ check: "UI consultation reaches inbox", status: "pass" });
const body = new FormData();
body.append(
  "file",
  new File([readFileSync("public/assets/engineering-hero.webp")], "qa.webp", {
    type: "image/webp",
  }),
);
const uploaded = await call("/api/v1/admin/media", "POST", body);
assert.equal(uploaded.status, 201);
const image = await uploaded.json();
cookie = "";
assert.equal((await call(image.url)).status, 404);
cookie = auth.headers
  .getSetCookie()
  .map((s) => s.split(";")[0])
  .join("; ");
results.push({ check: "uploaded draft image private", status: "pass" });
const slug = "qa-local-" + randomUUID().slice(0, 8),
  payload = {
    title: "QA LOCAL — TEST ONLY",
    category: "Pengujian lokal",
    description: "Data sintetis untuk smoke test; bukan pekerjaan pelanggan.",
    body: "Pengujian publish dan unpublish.",
    kind: "CONCEPT",
    permission: false,
    images: [image.url],
    alts: ["Gambar sintetis pengujian lokal"],
  };
let res = await call("/api/v1/admin/records", "POST", {
  type: "portfolio",
  slug,
  payload,
  sortOrder: 99,
});
assert.equal(res.status, 201);
let record = await res.json();
const adminCookie = cookie;
cookie = "";
assert.equal((await call(`/portofolio/${slug}`)).status, 404);
cookie = adminCookie;
res = await call(`/api/v1/admin/records/${record.id}/publish`, "POST", {
  expectedVersion: record.version,
});
assert.equal(res.status, 200);
record = await res.json();
cookie = "";
assert.equal((await call(`/portofolio/${slug}`)).status, 200);
assert.equal((await call(image.url)).status, 200);
cookie = adminCookie;
results.push({ check: "published portfolio and media public", status: "pass" });
res = await call(`/api/v1/admin/records/${record.id}/archive`, "POST", {
  expectedVersion: record.version,
});
assert.equal(res.status, 200);
cookie = "";
assert.equal((await call(`/portofolio/${slug}`)).status, 404);
assert.equal((await call(image.url)).status, 404);
cookie = adminCookie;
results.push({ check: "archive closes portfolio and media", status: "pass" });
const wrongFile = new FormData();
wrongFile.append(
  "file",
  new File(["<svg></svg>"], "bad.png", { type: "image/png" }),
);
assert.equal(
  (await call("/api/v1/admin/media", "POST", wrongFile)).status,
  415,
);
results.push({ check: "forged image MIME rejected", status: "pass" });
assert.equal((await call("/api/auth/sign-out", "POST", {})).status, 200);
assert.equal((await call("/api/v1/admin/records")).status, 401);
results.push({ check: "logout revokes server access", status: "pass" });
writeFileSync(
  "docs/evidence/http-smoke.json",
  JSON.stringify({ date: "2026-10-05", origin, results }, null, 2),
);
console.log(
  JSON.stringify({
    checks: results.length,
    status: "pass",
    evidence: "docs/evidence/http-smoke.json",
  }),
);
