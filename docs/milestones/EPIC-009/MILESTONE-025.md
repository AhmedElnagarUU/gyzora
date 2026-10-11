# MILESTONE-025 — Test Tooling Baseline & Domain/Isolation Tests

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-025 |
| Epic | EPIC-009 — Testing & Production Readiness |
| Title | Test Tooling Baseline & Domain/Isolation Tests |
| Status | Not Started |
| Owner | — |
| Depends on | M-002, M-006 |
| Blocks | M-026, M-028 |
| PRD refs | FR-13, FR-15, PA-09 |
| Decisions | DEC-007 |
| Estimated size | L |

## 2. Objective

Install Vitest with an isolated MongoDB and add the mandatory domain tests:
tenant isolation for every tenant-scoped feature, one-Site-per-user (including
concurrency), template immutability, and localization fallback.

## 3. Background & rationale

DIAGNOSIS U-01: there is no test framework and no way to verify runtime behavior.
FR-15/CODE_RULES §11 require tests for critical business rules. DEC-007 fixes the
tooling. This milestone closes U-01.

## 4. Scope (in scope)

- Add Vitest + `mongodb-memory-server` (with `TEST_MONGODB_URI` fallback).
- Add scripts `test`, `test:watch`.
- Test setup helper (connect/reset DB, seed tenants).
- Required tests: tenant isolation (sites, projects, media, tracking, users);
  one-site-per-user incl. concurrent creation; publish snapshot isolation;
  `resolveLocalized` fallback; template immutability; catalog parity.

## 5. Out of scope

- API contract tests (M-026); E2E (M-027); coverage tooling.

## 6. Dependencies & preconditions

- M-002 (env for test config), M-006 (domain schema stable).
- Ability to run `mongodb-memory-server` (may download a binary; document
  `TEST_MONGODB_URI` fallback for offline CI).

## 7. Deliverables

- Change: `package.json` — devDeps + `test`/`test:watch` scripts.
- Add: `vitest.config.ts`.
- Add: `test/setup.ts` — DB lifecycle + helpers.
- Add: `features/sites/__tests__/*`, `features/projects/__tests__/*`,
  `features/media/__tests__/*`, `features/tracking/__tests__/*`,
  `features/users/__tests__/*`.
- Add: `shared/i18n/__tests__/resolve.test.ts`.
- Add: `features/templates/__tests__/immutability.test.ts`, catalog parity test.

## 8. Tasks

- **T01 — Tooling**
  - Work: add Vitest + in-memory Mongo; config; scripts.
  - Done when: `npm test` runs and exits 0 with no tests failing.
- **T02 — Setup helpers**
  - Work: connect/reset, tenant/user/project factories.
  - Done when: tests are isolated and repeatable.
- **T03 — Isolation suite**
  - Work: one test per tenant-scoped feature proving cross-tenant denial.
  - Done when: each feature has a passing isolation test.
- **T04 — Invariants**
  - Work: one-site-per-user (incl. concurrent), snapshot isolation, immutability,
    fallback, catalog parity.
  - Done when: each invariant has a passing test.

## 9. Interfaces & contracts touched

- Test-only; no production interfaces change.

## 10. Data model impact

- None; tests assert indexes/invariants from EPIC-002.

## 11. API impact

- None (service/repository level here).

## 12. UI/UX impact

- None.

## 13. Localization impact

- Fallback + catalog parity tested.

## 14. Security & tenancy

- Tests explicitly assert cross-tenant reads/writes/deletes are denied.

## 15. Testing & verification

- `npm test` passes.
- `npm run typecheck`, `npm run lint`, `npm run build` pass.
- CI can run offline via `TEST_MONGODB_URI` (documented in `.env.example`).

## 16. Acceptance criteria

- **AC-01** — Vitest + mongodb-memory-server configured; `npm test` works.
- **AC-02** — Tenant isolation tested for sites, projects, media, tracking, users.
- **AC-03** — One-site-per-user incl. concurrency tested.
- **AC-04** — Publish snapshot isolation tested.
- **AC-05** — `resolveLocalized` fallback + catalog parity tested.
- **AC-06** — Template immutability tested.
- **AC-07** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- `mongodb-memory-server` may need network access for its binary; document the
  fallback and report blocked if neither is available (do not fake tests).
- Keep tests deterministic; reset DB between tests.
