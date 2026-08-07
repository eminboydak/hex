# Documentation

This directory holds the project's decision records, proposals, and release history. All artifacts are in English.

| Folder | Artifact | Format |
| --- | --- | --- |
| [`adr/`](./adr/) | Architecture Decision Records | Michael Nygard — append-only, supersede never rewrite |
| [`plans/`](./plans/) | RFCs / plans | `Draft → Proposed → Accepted/Rejected → Implemented` |
| [`changelog/`](./changelog/) | Release notes | [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) + [SemVer](https://semver.org/) |

## How artifacts relate

```
RFC (proposal)  ──accepted──▶  ADR (decision)  ──released──▶  CHANGELOG entry
```

An RFC weighs alternatives before implementation; once accepted it often spawns one or more ADRs that record the final decision as immutable history. The CHANGELOG documents what shipped.

## Automation

Two opencode skills scaffold and maintain these files (see `.opencode/skills/`):

- **`docs-generator`** — creates ADR/RFC/CHANGELOG files from templates, manages numbering and indexes.
- **`commit-message`** — generates Conventional Commits messages (`feat`, `fix`, `docs`, …).

Invoke them explicitly (e.g. `/docs-generator`) or let the agent activate them based on intent.

## Quick reference

- New decision? → create an ADR in `adr/` (next free `NNNN`).
- Exploring options? → create an RFC in `plans/` (next free `NNN`).
- Shipped a change? → edit `changelog/CHANGELOG.md` under `[Unreleased]`.
