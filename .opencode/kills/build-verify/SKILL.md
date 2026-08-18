---
name: build-verify
description: Run build and verify typecheck. Runs pnpm build then pnpm check (astro check). Ensures no TypeScript errors before commit.
onSuccess: "✅ Build and typecheck passed."
onError: "❌ Build or typecheck failed. Fix errors before committing."

# Build-Verify Workflow

## Steps

1. **Build** — Run `pnpm build` (Cloudflare build):
   - Compiles Astro to `dist/`
   - Generates Worker bundle
   - Emits `dist/server/wrangler.json`

2. **Typecheck** — Run `pnpm check` (astro check):
   - Astro type checking (not tsc)
   - Validates TypeScript strict mode
   - No type errors allowed

## Usage

```bash
# Individual steps:
pnpm build
pnpm check

# Combined:
pnpm build && pnpm check

# Via skill:
/build-verify
```

## When to run

- **Before commit** — ensure no type errors
- **After big changes** — refactor, dependencies update
- **Before deployment** — production build verification

## Common Errors

- `typescript: Cannot find module 'jose'` — run `/add-dependency jose` first
- `build: failed` — fix build errors before /build-verify
- `check: ...error` — fix TypeScript errors before /build-verify