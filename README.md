# hex

A content-first personal site built with **Astro**, **Hono**, and **Cloudflare D1**, rendered entirely at the edge (SSR) on **Cloudflare Workers**. It ships zero client-side JavaScript by default, is themed with the Catppuccin palette, and has full Turkish character support.

`DESIGN.md` is the source of truth for the database schema, color tokens, typography, and identity system. `AGENTS.md` holds the hard architectural constraints. This README is the onboarding guide.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Astro 7 (SSR, `output: 'server'`) |
| Edge runtime / deploy | Cloudflare Workers via `@astrojs/cloudflare` |
| API | Hono, embedded in an Astro API route |
| Database | Cloudflare D1 (SQLite) |
| Media | Cloudflare R2 |
| Interactive UI | Preact islands (only when genuinely needed) |
| Styling | Tailwind CSS v4 + Catppuccin Macchiato/Latte tokens |
| Fonts | Self-hosted Google Fonts (`@fontsource`), latin-ext subset |

## Project layout

```
src/
  components/ui/       pure .astro (Header, Footer, PostCard)
  components/islands/  Preact .tsx (interactive only)
  layouts/             BaseLayout.astro, PostLayout.astro
  pages/api/           embedded Hono router ([...path].ts)
  pages/blog/          [slug].astro (Edge SSR post)
  pages/index.astro    post listing
  styles/              Tailwind + global CSS + Catppuccin tokens
  lib/                 types, D1 query helpers, markdown renderer
schema.sql             D1 schema (mirrors DESIGN.md §2)
seed.sql               seed posts (generated from _raw_posts/*.md)
_raw_posts/            Turkish source markdown (seed reference; do not edit casually)
wrangler.toml          Worker config + D1/R2 bindings
astro.config.mjs       adapter, integrations, platformProxy
```

## Prerequisites

- **Node.js 22+**
- **pnpm 10+**
- A Cloudflare account, authenticated locally via `wrangler login`
- A D1 database and an R2 bucket (see first-time setup)

## First-time setup

```bash
pnpm install

# Create the remote resources once:
wrangler d1 create hex            # -> copy the printed database_id into wrangler.toml
wrangler r2 bucket create hex-assets

# Apply schema + seed posts to the PRODUCTION database:
pnpm db:push                      # wrangler d1 execute hex --remote --file=./schema.sql
pnpm db:seed                      # wrangler d1 execute hex --remote --file=./seed.sql

pnpm dev
```

> Put the `database_id` returned by `wrangler d1 create hex` into `wrangler.toml` under `[[d1_databases]]`.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Astro dev server. With `remoteBindings: true`, it reads the **production** D1/R2 bindings (no local stub data to maintain). |
| `pnpm build` | Production build → `dist/` (`dist/client` assets + `dist/server` Worker). |
| `pnpm check` | Typecheck (`astro check`, not `tsc`). |
| `pnpm preview` | Run the built Worker locally (`wrangler dev --config dist/server/wrangler.json`). |
| `pnpm deploy` | Deploy the Worker (`wrangler deploy --config dist/server/wrangler.json`). |
| `pnpm db:push` | Apply `schema.sql` to the **remote** D1. |
| `pnpm db:seed` | Apply `seed.sql` to the **remote** D1 (idempotent, slug-scoped). |
| `pnpm cf-typegen` | Regenerate `worker-configuration.d.ts` after editing `wrangler.toml`. |

## Database

- **Schema:** `schema.sql` mirrors `DESIGN.md` §2 (`posts`, `tags`, `post_tags`, `guestbook`, `kv_store`). Apply with `pnpm db:push`.
- **Seed:** `seed.sql` is generated from `_raw_posts/*.md` (title → `title`, body → `content_markdown`, `description` → `excerpt`, `publishDate` → `published_at`, filename → `slug`). It clears its known slugs before inserting, so it is safe to re-run. To regenerate after editing source posts, re-run the frontmatter extractor that produced it.
- **Accessing bindings:** always via `import { env } from 'cloudflare:workers'` → `env.DB` / `env.BUCKET`. D1 helpers in `src/lib/db.ts` take a `D1Database` so they work from both pages and the Hono router.

## Build & deploy

**Deploy target is a Cloudflare Worker, not Cloudflare Pages.** The `@astrojs/cloudflare` adapter is a Workers adapter: it emits `dist/server/wrangler.json` containing the Worker entry (`main`), static assets (`assets.binding = "ASSETS"`), and the D1/R2 bindings from `wrangler.toml`.

```bash
pnpm build
pnpm deploy      # wrangler deploy --config dist/server/wrangler.json
```

Connect the repo through the **Workers Git integration** (Workers & Pages → Create → Worker → Connect to Git). Set the build command to `pnpm install && pnpm build` and the deploy command to `wrangler deploy --config dist/server/wrangler.json`.

### Why not Pages?

Cloudflare Pages is in maintenance and the `@astrojs/cloudflare` adapter no longer targets it. If you add `pages_build_output_dir` to `wrangler.toml`, Cloudflare rejects the generated config with:

```
The name 'ASSETS' is reserved in Pages projects.
```

…and additionally forbids the `main` + `pages_build_output_dir` combination. **Do not set `pages_build_output_dir`.** The `ASSETS` binding is legitimate and required for Workers static assets.

## Architecture notes

- **Monolithic API:** Hono runs embedded in `src/pages/api/[...path].ts` (`export const ALL`). There is no standalone server. The router is mounted at `/api` and exposes `GET /api/posts` and `GET /api/posts/:slug`.
- **Binding access:** `Astro.locals.runtime.env` was removed in Astro 6+. Use `import { env } from 'cloudflare:workers'`. The `cloudflare:workers` module has no shipped types, so `src/env.d.ts` declares it. Run `pnpm cf-typegen` after changing `wrangler.toml`.
- **Zero client JS by default:** pages are static `.astro` components. Preact islands (`.tsx` under `src/components/islands/`) are used only for genuine interactivity. The only intentional client script is Astro's View Transitions (`<ClientRouter />`).
- **Theme switching:** Catppuccin Macchiato (dark, default) and Latte (light) are applied via CSS custom properties and `prefers-color-scheme` — **no JavaScript** is required to switch.
- **TypeScript:** `strict: true`, no `any`. TypeScript is pinned to `^6` (the `@astrojs/check` peer ceiling; do not bump to 7). `package.json` declares `pnpm.onlyBuiltDependencies: [esbuild, workerd]` — required because pnpm 10 blocks build scripts by default.

## Constraints

- **No tracking, ever:** no analytics, cookies, or consent banners.
- **pnpm only** (not npm/yarn).
- **Fonts** must keep `subsets: ['latin-ext']` (Turkish characters). Self-hosted via `@fontsource`; import the latin-ext subset CSS specifically.

## Design

See `DESIGN.md` for the full system and visual specification (Poetic Ink × Catppuccin Macchiato): color tokens, typography pairings, the guestbook identity / geometric identicon system, and the future-proof schema. Do not duplicate its contents elsewhere — reference it.
