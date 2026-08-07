# AGENTS.md

Astro + Hono + Cloudflare D1 personal site (Edge SSR).
`DESIGN.md` is the source of truth for DB schema, color tokens, typography, and identity system — read it before any UI or DB work. Do not duplicate its contents here; reference it.

`_raw_posts/*.md` are Turkish seed posts (frontmatter: `title`, `publishDate`, `description`, `tags`) — seed/reference data for D1; do not delete or rewrite. Google Fonts must use `subsets: ['latin-ext']` for Turkish character support.

## Architecture (hard constraints)
- **Runtime:** Node.js 22+; Cloudflare Pages Edge SSR via `@astrojs/cloudflare`.
- **Monolithic:** Hono is embedded in `src/pages/api/[...path].ts`. Never create a standalone API server.
- **Bindings (exact names):** D1 = `DB`, R2 = `BUCKET`, declared in `wrangler.toml`.
- **Binding access:** Read D1/R2 via `import { env } from 'cloudflare:workers'` (→ `env.DB`, `env.BUCKET`). `Astro.locals.runtime.env` was **removed in Astro 6+** — never use it. For Hono, `app.fetch(req, env, ctx.locals.cfContext)` populates `c.env`. The `cloudflare:workers` module has no shipped types; `src/env.d.ts` declares it (run `pnpm cf-typegen` after editing `wrangler.toml`).
- **Zero tracking:** No analytics, cookies, or consent banners — ever.
- **Islands:** Default to static `.astro` components. Use Preact (`.tsx`) only for genuine interactivity; attach `client:visible` / `client:idle` intentionally. Pages render with zero client JS by default.

## Project layout (follow exactly)
```
src/
  components/ui/       pure .astro (Header, Footer, PostCard)
  components/islands/  Preact .tsx (interactive only)
  layouts/             BaseLayout.astro, PostLayout.astro
  pages/api/           Hono router ([...path].ts)
  pages/blog/          [slug].astro
  pages/index.astro
  styles/              Tailwind + global CSS
  lib/                 utils + D1 client helpers
```

## Code standards
- TypeScript `strict: true`; no `any`.
- Tailwind utility classes exclusively.
- Path aliases: `@/components/*`, `@/layouts/*`, `@/lib/*`.
- `pnpm` (not npm). TypeScript pinned to `^6` (`@astrojs/check` peer ceiling; do not bump to 7). `package.json` declares `pnpm.onlyBuiltDependencies: [esbuild, workerd]` — required, pnpm 10 blocks build scripts otherwise.

## Communication language
- **Interaction with the user:** Turkish. Reply in Turkish in this session.
- **All artifacts (code, docs, commits, README, ADRs, RFCs, CHANGELOG, comments):** English. Exception: `_raw_posts/*.md` seed Turkish posts.
- **Visual workflow options below** are presented in Turkish, but their *content* is English artifacts.

## Workflow protocol
Before implementing any new page, module, component, or interactive feature, do NOT write UI directly. Offer the user 3 options (in Turkish) and wait for approval:
- **A) Strict continuity** — exact `DESIGN.md` tokens/layouts, no visual deviation.
- **B) Experimental variation** — new feature-specific motif (e.g. terminal frame, zine column, vintage widget) while keeping Catppuccin colors.
- **C) Custom prompt** — user supplies the visual/design brief.

## Commit standards
- **Format:** Conventional Commits v1.0.0 — `<type>(<scope>): <imperative summary>`.
- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Scope:** optional; reuse scopes from `git log` (`auth`, `api`, `db`, `storage`, `ui`, `islands`, `blog`, `docs`, `build`, `ci`).
- **Subject:** imperative, lowercase start, ≤72 chars, no trailing period.
- **Breaking change:** `!` before colon or `BREAKING CHANGE:` footer.
- **Language:** English commit messages only.
- **Automation:** the `commit-message` skill (`.opencode/skills/commit-message/`) generates compliant messages; invoke it when the user asks to commit.

## Documentation standards
- **Language:** English for all docs.
- **Artifacts (in `docs/`):**
  - **ADR** — `docs/adr/<NNNN>-<kebab>.md`, sequential, append-only (supersede, never rewrite). Michael Nygard format.
  - **RFC / plan** — `docs/plans/rfc-<NNN>-<kebab>.md`, lifecycle `Draft → Proposed → Accepted/Rejected → Implemented`.
  - **Changelog** — `docs/changelog/CHANGELOG.md`, [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) + [SemVer](https://semver.org/spec/v2.0.0.html). Edit `[Unreleased]`; cut a version only on release.
- **Automation:** the `docs-generator` skill (`.opencode/skills/docs-generator/`) creates/scaffolds these artifacts from templates.

## Verify before finishing
- `pnpm build` passes (Cloudflare build).
- `astro check` passes (this is the typecheck, not `tsc`).
- No client JS shipped unless an island was explicitly added (View Transitions are the only intentional client script).
