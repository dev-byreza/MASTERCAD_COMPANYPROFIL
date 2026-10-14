PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS records (
 id TEXT PRIMARY KEY, type TEXT NOT NULL CHECK(type IN ('service','faq','page','portfolio','settings')),
 slug TEXT NOT NULL, draft TEXT NOT NULL, published TEXT,
 status TEXT NOT NULL DEFAULT 'Draft' CHECK(status IN ('Draft','Published','Archived')),
 version INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 UNIQUE(type,slug), CHECK(status != 'Published' OR published IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS records_public ON records(type,status,sort_order);
CREATE TABLE IF NOT EXISTS inquiries (
 id TEXT PRIMARY KEY, reference TEXT UNIQUE NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL,
 phone TEXT, company TEXT, service TEXT, message TEXT NOT NULL, consent_at TEXT NOT NULL, notice_version TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW','IN_PROGRESS','CLOSED')),
 version INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS inquiries_inbox ON inquiries(status,created_at);
CREATE TABLE IF NOT EXISTS idempotency (key_hash TEXT PRIMARY KEY, payload_hash TEXT NOT NULL, inquiry_id TEXT REFERENCES inquiries(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS rate_limits (subject TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS admin_profiles (user_id TEXT PRIMARY KEY, active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, filename TEXT NOT NULL, mime TEXT NOT NULL, bytes INTEGER NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit (id TEXT PRIMARY KEY, actor_id TEXT, action TEXT NOT NULL, entity_id TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS deletions (entity_id TEXT PRIMARY KEY, deleted_at TEXT NOT NULL);
