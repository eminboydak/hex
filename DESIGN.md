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

## 4. ADMIN PANEL & AUTH (PHASE 3)

### Authentication Model
- **Mechanism:** Cloudflare Access JWT verification (Zero Trust).
- **Token source:** `cf-access-jwt-assertion` request header, issued by the Cloudflare Access edge policy protecting `/admin/*`.
- **Verification:** `jose` library decodes the JWT and verifies signature + audience (`ADMIN_AUD`) against Cloudflare's JWKS endpoint, cached in-memory across Worker invocations. Unauthenticated/invalid requests get HTTP 401.
- **Defense in depth:** the Access edge policy is the primary gate; JWT verification in the Hono `/api/admin/*` middleware is a second layer. Both must pass.
- **Visual approach:** Strict continuity — the admin UI reuses `DESIGN.md` tokens (Catppuccin palette, existing typography/border rhythm). Minimal, content-first control panel; no new visual motifs.

### Admin UI Layout
- `/admin` — post list (drafts included), status badges, edit/new actions. SSR `.astro`.
- `/admin/editor` — markdown editor with live preview, image upload (drop/paste), form (title/slug/excerpt/status). `?id=` loads an existing post (SSR), otherwise new post.
- **Editor island:** `src/components/islands/MarkdownEditor.tsx` (Preact) — the only intentional client JS in the admin area. Features: live preview via `marked`, client-side image resize → webp upload, create/update submission.

### Slug System (WordPress Style)
- **Generation:** Auto-generated from title (Turkish aware, WordPress sanitization)
- **Mutability:** Mutable (title change updates slug)
- **Manual editing:** User can override (WordPress style "Edit Slug" button)
- **Uniqueness:** Auto suffix on conflict (slug-2, slug-3)
- **Redirects:** None (slug break acceptable for personal blog)
- **SEO:** 60 character limit, keyword-first, Turkish characters preserved (çğıöşü)
- **Fallback:** Random UUID if title is empty

## 5. MEDIA STORAGE (R2)

### Bucket Layout (Hybrid: content-type × date)
```
<bucket-root>/
├── blog/YYYY/MM/<ulid>.webp            # blog post media (featured + inline)
├── gallery/YYYY/MM/<ulid>.webp         # (future) gallery images
├── guestbook/YYYY/MM/<ulid>.<ext>      # (future) guestbook uploads/avatars
├── assets/                             # static site assets (logos, icons, fonts)
│   ├── logos/
│   ├── icons/
│   └── fonts/
└── archive/<type>/YYYY/MM/<ulid>.<ext> # lifecycle-archived media
```

### Naming & Upload Flow
- **Filename:** `<uuid>.<ext>` — UUID v4 generated server-side (lexicographically time-sortable, but simpler than ULID). No client-supplied filenames stored verbatim.
- **Resize:** performed client-side in the editor island via `<canvas>` (longest edge ≤ 1600px), then `canvas.toBlob('image/webp', 0.82)`. The Worker stores bytes as-is — no server-side image processing, no paid Cloudflare Images/Resizing, no WASM in the Worker.
- **Endpoint:** `POST /api/admin/upload?type=blog` (multipart) → `env.BUCKET.put('blog/2026/08/<uuid>.webp', ...)` → returns the public CDN URL.
- **Public URL:** `https://cdn.eminboydak.com/blog/2026/08/<uuid>.webp` (R2 bucket served via the `cdn.eminboydak.com` custom domain).

### Performance Notes
- Prefix partitioning: each `content-type/YYYY/MM/` acts as a separate prefix, scaling request rate across partitions.
- Folder depth ≤ 5 levels (optimal for R2/S3 listing performance).
- CDN: long `Cache-Control` on immutable media (`<ulid>` content-addressed); short TTL on anything mutable.

## 6. DOCUMENTATION STANDARDS
- **Language:** English for all documentation artifacts.
- **Location:** `docs/` tree (ADR, RFC/plans, changelog). See `AGENTS.md` "Documentation standards" and the `docs-generator` skill for templates and lifecycle rules.
