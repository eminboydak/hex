---
name: commit-message
description: Generate Conventional Commits v1.0.0 compliant commit messages by analyzing staged git changes. ACTIVATE whenever the user asks to commit, commitle, kaydet, version control, save changes, describes wanting to record work, or mentions git commit operations in any language. Model-agnostic.
version: 1.0.0
compatibility: model-agnostic
metadata:
  domain: git
  format: conventional-commits
  scope: message-generation
---

# Conventional Commits Generator

Generate a single, well-formed commit message following **Conventional Commits v1.0.0**. This skill only produces the commit message (and stages + commits if the user asks). It does NOT push, open PRs, or amend unless explicitly instructed.

## Workflow

1. **Gather context** (do not print raw diffs to the user unless asked):
   - `!git status --short`
   - `!git diff --staged` (if empty, also inspect `!git diff` and decide whether to `git add` first — ask if unsure)
   - Recent log for tone: `!git log --oneline -10`

2. **Classify the change** into exactly one `type` (see `references/types.md`):
   - `feat` new feature for the user
   - `fix` bug fix
   - `docs` documentation only
   - `style` formatting, whitespace, semicolons (no logic change)
   - `refactor` code change that neither fixes a bug nor adds a feature
   - `perf` performance improvement
   - `test` adding/correcting tests
   - `build` build system, dependencies, tooling
   - `ci` CI pipeline/config
   - `chore` maintenance, misc
   - `revert` revert a prior commit

3. **Choose a scope** (optional). Use an existing scope from the recent log if one fits (e.g. `auth`, `api`, `db`, `docs`, `ui`, `islands`). Prefer consistency with history. Omit scope if no clear one applies — do not invent new scopes casually.

4. **Write the message:**
   - **Subject line:** `<type>(<scope>): <imperative summary>` — lowercase first letter, no trailing period, max ~72 chars. Use imperative mood ("add", not "added"/"adds").
   - **Body (optional):** blank line after subject, wrap at ~72 chars. Explain *what and why* (not *how* — the diff shows how). Reference issues/ADRs/RFCs when relevant (`refs ADR-0001`, `closes #123`).
   - **Breaking change:** add `!` before the colon (e.g. `feat(api)!: ...`) OR a `BREAKING CHANGE:` footer with a migration note.

5. **Confirm before committing** unless the user already said to commit directly. Show the proposed message and, if staging is needed, list the files you intend to stage. Never commit secrets.

6. **Commit only when approved.** Use a single `git commit -m` with a `-m` per paragraph (subject + body), or a HEREDOC for complex bodies. Do NOT use `--no-verify`, `--amend`, or `--force` unless the user explicitly asks.

## Hard rules

- One logical commit. If the staged change mixes unrelated concerns, suggest splitting and ask which to do first.
- Match the repo's historical tone and language (check `git log`). This repo's commits are **English**.
- Never invent a type outside the canonical list.
- Subject must be imperative, present tense, lowercase-starting, ≤72 chars, no trailing period.
- No Co-authored-by or AI attribution lines unless the user asks.
- If the user asks in Turkish, reply in Turkish; the commit message itself stays English.

## Reference files

- `references/types.md` — full type definitions with examples
- `references/examples.md` — good vs. bad message examples for this repo
- `assets/commit-template.md` — skeleton to fill in
