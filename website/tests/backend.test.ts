import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID, randomBytes } from "node:crypto";
process.env.DATABASE_PATH = join(
  mkdtempSync(join(tmpdir(), "mastercad-test-")),
  "test.sqlite",
);
process.env.BETTER_AUTH_SECRET = randomBytes(48).toString("hex");
process.env.APP_URL = "http://127.0.0.1:3000";
const { getDb } = await import("../src/lib/db");
const { createInquiry, updateInquiry, deleteInquiry } =
  await import("../src/lib/inquiries");
const { saveRecord, publishRecord, mediaUsed } =
  await import("../src/lib/record-actions");
const { publicItem, allRecords } = await import("../src/lib/content");
const { ApiError, requireAdmin, checkOrigin } =
  await import("../src/lib/security");
const { getAuth, authOptions } = await import("../src/lib/auth");
const { getMigrations } = await import("better-auth/db/migration");
await (await getMigrations(authOptions())).runMigrations();
const payload = {
  name: "Penguji Lokal",
  email: "qa@example.test",
  message: "Butuh model CAD assembly untuk pengujian integrasi.",
  consent: true,
};
const isStatus = (status: number) => (e: unknown) =>
  e instanceof ApiError && e.status === status;

test("invalid consent and short brief do not store PII", () => {
  const before = (
    getDb().prepare("SELECT count(*) n FROM inquiries").get() as { n: number }
  ).n;
  assert.throws(
    () =>
      createInquiry(
        { ...payload, consent: false, message: "short" },
        randomUUID(),
        "invalid",
      ),
    isStatus(422),
  );
  assert.equal(
    (getDb().prepare("SELECT count(*) n FROM inquiries").get() as { n: number })
      .n,
    before,
  );
});
test("idempotency returns the same reference and conflict rejects changed payload", () => {
  const key = randomUUID(),
    first = createInquiry(payload, key, "retry"),
    second = createInquiry(payload, key, "retry");
  assert.equal(first.reference, second.reference);
  assert.equal(second.replay, true);
  assert.throws(
    () =>
      createInquiry(
        { ...payload, message: "Changed payload with valid text length." },
        key,
        "retry",
      ),
    isStatus(409),
  );
  assert.equal(
    (
      getDb()
        .prepare("SELECT count(*) n FROM inquiries WHERE reference=?")
        .get(first.reference) as { n: number }
    ).n,
    1,
  );
});
test("network and email rate limits are enforced", () => {
  for (let i = 0; i < 3; i++)
    createInquiry(
      { ...payload, email: "limited@example.test" },
      randomUUID(),
      "rate",
    );
  assert.throws(
    () =>
      createInquiry(
        { ...payload, email: "limited@example.test" },
        randomUUID(),
        "rate",
      ),
    isStatus(429),
  );
});
test("draft edits preserve published snapshots and stale versions conflict", () => {
  const original = allRecords("service")[0],
    title = original.published.title;
  const saved = saveRecord(
    {
      type: "service",
      slug: original.slug,
      payload: { ...original.draft, title: "Draft only" },
      expectedVersion: original.version,
      sortOrder: 0,
    },
    "qa",
    original.id,
  );
  assert.equal(publicItem("service", original.slug)?.title, title);
  assert.throws(
    () =>
      saveRecord(
        {
          type: "service",
          slug: original.slug,
          payload: original.draft,
          expectedVersion: original.version,
        },
        "qa",
        original.id,
      ),
    isStatus(409),
  );
  publishRecord(original.id, "publish", saved.version, "qa");
  assert.equal(publicItem("service", original.slug)?.title, "Draft only");
});
test("portfolio project requires permission and images, unpublish hides media", () => {
  const mediaId = randomUUID();
  getDb()
    .prepare("INSERT INTO media VALUES (?,?,?,?,?,?,?)")
    .run(
      mediaId,
      mediaId + ".webp",
      "image/webp",
      123,
      1,
      1,
      new Date().toISOString(),
    );
  const image = "/api/v1/media/" + mediaId;
  let draft = saveRecord(
    {
      type: "portfolio",
      slug: "private-test",
      payload: {
        title: "Test project",
        category: "Mekanikal",
        description: "Integration test",
        kind: "PROJECT",
        permission: false,
        images: [image],
        alts: ["Test image"],
      },
    },
    "qa",
  );
  assert.equal(mediaUsed(mediaId, true), false);
  assert.throws(
    () => publishRecord(draft.id, "publish", draft.version, "qa"),
    isStatus(422),
  );
  draft = saveRecord(
    {
      type: "portfolio",
      slug: draft.slug,
      payload: { ...draft.draft, permission: true },
      expectedVersion: draft.version,
    },
    "qa",
    draft.id,
  );
  const published = publishRecord(draft.id, "publish", draft.version, "qa");
  assert.equal(mediaUsed(mediaId, true), true);
  assert.ok(publicItem("portfolio", draft.slug));
  publishRecord(draft.id, "unpublish", published.version, "qa");
  assert.equal(mediaUsed(mediaId, true), false);
  assert.equal(publicItem("portfolio", draft.slug), undefined);
});
test("inquiry state transitions and stale update guards", () => {
  const result = createInquiry(
    { ...payload, email: "state@example.test" },
    randomUUID(),
    "state",
  );
  const item = getDb()
    .prepare("SELECT id,version FROM inquiries WHERE reference=?")
    .get(result.reference) as { id: string; version: number };
  assert.throws(
    () =>
      updateInquiry(
        item.id,
        { status: "CLOSED", expectedVersion: item.version },
        "qa",
      ),
    isStatus(422),
  );
  updateInquiry(
    item.id,
    { status: "IN_PROGRESS", expectedVersion: item.version },
    "qa",
  );
  assert.throws(
    () =>
      updateInquiry(
        item.id,
        { status: "CLOSED", expectedVersion: item.version },
        "qa",
      ),
    isStatus(409),
  );
  updateInquiry(
    item.id,
    { status: "CLOSED", expectedVersion: item.version + 1 },
    "qa",
  );
});
test("unsafe origin is rejected before a mutation", () => {
  assert.throws(
    () =>
      checkOrigin(
        new Request("http://127.0.0.1:3000", {
          headers: { origin: "https://hostile.example" },
        }),
      ),
    isStatus(403),
  );
  assert.throws(
    () => checkOrigin(new Request("http://127.0.0.1:3000")),
    isStatus(403),
  );
});
test("deletion removes personal data and idempotency but retains only an ID ledger", async () => {
  const result = createInquiry(
    { ...payload, email: "delete@example.test" },
    randomUUID(),
    "delete",
  );
  const row = getDb()
    .prepare("SELECT id,version FROM inquiries WHERE reference=?")
    .get(result.reference) as { id: string; version: number };
  deleteInquiry(row.id, row.version, "qa");
  assert.equal(
    getDb().prepare("SELECT id FROM inquiries WHERE id=?").get(row.id),
    undefined,
  );
  assert.equal(
    getDb()
      .prepare("SELECT inquiry_id FROM idempotency WHERE inquiry_id=?")
      .get(row.id),
    undefined,
  );
  const { deletionLedger } = await import("../src/lib/deletion-ledger");
  assert.ok(deletionLedger().some((entry) => entry.id === row.id));
  assert.equal(
    JSON.stringify(deletionLedger()).includes("delete@example.test"),
    false,
  );
});
test("anonymous admin is rejected and signup disabled", async () => {
  await assert.rejects(
    requireAdmin(new Request("http://127.0.0.1:3000")),
    isStatus(401),
  );
  await assert.rejects(
    getAuth().api.signUpEmail({
      body: {
        email: "no-signup@example.test",
        password: randomBytes(18).toString("base64url"),
        name: "No signup",
      },
    }),
  );
});
test("active admin guard, deactivation and logout revoke access", async () => {
  const { betterAuth } = await import("better-auth");
  const password = randomBytes(18).toString("base64url"),
    email = "guard@example.test";
  const created = await betterAuth(authOptions(true)).api.signUpEmail({
    body: { email, password, name: "Test Admin" },
  });
  getDb()
    .prepare("INSERT INTO admin_profiles(user_id,active) VALUES (?,1)")
    .run(created.user.id);
  const res = await getAuth().api.signInEmail({
    body: { email, password },
    headers: new Headers({ origin: process.env.APP_URL! }),
    asResponse: true,
  });
  const cookie = res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  assert.ok(cookie);
  const request = new Request(process.env.APP_URL!, { headers: { cookie } });
  assert.equal((await requireAdmin(request)).id, created.user.id);
  getDb()
    .prepare("UPDATE admin_profiles SET active=0 WHERE user_id=?")
    .run(created.user.id);
  await assert.rejects(requireAdmin(request), isStatus(403));
  getDb()
    .prepare("UPDATE admin_profiles SET active=1 WHERE user_id=?")
    .run(created.user.id);
  await getAuth().api.signOut({
    headers: new Headers({ cookie, origin: process.env.APP_URL! }),
  });
  await assert.rejects(requireAdmin(request), isStatus(401));
});
