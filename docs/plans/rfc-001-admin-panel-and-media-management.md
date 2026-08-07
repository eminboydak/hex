---
rfc_id: RFC-001
title: Admin panel & media management
author: emin
status: Draft
created: 2026-08-07
updated: 2026-08-07
related_adrs: [ADR-0001]
tags: [admin, auth, storage, ui]
---

# RFC-001: Admin panel & media management

## Status

- 2026-08-07 — Draft

## Context and Motivation

The site currently has no admin UI; posts are seeded from `_raw_posts/*.md` into D1. To write and maintain content without manual SQL, we need: (1) an authenticated admin panel with a markdown editor, (2) CRUD over posts + tags via an API, and (3) image upload to R2 with sensible defaults (free-tier friendly, no paid image transform). The full constraints live in `AGENTS.md` and `DESIGN.md`: Edge SSR, monolithic embedded Hono, zero tracking, zero client JS by default (intentional islands only), Catppuccin visual system.

## Goals

- Authenticated `/admin` with post list (drafts included) and `/admin/editor` (markdown editor + live preview).
- CRUD API under `/api/admin/*` for posts (and their tags).
- Image upload: drop/paste → resize → webp → R2, returning a CDN URL.
- Everything free-tier viable; no Cloudflare Images/Resizing, no WASM image libs in the Worker.

## Non-Goals

- Multi-user / role-based access (single admin only).
- Custom session/cookie auth (handled by Cloudflare Access — see ADR-0001).
- Full asset management UI (only upload-while-editing for now).
- Guestbook/gallery admin (future phases).

## Proposed Solution

- **Auth:** Cloudflare Access JWT verification (decided in [ADR-0001](../adr/0001-use-cloudflare-access-for-admin-auth.md)).
- **API:** `/api/admin/posts` (GET list incl. drafts, POST create), `/api/admin/posts/:id` (PUT update, DELETE remove — cascading explicit `post_tags` cleanup). `/api/admin/upload?type=blog` accepts multipart, stores bytes in R2.
- **Editor:** `src/components/islands/MarkdownEditor.tsx` (Preact, `client:visible`) — textarea + `marked` live preview, drag/paste → `<canvas>` resize (longest edge ≤1600px) → `toBlob('image/webp', 0.82)` → upload → insert markdown image.
- **Storage:** hybrid R2 layout `blog/YYYY/MM/<ulid>.webp`, ULID generated server-side. Public via `cdn.eminboydak.com`.
- **Visual:** strict continuity — reuse `DESIGN.md` Catppuccin tokens and existing typography/border rhythm.

## Alternatives Considered

- **Auth — shared-secret:** rejected as primary (see ADR-0001).
- **Upload — server-side resize (WASM photon):** sharper output but adds a WASM binary and risks the 10ms Worker CPU budget per request. Rejected for the free tier.
- **Upload — original bytes, no resize:** simplest, but unbounded payload sizes and no automatic optimization. Rejected in favor of client-side resize.
- **Bucket layout — flat or date-only:** less scalable than content-type × date hybrid (worse prefix partitioning, harder cleanup).

## Open Questions

- Max upload payload size after client resize (enforce a hard cap in the API?).
- Whether to also persist media metadata in a future `media` table, or keep the markdown as the single source of truth for now.

## Implementation Plan

1. `src/lib/slugify.ts` — Turkish-aware slugify + inline ULID generator.
2. `src/lib/auth.ts` — `verifyCfAccessToken` (jose + JWKS cache).
3. `src/lib/image.ts` (client) — `resizeToWebp(file, maxEdge)`.
4. `src/lib/db.ts` — `getAllPosts`, `createPost`, `updatePost`, `deletePost`.
5. `src/pages/api/[...path].ts` — `/api/admin/*` sub-router + auth middleware + `/upload`.
6. `src/pages/admin/index.astro`, `src/pages/admin/editor.astro`.
7. `src/components/islands/MarkdownEditor.tsx`.
8. `wrangler.toml` + types — `ADMIN_AUD` var; `.dev.vars` dev fallback.

Verification: `pnpm check`, `pnpm build`, `wrangler deploy --dry-run`, token/JWT-bearing `curl` against `/api/admin/*` + a real R2 upload.

## Success Metrics

- An admin can create, edit, and delete a post entirely from the browser (no SQL).
- Pasted images auto-resize to ≤1600px webp and render from `cdn.eminboydak.com`.
- No client JS ships to the public site (admin island only loads on `/admin/editor`).

## References

- [ADR-0001 — Use Cloudflare Access for admin auth](../adr/0001-use-cloudflare-access-for-admin-auth.md)
- `DESIGN.md` §4 (Admin Panel & Auth), §5 (Media Storage)
- `AGENTS.md` — architecture hard constraints
