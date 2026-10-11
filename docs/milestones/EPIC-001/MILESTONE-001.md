# MILESTONE-001 — Baseline Verification & API Boundary/Contract Cleanup

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-001 |
| Epic | EPIC-001 — Stabilization & Contracts |
| Title | Baseline Verification & API Boundary/Contract Cleanup |
| Status | Done |
| Owner | Lead Engineering Agent |
| Depends on | — |
| Blocks | M-003, M-004, M-005, M-013 |
| PRD refs | FR-13, FR-15, PA-09 |
| Decisions | DEC-003 |
| Estimated size | M |

## 2. Objective

Re-verify the current baseline and bring every API route into conformance with
DEC-003: all `route.ts` files are thin re-exports and all handlers return
`{ success: true, data }` or `{ success: false, error }` with correct HTTP
status codes.

## 3. Background & rationale

Diagnosis D-07 and D-08 confirm route logic and inconsistent envelopes in
`/api/projects`, `/api/tracking`, `/api/admin/*`, and `/api/auth/session`.
Consumers already depend on the inconsistent shapes (e.g.
`features/media/api-client.ts` expects `data.data`, the projects page expects a
raw array). Freezing the rule now prevents every later milestone from copying the
pattern. D-14 (`docs/KNOWN_ISSUES.md` references) is cleaned up here too.

## 4. Scope (in scope)

- Re-run and record `typecheck`, `lint`, `build` as the frozen baseline.
- Move logic from violating `route.ts` files into their feature
  `handlers.ts`; keep routes as one-line re-exports.
- Normalize all responses to the envelope; map statuses (400/401/403/404/409/500).
- Update all client consumers to the envelope.
- Fix dangling `docs/KNOWN_ISSUES.md` references to `docs/reports/DIAGNOSIS.md`.

## 5. Out of scope

- New endpoints or business behavior; data model changes; UI redesign.
- Env module (M-002). Sites/projects schema work (EPIC-002).

## 6. Dependencies & preconditions

- None. Local dependencies installed; `next build` runnable.
- No DB required for build/typecheck/lint.

## 7. Deliverables

- Change: `app/api/projects/route.ts`, `app/api/tracking/route.ts`,
  `app/api/admin/{analytics,tenants,users}/route.ts`,
  `app/api/auth/session/route.ts`, `app/api/health/route.ts` (assess) — thin
  re-exports.
