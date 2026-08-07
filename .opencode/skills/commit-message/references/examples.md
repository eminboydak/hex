# Commit Message Examples (good vs. bad)

All examples assume this repo: Astro + Hono + Cloudflare D1/R2, English commit messages.

## Good

```
feat(auth): verify Cloudflare Access JWT for /api/admin/*

Add requireAdmin middleware that decodes cf-access-jwt-assertion
against the configured AUD using jose with JWKS caching. Returns 401
on missing/invalid token. Defense-in-depth on top of the edge Access
policy.

refs ADR-0001
```

```
fix(db): cascade-delete post_tags when a post is removed

post_tags has ON DELETE CASCADE but D1 FK enforcement is unreliable;
explicitly DELETE from post_tags in removePost() to avoid orphans.
```

```
docs(storage): document hybrid R2 bucket layout
```

```
build(deps): add jose ^5 for JWT verification
```

```
refactor(api): group admin routes under /api/admin prefix
```

## Bad (do not do this)

- `updated files` — no type, no imperative, no scope.
- `feat: Added new auth` — past tense, capitalized "Added".
- `fix(API): bug` — vague; ALLCAPS scope inconsistent with history.
- `feat(auth): add jwt auth!!!` — trailing punctuation, hype.
- `chore: stuff` — uninformative.
- A 200-char subject line.
- Body that explains *how* line-by-line (the diff already shows that).
- Mixing two unrelated changes in one commit (e.g. auth refactor + a typo fix).

## Scope conventions for this repo

Use these scopes when they fit; otherwise omit the scope:
- `auth` — authentication / authorization
- `api` — Hono router, endpoints
- `db` — D1 schema, queries, migrations
- `storage` / `r2` — media storage, bucket layout
- `ui` — .astro components, layouts
- `islands` — Preact .tsx
- `blog` — blog-specific features
- `docs` — documentation
- `build` / `ci` / `deps` / `chore` — tooling
