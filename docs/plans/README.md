# Plans & RFCs

Proposals that weigh alternatives *before* a decision is made. Once a proposal is accepted, it typically spawns one or more ADRs in [`../adr/`](../adr/) that record the final decision as immutable history.

## Lifecycle

```
Draft → Proposed → Accepted | Rejected → Implemented
                                  │
                                  └─▶ spawns ADR(s) → CHANGELOG entry on release
```

## Conventions

- **Filename:** `rfc-NNN-kebab-title.md` (zero-padded 3-digit sequential number, lowercase kebab-case title).
- **Frontmatter:** `rfc_id`, `title`, `author`, `status`, `created`, `updated`, `related_adrs`, `tags`.
- **Status sync:** keep the `## Status` section in sync with the frontmatter `status`, with dated transition lines.
- **Language:** English.

## Index

| # | Title | Status | Updated |
| --- | --- | --- | --- |
| [RFC-001](./rfc-001-admin-panel-and-media-management.md) | Admin panel & media management | Draft | 2026-08-07 |

<!-- Append new RFCs to this table. Keep it in numerical order. -->
