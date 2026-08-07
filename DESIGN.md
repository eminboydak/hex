# DESIGN.MD - SYSTEM & VISUAL SPECIFICATION

## 1. TECHNICAL STACK
- **Environment:** Node.js LTS (v22+)
- **Framework:** Astro (Latest Stable / LTS) via Edge SSR
- **Adapter:** `@astrojs/cloudflare`
- **Backend Router:** Hono (embedded)
- **UI Islands:** Preact (TSX)
- **Styling:** Tailwind CSS
- **Database:** Cloudflare D1 (SQLite)
- **Media Storage:** Cloudflare R2
- **Auth Layer:** Cloudflare Zero Trust (Edge Access Control for `/admin`)

## 2. DATABASE SCHEMA (`schema.sql`)

```sql
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
```

## 3. FRONTEND & VISUAL SYSTEM (POETIC INK x CATPPUCCIN MACCHIATO)

### Visual Philosophy
A personal digital workspace, workshop, and poetic journal. Combines poetic editorial typography, raw ink/brutalism line structures, and the balanced Catppuccin Macchiato/Latte color palette. Layouts are content-first, asymmetric where appropriate, and keep structural borders visible.

### Color Tokens (Catppuccin Palette)
- **Dark Mode (Catppuccin Macchiato - Default):**
  - Background (`--bg-base`): `#24273a`
  - Surface (`--bg-surface`): `#1e2030`
  - Border (`--border-color`): `#363a4f`
  - Text Primary (`--text-main`): `#cad3f5`
  - Text Muted (`--text-muted`): `#a5adce`
  - Accent Mauve (`--accent`): `#c6a0f6`
  - Accent Peach (`--accent-alt`): `#f5a97f`
  - Accent Sapphire (`--accent-subtle`): `#7dc4e4`
- **Light Mode (Catppuccin Latte):**
  - Background (`--bg-base`): `#eff1f5`
  - Surface (`--bg-surface`): `#e6e9ef`
  - Border (`--border-color`): `#ccd0da`
  - Text Primary (`--text-main`): `#4c4f69`
  - Text Muted (`--text-muted`): `#6c6f85`
  - Accent Mauve (`--accent`): `#8839ef`
  - Accent Peach (`--accent-alt`): `#fe640b`

### Typography (Full Turkish Character Support)
- **Headings / Display:** `Cormorant Garamond` or `Syne` (Poetic, sharp, high-contrast serif/display).
- **Body Text:** `Lora` or `Newsreader` (Editorial reading experience, journal aesthetic).
- **Metadata, Codes, Badges:** `JetBrains Mono` or `Space Mono` (Raw typewriter/technical feel).

### Guestbook Identity & Geometric Avatars
- **ID Generator:** Converts database auto-increment ID to a deterministic, 32-bit obfuscated hex string via a bijective cipher (0% collision risk).
- **Display Format:** Standardized 10-character string (strictly lowercase `0x` prefix followed by 8 hex characters, e.g., `0x7f8a9b0c`).
- **Geometric Identicon:** Pure SVG component generated deterministically from the 32-bit hex hash. Uses Catppuccin color tokens (`Mauve`, `Peach`, `Sapphire`, `Rosewater`) to render geometric pixel patterns locally without external network calls.
