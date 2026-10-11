# MILESTONE-002 — Environment & Configuration Hardening

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-002 |
| Epic | EPIC-001 — Stabilization & Contracts |
| Title | Environment & Configuration Hardening |
| Status | Not Started |
| Owner | — |
| Depends on | — |
| Blocks | M-013, M-025 |
| PRD refs | FR-15 |
| Decisions | DEC-008 |
| Estimated size | S |

## 2. Objective

Add a single server-only, Zod-validated environment module so missing/invalid
configuration fails fast with a clear message, and keep `.env.example` in sync
with what the code actually reads.

## 3. Background & rationale

Env access is currently ad hoc (`process.env.*` scattered), so a missing variable
surfaces as an obscure runtime crash. DEC-008 and CODE_RULES §10 require startup
validation. This also gives the test suite (M-025) a typed env to configure.

## 4. Scope (in scope)

- Add `shared/lib/env.ts`: parse/validate server env once with Zod; export typed
  `env`. Client reads only `NEXT_PUBLIC_*`.
- Fail fast with an actionable message listing missing/invalid variables.
- Reconcile `.env.example` with the code (including `PEXELS_API_KEY`, S3, Polar,
  auth, Mongo, AI keys as present).
- Ensure S3 client remains lazily constructed (no build-time env dependency).

## 5. Out of scope

- Adding new integrations; changing secret values (never printed/committed).
- Feature behavior (EPIC-002+).

## 6. Dependencies & preconditions

- None. `.env` is local-only and gitignored (never print/commit).

## 7. Deliverables

- Add: `shared/lib/env.ts`.
- Change: server modules that read env directly to import from `env` where it
  improves safety (minimal, targeted).
- Change: `.env.example` (documented, no secrets).
- Change: `.gitignore` confirmation that `.env*` local files are ignored.

## 8. Tasks

- **T01 — Define schema**
  - Work: Zod schema for server vars (`MONGODB_URI`, `BETTER_AUTH_SECRET`,
    `S3_*`, optional `PEXELS_API_KEY`, etc.) and `NEXT_PUBLIC_*` accessors.
  - Done when: `env` is typed and exported; unknown/missing required vars throw a
    clear error.
- **T02 — Wire startup validation**
  - Work: import `env` in the DB/auth/S3 bootstrap paths so validation runs
    before first use.
  - Done when: importing those modules without required env produces the clear
    error (not a downstream crash).
- **T03 — Sync example + docs**
  - Work: update `.env.example`; document each var's purpose.
  - Done when: every env var read in code appears in `.env.example`.

## 9. Interfaces & contracts touched

```ts
// shared/lib/env.ts (server-only)
export const env: {
  MONGODB_URI: string;
  BETTER_AUTH_SECRET: string;
  S3_REGION: string; S3_BUCKET: string; S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string; S3_PUBLIC_BASE_URL?: string;
  PEXELS_API_KEY?: string;
  // ...whatever the code actually reads
};
```

## 10. Data model impact

- None.

## 11. API impact

- None directly; `/api/health` may report env-derived readiness (keep monitor
  semantics, document).

## 12. UI/UX impact

- None.

## 13. Localization impact

- None.

## 14. Security & tenancy

- Server secrets never exposed to the client; only `NEXT_PUBLIC_*` may be read in
  client code. Validation errors must not echo secret values.

## 15. Testing & verification

- Unit test (added here or M-025): missing required var throws with a useful
  message; valid set parses. Optional vars default correctly.
- `npm run typecheck`, `npm run lint`, `npm run build` pass with no env present
  (build must not require secrets).

## 16. Acceptance criteria

- **AC-01** — `shared/lib/env.ts` validates and exports typed env.
- **AC-02** — Missing/invalid required env fails fast with an actionable error.
- **AC-03** — `.env.example` matches all read variables (no secrets).
- **AC-04** — `next build` succeeds without secrets present.
- **AC-05** — `typecheck`/`lint` pass.

## 17. Handoff & risks

- Never print/commit `.env` values (AGENTS §14).
- If a var is truly optional (e.g. `PEXELS_API_KEY`), model it as optional so the
  app runs without it (DEC-006).
