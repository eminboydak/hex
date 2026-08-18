---
name: generate-wrangler-types
description: Run wrangler types to generate worker configuration types. Updates env.d.ts for Bindings and runtime APIs based on wrangler.toml configuration. Use before typecheck/build to keep types in sync.
---

# Generate Wrangler Types

## Workflow

1. Run wrangler types to generate `worker-configuration.d.ts` (or `.wrangler/types/runtime.d.ts` in older wrangler).
2. The generated file includes:
   - Env type for D1/DB, R2/BUCKET bindings
   - Runtime API types based on compatibility_date + flags
3. Commit the generated type file to git for CI verification.

## Usage

```bash
npx wrangler types
# or
pnpm wrangler types
```

Add this to `package.json` scripts to keep types up-to-date:

```json
{
  "scripts": {
    "types": "wrangler types"
  }
}
```

Or in CI/CD:

```yaml
- run: pnpm types && pnpm build && pnpm test
```

## Note on `--experimental-include-runtime`

If your Wrangler version > 3.66.0 && < 4.0.0, you need the `--experimental-include-runtime` flag. Newer versions include runtime types in `worker-configuration.d.ts` automatically.

## Type check after generation

After wrangler types, run:

```bash
pnpm check  # (or astro check)
```