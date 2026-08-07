# ADR-0001: Use Cloudflare Access for admin auth

- **Status:** Accepted
- **Date:** 2026-08-07
- **Deciders:** emin
- **Related:** [RFC-001](../plans/rfc-001-admin-panel-and-media-management.md)

## Context

The admin panel (`/admin`, `/admin/editor`) and its API (`/api/admin/*`) write to D1 and R2 and therefore must be protected. This is a personal, single-admin site deployed on Cloudflare Workers, with a strong existing constraint: zero tracking and a lean runtime budget (Workers free tier — 10ms CPU/request). The repo is public, so the protection cannot rely on obscurity.

We need an auth layer that is (a) robust without shipping a bespoke identity system, (b) cheap/free, and (c) consistent with the Cloudflare Workers + Zero Trust stack already in use.

## Decision

We use **Cloudflare Access (Zero Trust)** as the primary identity gate, and verify the Access-issued JWT inside the Hono `/api/admin/*` middleware as defense in depth.

- The Access application protects `/admin/*` (UI) and `/api/admin/*` (API).
- Cloudflare Access issues a JWT in the `cf-access-jwt-assertion` header after the user authenticates.
- The Worker verifies that JWT with the `jose` library: signature against Cloudflare's JWKS endpoint, plus an `AUD` claim match against the `ADMIN_AUD` env var. JWKS is cached in-memory across invocations.
- Unauthenticated or invalid requests receive HTTP 401.

## Alternatives Considered

- **Shared-secret header (`x-admin-token`)** — simplest, ~5 lines. Rejected as the *primary* mechanism because it requires injecting the token into client-rendered HTML for the editor island, and offers nothing beyond the secret itself. Acceptable only as a dev fallback.
- **Cloudflare Access JWT without signature verification (presence + AUD decode only)** — saves the `jose` dependency. Rejected: it trusts the header blindly, removing the defense-in-depth value. The edge Access policy would be the only real gate.
- **Custom session/cookie auth** — full control but adds a users table, password hashing, session storage, and cookie handling — all disproportionate for a single-admin personal site, and at odds with the zero-tracking constraint.

## Consequences

- **Positive:** no bespoke identity system; MFA / device posture / geo rules come free from Zero Trust; the public repo leaks nothing usable; the API is independently guarded, not just the UI.
- **Negative:** adds the `jose` dependency (~50KB); requires Cloudflare Access configuration (Application AUD, Team Domain) and an `ADMIN_AUD` env var; local dev needs a `.dev.vars` fallback (e.g. shared-secret) since Access headers are absent in `wrangler dev`.
- **Neutral:** the editor island's admin fetches pass through the Access policy like any other request; no token injection into HTML is needed because the API trusts the Access JWT, not a client-held secret.

## References

- [Cloudflare Access — validating JWTs](https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/)
- [Conventional Commits](https://www.conventionalcommits.org/) (used for commits that implement this ADR)
- `DESIGN.md` §4 — Admin Panel & Auth
