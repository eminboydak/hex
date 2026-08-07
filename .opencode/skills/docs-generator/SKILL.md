---
name: docs-generator
description: Generate and maintain project documentation artifacts — Architecture Decision Records (ADR), planning RFCs, and the CHANGELOG — following this repo's established standards. ACTIVATE whenever the user asks to record a decision, write an ADR/RFC, draft a design doc, update the changelog, or document an architectural choice in any language. Model-agnostic.
version: 1.0.0
compatibility: model-agnostic
metadata:
  domain: documentation
  artifacts: [adr, rfc, changelog]
---

# Documentation Generator

Create and maintain this repo's three documentation artifact types, all in **English**, in the `docs/` tree. Templates live in `references/`; copy them, never edit the templates in place.

## Artifact map

| Artifact | Location | Numbering | Template |
| --- | --- | --- | --- |
| ADR | `docs/adr/<NNNN>-<kebab-title>.md` | sequential, zero-padded 4 digits | `references/adr-template.md` |
| RFC / plan | `docs/plans/rfc-<NNN>-<kebab-title>.md` | sequential, 3 digits | `references/rfc-template.md` |
| Changelog | `docs/changelog/CHANGELOG.md` | SemVer `[MAJOR.MINOR.PATCH]` | `references/changelog-template.md` |

## When to create which artifact

- **ADR** — a decision has been *made* (a technology, a pattern, a constraint). Record it as immutable history. Status starts `Accepted`. Never rewrite a shipped ADR; supersede it with a new one and mark the old `Superseded by ADR-XXXX`.
- **RFC** — a decision is being *explored/proposed* before implementation. Use when there are alternatives to weigh. Lifecycle: `Draft → Proposed → Accepted | Rejected → Implemented`. An accepted RFC often spawns one or more ADRs.
- **Changelog** — a change is being *released*. Edit the `[Unreleased]` section; on release, cut a version entry. Never document unreleased work under a real version number.

## Workflow

1. **Identify the artifact type** from the user's intent (see table above). If unclear, ask once.
2. **Find the next number** by listing the target directory (`docs/adr/` or `docs/plans/`). Never reuse or skip numbers.
3. **Copy the template** from `references/` into the new file. Keep frontmatter and all section headers.
4. **Fill it in.** Keep it concise and decision-focused. Cross-reference related artifacts (e.g. an ADR links to the RFC that produced it; a changelog entry links to the ADR).
5. **Update indexes** — append a one-line entry to the relevant `README.md` index (`docs/adr/README.md`, `docs/plans/README.md`).
6. **For changelog:** prefer editing the existing `[Unreleased]` block rather than creating a new version. Only cut a new version entry on an actual release.

## Hard rules

- All docs are **English**. If the user writes in Turkish, converse in Turkish but produce English artifacts.
- Templates in `references/` are read-only — always copy to a new file.
- ADRs are append-only history. Supersede, never delete or rewrite.
- Filenames: lowercase, kebab-case, no spaces, matching the number prefix.
- Cross-reference with relative links (`../adr/0001-...md`, `../plans/rfc-001-...md`).
- Keep ADR/RFC titles in present-tense imperative ("Use Cloudflare Access for admin auth").
- Changelog follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) + [SemVer 2.0.0](https://semver.org/). Sections in order: Added, Changed, Deprecated, Removed, Fixed, Security.

## Reference files

- `references/adr-template.md` — ADR skeleton (Michael Nygard style)
- `references/rfc-template.md` — RFC skeleton (status lifecycle)
- `references/changelog-template.md` — CHANGELOG skeleton (Keep a Changelog)
- `assets/docs-templates/` — convenience copies
