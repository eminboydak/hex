# Architecture Decision Records

Decisions are recorded as immutable history. Each ADR documents a single architectural choice: the context that forced it, the decision, and its consequences.

## Conventions

- **Filename:** `NNNN-kebab-title.md` (zero-padded 4-digit sequential number, lowercase kebab-case title).
- **Append-only:** never edit a shipped ADR in place. To change direction, create a new ADR and mark the old one `Status: Superseded by ADR-YYYY`.
- **Format:** Michael Nygard style — Context, Decision, Alternatives, Consequences (see `SKILL.md` references in `.opencode/skills/docs-generator/`).
- **Title:** present-tense imperative ("Use Cloudflare Access for admin auth").
- **Language:** English.

## Index

| # | Title | Status | Date |
| --- | --- | --- | --- |
| [0001](./0001-use-cloudflare-access-for-admin-auth.md) | Use Cloudflare Access for admin auth | Accepted | 2026-08-07 |

<!-- Append new ADRs to this table. Keep it in numerical order. -->
