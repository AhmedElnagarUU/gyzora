# MILESTONE-002 — Environment & Configuration Hardening

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-002 |
| Epic | EPIC-001 — Stabilization & Contracts |
| Title | Environment & Configuration Hardening |
| Status | Done |
| Owner | Lead Engineering Agent |
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

### Task results (2026-10-11)

| Task | Result | Evidence |
|---|---|---|
| T01 | **Done** | `shared/lib/env.ts`: Zod server schema, typed `Env`, `validateEnv()` + lazy `getEnv()` + `env` proxy, `publicEnv`; empty `KEY=` treated as unset so optional vars don't fail |
| T02 | **Done** | `shared/lib/db/mongoose.ts`, `shared/lib/s3/s3-client.ts`, `shared/lib/auth/auth-client.ts` now read env through `getEnv()` (S3 stays lazy — no build-time dependency); validation runs on first use with an actionable error |
| T03 | **Done** | `.env.example` rewritten with required/optional sections; every var read by code is documented; `.gitignore` already ignores `.env`, `.env.local`, `.env.*.local` (keeps `.env.example` trackable) |

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

### Acceptance results (2026-10-11)

| AC | Result | Evidence |
|---|---|---|
| AC-01 | **Pass** | `shared/lib/env.ts` exports typed `env`/`getEnv()`/`validateEnv()`; `npm run typecheck` exit 0 |
| AC-02 | **Pass** | Runtime smoke script: missing `MONGODB_URI`/`BETTER_AUTH_SECRET` (absent or empty) throws an error naming exactly those variables; invalid optional `S3_PUBLIC_BASE_URL` throws naming it; no secret values are echoed |
| AC-03 | **Pass** | `.env.example` documents every var read in code (`MONGODB_URI`, `MONGODB_DB_NAME`, `BETTER_AUTH_URL`, `S3_*`) plus planned optional integrations (Pexels/Polar/AI/Gemini); no real values |
| AC-04 | **Pass** | `next build` run with `.env` moved out of the tree → exit 0, 31 routes; `.env` restored afterward (values never printed) |
| AC-05 | **Pass** | `typecheck` pass; `lint` 0 errors/30 warnings (unchanged pre-existing warnings) |

### Verification (commands actually run)

```
npm run typecheck   # pass, exit 0
npm run lint        # 0 errors, 30 warnings (pre-existing)
npm run build       # pass, exit 0 — run WITHOUT .env present (AC-04)
node env-smoke.mts  # 5/5 env-validation cases pass (temp script, removed after run)
```

Smoke cases exercised: valid set with empty optional values; missing
`BETTER_AUTH_SECRET`; both required missing; required vars as empty strings;
invalid optional URL. Each throws a message listing the offending variable
names only.

## 17. Handoff & risks

- Never print/commit `.env` values (AGENTS §14).
- If a var is truly optional (e.g. `PEXELS_API_KEY`), model it as optional so the
  app runs without it (DEC-006).

### Handoff record

| Field | Value |
|---|---|
| Milestone | MILESTONE-002 — Environment & Configuration Hardening |
| Owner | Lead Engineering Agent |
| Date | 2026-10-11 |
| Status | **Done** |

**Files changed**

| Path | Change | Why |
|---|---|---|
| `shared/lib/env.ts` | **new** | Zod-validated server env; lazy `getEnv()` + typed `env` proxy + `publicEnv` (DEC-008) |
| `shared/lib/db/mongoose.ts` | reads `getEnv()` | fail fast with clear error |
| `shared/lib/auth/auth-client.ts` | reads `getEnv()` for `BETTER_AUTH_URL` | fail fast; default preserved |
| `shared/lib/s3/s3-client.ts` | reads `getEnv()`; client stays lazy | no build-time env dependency |
| `.env.example` | rewritten with required/optional sections | synced with code (AC-03) |
| `.gitignore` | unchanged | already ignores `.env`, `.env.local`, `.env.*.local` |

**Deviations & decisions**

- Validation is **lazy** (first use), not at module import: Next.js imports route
  modules during `next build`, and import-time validation would make the build
  require secrets (AC-04). The typed `env` is a `Proxy` over `getEnv()`.
- Empty `KEY=` values are normalized to "not set" so optional vars copied from
  `.env.example` don't break parsing. Required vars with empty values still fail
  fast.
- `MONGO_USERNAME`/`MONGO_PASSWORD` exist in the local `.env` but are not read
  by code — left out of the schema and `.env.example` (not read by code; Zod
  strips unknown keys).
- Only `MONGODB_URI` and `BETTER_AUTH_SECRET` are required app-wide; S3 stays
  optional-at-use (validated in the S3 client) so the app runs without it.

**Known gaps / follow-ups**

- No `server-only` package installed: browser access is guarded at runtime inside
  `validateEnv()` instead (`typeof window` check).
- A permanent unit test for `validateEnv` lands with the test framework
  (M-025); the runtime smoke cases above are recorded as interim evidence.
- `NEXT_PUBLIC_*` vars are read directly by client code (Next inlines them);
  `publicEnv.appUrl` mirrors the public URL for server-side use.

**Tree state**

- Repository is **not** a git repo; no commit/push performed. All changes are
  uncommitted working-tree edits.

### Handoff to next milestone

- Later milestones (M-013, M-025) may import `shared/lib/env` and rely on
  `env` / `getEnv()` being typed, validated once, and build-safe.
- Recommended next: **MILESTONE-013 — Template Content Schema, Section Contract
  & Default Content** (EPIC-006; depends on M-001 + M-002, both Done).
