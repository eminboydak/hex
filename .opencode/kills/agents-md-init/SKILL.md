---
name: agents-md-init
description: Initialize AGENTS.md with your project's hard constraints and workflow protocol. If you run this on an existing project, it will update (not overwrite) the team decisions section. Useful for onboarding.
---

# AGENTS.md Init

## Purpose

Create or update `AGENTS.md` with project-specific context for AI assistants. Captures:
- Hard architectural constraints
- Project layout
- Code standards
- Commit standards (Conventional Commits)
- Documentation standards
- Workflow protocol (visual options)

## Initial content includes

From DESIGN.md:
- Technical stack (Astro, Hono, D1, R2, Tailwind, Catppuccin)
- Database schema (posts, tags, guestbook, kv_store)
- Color tokens and typography
- Guestbook identity system

## Standards to enforce

**Code:**
- TypeScript strict mode, no any
- Tailwind utility classes only
- Path aliases: `@/components/*`, `@/layouts/*`, `@/lib/*`

**Git:**
- Conventional Commits v1.0.0: `<type>(<scope>): <imperative summary>`
- Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- Language: English commit messages only
- Automation via `commit-message` skill

**Communication:**
- User interaction: Turkish (this session)
- All artifacts (code, docs, commits): English
- Visual workflow options: presented in Turkish, content in English

**Documentation:**
- ADR: `docs/adr/` (Michael Nygard format, sequential)
- RFC/plans: `docs/plans/` (lifecycle Draft→Proposed→Accepted/Rejected/Implemented)
- Changelog: `docs/changelog/` (Keep a Changelog + SemVer)

## Workflow protocol

Before implementing any new page, module, component, or interactive feature, do NOT write UI directly. Offer the user 3 options (in Turkish) and wait for approval:
- **A) Strict continuity** — exact `DESIGN.md` tokens/layouts, no visual deviation.
- **B) Experimental variation** — new feature-specific motif (e.g. terminal frame, zine column, vintage widget) while keeping Catppuccin colors.
- **C) Custom prompt** — user supplies the visual/design brief.

## Verify before finishing

- `pnpm build` passes (Cloudflare build)
- `astro check` passes (this is the typecheck, not `tsc`)
- No client JS shipped unless an island was explicitly added

## Existing file handling

If AGENTS.md already exists, the skill will preserve:
- Communication language section
- Commit standards section
- Documentation standards section
- Workflow protocol section
- Existing team decisions

It will update/add:
- Technical stack (from DESIGN.md)
- Project layout (exact tree structure)
- Code standards
- Any missing sections

## How to use

Run this skill when:
- Starting a new project
- Onboarding new team members
- When architectural constraints change
- After major restructuring

## Files modified

- `AGENTS.md` (created or updated)

## Example invocation

```
/agents-md-init
```

Result: AGENTS.md initialized with all project-specific context for AI assistants.