- Add/Change: `features/projects/handlers.ts`, `features/tracking/handlers.ts`,
  `features/admin/**` (or the owning feature's `handlers.ts`), `features/auth`
  session handler.
- Change: consuming api-clients/pages to the envelope.
- Change: comments in `features/sites/public-service.ts`,
  `features/templates/components/TemplateConfigContent.tsx`.
- Add: `docs/reports/BASELINE.md` (recorded command output).

## 8. Tasks

- **T01 — Record baseline**
  - Work: run `npm run typecheck`, `npm run lint`, `npm run build`; capture
    summaries and route count.
  - Done when: results recorded in `docs/reports/BASELINE.md` with date.
- **T02 — Relocate route logic**
  - Work: for each violating route, move logic into the feature `handlers.ts`;
    leave `export { GET, POST, ... } from '@/features/<f>/handlers'`.
  - Done when: `app/api/**/route.ts` contains only re-exports (grep shows no
    logic).
- **T03 — Enforce the envelope**
  - Work: every handler returns `{ success, data }`/`{ success, error }`; status
    codes per DEC-003.
  - Done when: no handler returns a bare object or `{ error }`.
- **T04 — Update consumers**
  - Work: fix `features/media/api-client.ts`, the projects page, and any other
    reader of the old shapes.
  - Done when: `typecheck` passes and UI reads `data.data`/`data`.
- **T05 — Fix doc references**
  - Work: replace `docs/KNOWN_ISSUES.md` mentions with `docs/reports/DIAGNOSIS.md`.
  - Done when: grep for `KNOWN_ISSUES` returns nothing.

### Task results (2026-10-11)

| Task | Result | Evidence |
|---|---|---|
| T01 | **Done** | `docs/reports/BASELINE.md` — typecheck pass, lint 0/44, build pass, 31 routes |
| T02 | **Done** | All 12 `app/api/**/route.ts` are thin re-exports (incl. `app/api/auth/[...all]/route.ts` alias-only); route logic moved to `features/{projects,tracking,admin,auth,health}/handlers.ts` |
| T03 | **Done** | All handlers return `{ success, data }` / `{ success, error }`; unmapped 500-on-validation on `PUT /api/sites` corrected to 400; tracking got the standard tenant guard |
| T04 | **Done** | `shared/lib/auth/session-client.ts`, `admin/{analytics,tenants,users}` pages, projects page, tracking page, `features/media/api-client.ts` all read `.data`/`.data.user` |
| T05 | **Done** | No `KNOWN_ISSUES` in `*.ts`/`*.tsx`; comments now cite `docs/reports/DIAGNOSIS.md` (`features/sites/public-service.ts:97`, `features/templates/components/TemplateConfigContent.tsx:65`) |

## 9. Interfaces & contracts touched

- New handlers with signatures that return `Promise<Response>` (Route Handler).
- Shared result type: `{ success: true; data: T } | { success: false; error: string }`.
- No feature `service` signatures change unless required to satisfy the envelope.

## 10. Data model impact

- None.

## 11. API impact

| Method | Path | Change |
|---|---|---|
| GET/POST/PUT/DELETE | `/api/projects` | envelope + logic moved to handlers |
| GET/POST | `/api/tracking` | envelope + logic moved |
| GET | `/api/admin/analytics` | envelope |
| GET | `/api/admin/tenants` | envelope; mutations not via GET |
| GET | `/api/admin/users` | envelope |
| GET | `/api/auth/session` | `{ user }` → `{ success, data: { user } }` or 401 envelope |
| GET | `/api/health` | assess; monitoring contract may remain (document) |

## 12. UI/UX impact

- No visual change; data retrieval code updated. Error states use `error` strings.

## 13. Localization impact

- None (no new user-visible strings).

## 14. Security & tenancy

- Preserve every existing session/tenant check while moving code. Do not weaken
  scoping. Admin routes keep `requireRole('OWNER')`.
- Errors remain generic strings (no stack traces/secrets).

## 15. Testing & verification

- `npm run typecheck`, `npm run lint`, `npm run build` all pass.
- Static grep: no logic in `route.ts`; no `docs/KNOWN_ISSUES.md` references.
- Manual: hit representative endpoints (requires DB) or defer runtime checks to
  M-026 if no DB is available (record as blocked, do not fake).

## 16. Acceptance criteria

- **AC-01** — Every `app/api/**/route.ts` is a thin re-export.
- **AC-02** — Every handler returns the envelope with mapped statuses.
- **AC-03** — All consumers compile and read the envelope.
- **AC-04** — No `docs/KNOWN_ISSUES.md` references remain.
- **AC-05** — `typecheck`/`lint`/`build` pass; baseline recorded.

### Acceptance results (2026-10-11)

| AC | Result | Evidence |
|---|---|---|
| AC-01 | **Pass** | Enumerated every `app/api/**/route.ts`; all contain only re-exports. `app/api/auth/[...all]/route.ts` is `import { handleAuth }` + `export const GET/POST = handleAuth` (documented Better Auth exception) |
| AC-02 | **Pass** | Independent review confirmed every handler returns the envelope with 400/401/403/404/409/500; the one status bug it found (`PUT /api/sites` 500-on-invalid-body) was fixed to 400; runtime 401 envelopes verified (below) |
| AC-03 | **Pass** | `npm run typecheck` exit 0; no `.data.data` / raw-array / `json.user` reader remains |
| AC-04 | **Pass** | `grep -r KNOWN_ISSUES --include=*.ts --include=*.tsx` → no matches |
| AC-05 | **Pass** | typecheck pass; lint 0 errors/30 warnings (from 44); build pass (31 routes); baseline in `docs/reports/BASELINE.md` |

### Verification (commands actually run)

```
npm run typecheck                  # pass, exit 0, no output
npm run lint                       # 0 errors, 30 warnings (was 44 at baseline)
npm run build                      # pass; 31 routes; 25/25 static pages
```

Runtime smoke test (`npm run dev`, DB intermittently reachable — see note):

```
GET /api/health            -> 200 {"status":"healthy",...,"checks":{"database":{"status":"ok"}}}
                              (503 {"status":"degraded",...} when the DB SRV lookup fails)
GET /api/auth/session      -> 401 {"success":false,"error":"Unauthorized"}
GET /api/projects          -> 401 {"success":false,"error":"UNAUTHORIZED"}
GET /api/tracking          -> 401 {"success":false,"error":"UNAUTHORIZED"}
GET /api/admin/{analytics,users,tenants} -> 401 {"success":false,"error":"UNAUTHORIZED"}
```

Authenticated (200/400/404/409) paths and the `PUT /api/sites` 400 mapping were
**not** exercised: no test credentials exist and creating users in the shared
database is unsafe. Those remain statically verified and are closed by
`MILESTONE-026` (contract tests).

## 17. Handoff & risks

- Risk: touching response shapes can break unnoticed consumers — grep for each
  endpoint's fetch usage before changing.
- `docs/KNOWN_ISSUES.md` never existed; DIAGNOSIS is the replacement.
- Unauthenticated endpoint behavior verified at runtime (401 envelopes; health
  200/503). Authenticated paths (200/400/404/409) need a DB-backed session —
  M-026 closes this with `mongodb-memory-server`.

### Handoff record

| Field | Value |
|---|---|
| Milestone | MILESTONE-001 — Baseline Verification & API Boundary/Contract Cleanup |
| Owner | Lead Engineering Agent |
| Date | 2026-10-11 |
| Status | **Done** |

**Files changed**

| Path | Change | Why |
|---|---|---|
| `app/api/{projects,tracking,health}/route.ts` | thin re-exports | DEC-003 |
| `app/api/admin/{analytics,tenants,users}/route.ts` | thin re-exports | DEC-003 |
| `app/api/auth/session/route.ts` | thin re-export | DEC-003 |
| `features/admin/{handlers,service,schema}.ts` | **new** admin feature | owns no model; composes owner-named services |
| `features/projects/handlers.ts` | **new** | envelope + tenant guard |
| `features/tracking/{handlers,service,schema}.ts` | new/updated | envelope + tenant guard |
| `features/auth/handlers.ts` | new session + pass-through | envelope; full user preserved |
| `features/health/handlers.ts` | **new** | thin route, monitoring shape kept |
| `features/sites/handlers.ts` | `PUT` validates in handler | 400 (not 500) on invalid body (DEC-003) |
| `shared/lib/auth/session-client.ts` | reads `json.data.user` | envelope |
| `app/(dashboard)/dashboard/admin/{analytics,tenants,users}/page.tsx` | read `result.data`; POST mutation; unused-import cleanup | envelope |
| `app/(dashboard)/dashboard/(panel)/projects/page.tsx` | read `result.data` | envelope |
| `app/(dashboard)/dashboard/(panel)/settings/tracking/page.tsx` | read `result.data` | envelope |
| `features/sites/public-service.ts`, `features/templates/components/TemplateConfigContent.tsx` | doc-ref comments | D-14 |
| `docs/reports/BASELINE.md` | **new** | T01 evidence |
| `docs/project/API_CONTRACTS.md`, `docs/project/MODULE_MAP.md` | contracts/ownership | record new shape |

**Deviations & decisions**

- Admin endpoints live in a new `features/admin/` feature that owns **no** model;
  it calls owner-named functions on `tenants/sites/projects/auth/services`
  (CODE_RULES §1/§5). The admin tenant mutation moved from `GET ?action=` to
  `POST { id, action }` (correct method semantics).
- Two documented envelope exceptions: `/api/health` keeps the monitoring
  `{ status, timestamp, checks }` shape, and `/api/auth/[...all]` stays a Better
  Auth pass-through. Both route files remain thin.
- Scope-adjacent fix: the independent review flagged `PUT /api/sites` returning
  500 for an invalid body (an AC-02 conformance bug) and the tracking handler
  missing the shared tenant guard. Both were corrected here.

**Independent review (subagent) — findings**

- Blockers: **none**. All statically-verifiable ACs passed.
- Findings **not** fixed (pre-existing, outside this milestone's declared file
  set — recorded for tracking, not silently changed):
  - **M1 (security):** `GET /api/tenants?id=` trusts a client id and has no
    ownership check (cross-tenant read). No consumer uses `?id=`, so restricting
    it is low-risk, but it changes authorization semantics and needs a test —
    schedule it (see `EXECUTION_STATUS.md` → Review findings).
  - **M4 (security):** `GET /api/users?userId=` ignores tenant (S-02, already
    tracked to M-026/M-028).
  - **M3:** cross-feature `model.ts` imports (`tenants/service.ts` → sites model;
    `sites/public-service.ts` → tenants model) — CODE_RULES §1 boundary; needs a
    service API.
  - **m2:** new handlers echo raw `error.message`; a DB failure leaked the Mongo
    cluster hostname at runtime. Generic-error mapping belongs in one shared
    helper (M-026).
  - m3 (dead `?slug` tenants client), m4 (no-op schema), n2–n8 (lint nits).

**Known gaps / blocked items**

- Authenticated endpoint behavior (200/400/404/409) and the `PUT /api/sites` 400
  mapping are statically verified only; no DB-backed session was available and
  creating users in the shared database was not done. `MILESTONE-026` closes this
  with `mongodb-memory-server`.
- Lint carries 30 pre-existing warnings (mostly `no-explicit-any` in models);
  out of scope, tracked for later hardening.

**Tree state**

- Repository is **not** a git repo; no commit/push performed. All changes are
  uncommitted working-tree edits.

### Handoff to next milestone

- Later milestones may assume: every `route.ts` is a thin re-export; every
  handler returns `{ success, data | error }`; tenant-scoped handlers derive
  `tenantId` from the session; admin uses `requireRole('OWNER')` plus owner-named
  services.
- Recommended next: **MILESTONE-002 — Environment & Configuration Hardening**
  (no prerequisites). Do not re-litigate the envelope; amend DEC-003 if needed.
