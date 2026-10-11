# EPIC-009 — Testing & Production Readiness

## 1. Summary

Introduce automated verification and make the app genuinely deployable: a test
framework with domain/isolation tests, API-contract and publishing tests,
Playwright E2E journeys in English and Arabic, and a final production-readiness
pass with honest reporting of remaining limitations.

## 2. Motivation

There is no test framework and correctness rests on a green build (D-14, U-01,
FR-15: "do not claim production-ready solely because it builds"). Critical
invariants (one-site-per-user, publish isolation, tenant isolation, AR/EN) must
be regression-protected before release.

## 3. Scope

- In scope: Vitest + mongodb-memory-server, domain/isolation tests, API-contract
  tests, publishing tests, Playwright E2E (EN/AR), production build/deploy
  readiness checks, final traceability.
- Out of scope: load testing, OWASP scans, Sentry/monitoring, CI pipelines beyond
  documenting the required gates (per PRD §8 / DEC-009).

## 4. Related requirements

| PRD | Requirement |
|---|---|
| FR-15 | Reliability and production readiness |
| PA-09 | API and data integrity |
| PA-10 | Production readiness |

## 5. Related decisions

- DEC-007 — Vitest + Playwright; required regression tests; npm scripts.
- DEC-003 — envelope contract verified by tests.
- DEC-004 — publish snapshot isolation verified by tests.

## 6. Milestones

| ID | Title | Depends on | Status |
|---|---|---|---|
| MILESTONE-025 | Test Tooling Baseline & Domain/Isolation Tests | M-002, M-006 | Not Started |
| MILESTONE-026 | API Contract & Publishing Tests | M-025, M-021 | Not Started |
| MILESTONE-027 | Playwright E2E (EN/AR) | M-008, M-009, M-011, M-020, M-021, M-023 | Not Started |
| MILESTONE-028 | Production Build / Deployment Readiness / Final Traceability | M-024, M-025, M-026, M-027 | Not Started |

## 7. Dependencies

- Requires: all feature epics.
- Unblocks: release.

## 8. Definition of Done (epic)

- [ ] `npm test` runs unit + integration; `npm run test:e2e` runs journeys.
- [ ] Tenant isolation tested for every tenant-scoped feature.
- [ ] One-site-per-user (incl. concurrent) tested.
- [ ] Publish snapshot isolation tested.
- [ ] E2E: signup → create → edit → projects → preview → publish → view, in EN
      and AR, both templates.
- [ ] Production build verified; deployment prerequisites and limitations
      documented.
- [ ] `reports/TRACEABILITY.md` complete and consistent.

## 9. Risks & open decisions

- U-01: tests need a DB; mongodb-memory-server may require a download in CI.
- OD-4: deployment target affects the readiness checklist.
- Time-box: coverage is not a goal; the required cases are.

## 10. Handoff notes

- Provides the repo's CI gates (TEST_STRATEGY §7) and the release checklist.
- Remaining operational limitations must be listed in M-028, not hidden.
