# MILESTONE-026 — API Contract & Publishing Tests

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-026 |
| Epic | EPIC-009 — Testing & Production Readiness |
| Title | API Contract & Publishing Tests |
| Status | Not Started |
| Owner | — |
| Depends on | M-025, M-021 |
| Blocks | M-028 |
| PRD refs | FR-09, FR-13, FR-15, PA-09 |
| Decisions | DEC-003, DEC-004 |
| Estimated size | M |

## 2. Objective

Verify the API envelope and status-code contract for every endpoint and prove the
publish workflow's safety end-to-end at the HTTP level.

## 3. Background & rationale

M-001 made routes envelope-conformant but did not runtime-verify them (no DB at
audit time). M-021 added publish/unpublish/preview. FR-15/PA-09 require API and
publishing behavior to be covered by tests.

## 4. Scope (in scope)

- Handler/route tests asserting `{ success, data | error }` and status codes
  (400/401/403/404/409/422/500) per API_CONTRACTS.
- Publishing tests: publish writes snapshot; failed publish writes nothing (422);
  unpublish hides; preview is owner-only + `no-store`.
- Static assertion that `route.ts` files are thin re-exports.
- Cross-tenant denial at the HTTP layer for sites/projects/media/tracking/users.

## 5. Out of scope

- Browser E2E (M-027); performance tests; load tests.

## 6. Dependencies & preconditions

- M-025 (tooling), M-021 (publish service). Auth test harness (session mock or
  test sign-in).

## 7. Deliverables

- Add: `app/api/**/__tests__/*` or `test/api/*.test.ts` covering the endpoints.
- Add: `test/publishing.test.ts` — publish/unpublish/preview safety.
- Add: `test/route-shape.test.ts` — static check routes are re-exports.
- Add: `test/helpers/auth.ts` — session/tenant fixtures.

## 8. Tasks

- **T01 — Envelope contract**
  - Work: for each endpoint, assert success/error shape and status mapping.
  - Done when: every endpoint in `API_CONTRACTS.md` §1–2 is covered.
- **T02 — AuthZ matrix**
  - Work: unauthenticated ⇒ 401; non-owner ⇒ 403/404; OWNER-only ⇒ 403 for
    customers.
  - Done when: covered for all protected routes.
- **T03 — Publishing safety**
  - Work: valid/invalid publish, snapshot immutability, unpublish, preview
    access + cache headers.
  - Done when: all publish ACs covered by tests.
- **T04 — Route shape**
  - Work: assert no logic in `route.ts` (grep/AST).
  - Done when: the check fails if logic is added.

## 9. Interfaces & contracts touched

- Verifies DEC-003/API_CONTRACTS; no production interface changes (fixes only if
  a test exposes a real defect).

## 10. Data model impact

- None (uses test DB).

## 11. API impact

- Confirms/changes nothing by itself; defects found are fixed within this
  milestone or reported.

## 12. UI/UX impact

- None.

## 13. Localization impact

- API error codes verified stable; localized messaging tested in M-019.

## 14. Security & tenancy

- HTTP-level cross-tenant denial assertions.

## 15. Testing & verification

- `npm test` passes; all endpoints covered.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Every endpoint returns the envelope with correct status codes.
- **AC-02** — AuthZ matrix (401/403/404) covered.
- **AC-03** — Publish safety (success/failure/immutability/unpublish) covered.
- **AC-04** — Preview is owner-only and non-cacheable (tested).
- **AC-05** — Static check enforces thin `route.ts` files.
- **AC-06** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- If a real defect is found, fix it (root cause) and record it; do not weaken the
  test to pass.
- Keep tests resilient to unrelated changes (test behavior, not implementation).
