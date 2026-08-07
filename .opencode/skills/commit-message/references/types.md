# Conventional Commit Types

Canonical types (Conventional Commits v1.0.0). Pick exactly one per commit.

## feat
A new feature visible to the user.
```
feat(blog): add reading-time estimate to post header
feat(auth): support Cloudflare Access JWT verification
```

## fix
A bug fix.
```
fix(api): return 404 instead of 500 on unknown slug
fix(db): handle null excerpt in post queries
```

## docs
Documentation only (README, DESIGN.md, ADRs, RFCs, CHANGELOG, comments that are purely doc).
```
docs(adr): record Cloudflare Access auth decision (ADR-0001)
docs(readme): document R2 bucket layout
```

## style
Formatting, whitespace, semicolons, import ordering — no production logic change.
```
style(ui): sort tailwind class order in PostCard
```

## refactor
Code change that neither fixes a bug nor adds a feature.
```
refactor(api): extract requireAdmin middleware
```

## perf
Performance improvement.
```
perf(db): add index on posts(published_at)
```

## test
Adding or correcting tests.
```
test(api): cover slug-not-found path
```

## build
Build system, dependencies, package config, tooling that affects the build.
```
build(deps): pin jose to ^5
build: enable remoteBindings by default
```

## ci
CI pipeline / config files.
```
ci: add typecheck step before deploy
```

## chore
Maintenance, misc tasks that don't modify src or test files.
```
chore: regenerate cf types
chore(release): bump version to 0.2.0
```

## revert
Revert a prior commit. Body should reference the reverted SHA.
```
revert: feat(auth): support Cloudflare Access JWT verification

This reverts commit <sha>. Reason: ...
```
