-- Hex — Cloudflare D1 schema
-- Source of truth: DESIGN.md §2. Do not diverge without updating DESIGN.md.

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  excerpt TEXT,
  status TEXT CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS kv_store (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
