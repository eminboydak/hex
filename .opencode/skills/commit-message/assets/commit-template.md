# Commit Message Template

Fill in the bracketed parts. Delete optional sections that don't apply.

```
<type>(<scope>): <imperative summary, lowercase, ≤72 chars, no period>

<optional body — what & why, wrapped at 72 chars. Reference ADR/RFC/issue.>

<optional footer>
BREAKING CHANGE: <what breaks and how to migrate>
refs ADR-XXXX
closes #XXX
```

## Quick checklist before committing

- [ ] Exactly one canonical type
- [ ] Scope matches history (or omitted)
- [ ] Subject imperative + lowercase start + ≤72 chars + no trailing period
- [ ] Body explains why, not how
- [ ] No secrets staged
- [ ] No unrelated changes mixed in (split if needed)
- [ ] Language matches repo (English for this repo)
