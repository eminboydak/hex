# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation system: `docs/` tree with ADR (`docs/adr/`), RFC/plans (`docs/plans/`), and CHANGELOG (`docs/changelog/`).
- [ADR-0001](../adr/0001-use-cloudflare-access-for-admin-auth.md) — decision to use Cloudflare Access JWT verification for admin auth.
- [RFC-001](../plans/rfc-001-admin-panel-and-media-management.md) — proposal for the admin panel & media management feature.
- Opencode skills: `commit-message` (Conventional Commits generator) and `docs-generator` (ADR/RFC/CHANGELOG scaffolding) under `.opencode/skills/`.

### Changed
- `AGENTS.md` now documents the communication-language policy (Turkish interaction, English artifacts), commit standards (Conventional Commits), and documentation standards.
- `DESIGN.md` gains §4 (Admin Panel & Auth), §5 (Media Storage / R2 bucket layout), §6 (Documentation Standards).
- `README.md` adds a Documentation section pointing at `docs/`.

<!-- On release, copy the [Unreleased] block into a new version section,
     then clear [Unreleased] back to empty sub-sections. Update the links below. -->

<!-- ## [0.2.0] - YYYY-MM-DD -->

[Unreleased]: https://github.com/eminboydak/hex/compare/v0.1.0...HEAD
