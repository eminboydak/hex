---
rfc_id: RFC-NNN
title: <feature or proposal title>
author: <name>
status: Draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
related_adrs: []
tags: []
---

# RFC-NNN: <title>

## Status

Draft | Proposed | Under Review | Accepted | Rejected | Implemented | Superseded by RFC-MMM

Keep this in sync with the frontmatter `status`. Add a dated line when the status changes:

- YYYY-MM-DD — Draft → Proposed
- YYYY-MM-DD — Proposed → Accepted

## Context and Motivation

Why is this proposal needed? What problem does it solve, and what's the current state? Reference relevant ADRs and constraints (Astro + Hono + Cloudflare D1/R2, zero tracking, zero client JS by default).

## Goals

- Concrete, measurable goals.

## Non-Goals

- Explicitly out-of-scope items, to prevent scope creep.

## Proposed Solution

The recommended approach, in enough detail to be actionable. Diagrams (text/ASCII), data flow, and concrete examples are welcome.

## Alternatives Considered

- **Alternative A** — pros/cons.
- **Alternative B** — pros/cons.

Use a comparison table if there are ≥3 options with multiple axes.

## Open Questions

- Things still unresolved that need input.

## Implementation Plan

1. Phased steps with rough ordering.
2. Migration / rollout notes (DB schema changes, R2 layout, etc.).
3. Verification: which `pnpm` commands prove it works (`pnpm check`, `pnpm build`).

## Success Metrics

How will we know it worked? (Keep it pragmatic for a personal site.)

## References

- Links to specs, prior art, related ADRs/RFCs.
