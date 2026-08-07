# Changelog Guide

This folder holds [`CHANGELOG.md`](./CHANGELOG.md), the release history of the project.

## Conventions

- **Format:** [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) + [SemVer 2.0.0](https://semver.org/).
- **Language:** English.
- **Editing rule:** always edit the `[Unreleased]` block for in-progress work. Only cut a new `[MAJOR.MINOR.PATCH] - YYYY-MM-DD` section on an actual release.
- **Section order (omit empties):** `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- **Linking:** keep the version comparison links at the bottom in sync when cutting a release.
- **Cross-reference:** link to the ADR/RFC or PR that produced a notable change.

## Mapping to commits

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

| Commit type | Changelog section |
| --- | --- |
| `feat` | Added |
| `fix` | Fixed |
| `perf` | Changed |
| `revert` | Removed / Changed |
| `feat!` / `BREAKING CHANGE:` | Changed (call out the break) |
| `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore` | usually not in the changelog |

The `docs-generator` opencode skill can scaffold and maintain this file.
