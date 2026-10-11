# EPIC-001 — Stabilization & Contracts

## 1. Summary

Make the existing application safe to build on: consistent API responses, logic
in feature handlers instead of route files, and validated configuration. No new
product behavior is added here — the epic removes structural hazards that would
otherwise be copied by every later milestone.

## 2. Motivation

The diagnosis (D-07, D-08, D-14, and env gaps) shows the API boundary is
inconsistent and configuration is unvalidated. If left, every new endpoint and
feature would inherit the same violations. This epic freezes the rules
(DEC-003, DEC-008) before features multiply.

## 3. Scope

- In scope: response-envelope conformance, thin `route.ts` re-exports, handler
  extraction for violating routes, Zod env validation, doc-reference cleanup,
  baseline verification.
- Out of scope: adding endpoints, changing business logic, data model changes,
  UI work.

## 4. Related requirements

| PRD | Requirement |
|---|---|
| FR-13 | Multi-tenant security (consistent, safe API responses) |
| FR-15 | Reliability and production readiness |
| PA-09 | API and data integrity |

## 5. Related decisions

- DEC-003 — API envelope and thin route handlers.
- DEC-008 — Server environment validation.

## 6. Milestones

| ID | Title | Depends on | Status |
|---|---|---|---|
| MILESTONE-001 | Baseline Verification & API Boundary/Contract Cleanup | — | **Done** (2026-10-11) |
| MILESTONE-002 | Environment & Configuration Hardening | — | **Done** (2026-10-11) |

## 7. Dependencies

- Precedes: all other epics (EPIC-002…009 rely on the envelope and env module).
- Unblocks: M-013 (uses frozen types/shared lib layout), M-025 (env for tests).

## 8. Definition of Done (epic)

- [x] Every `app/api/**/route.ts` is a thin re-export (DEC-003). *(M-001)*
- [x] Every handler returns `{ success, data }` or `{ success, error }`. *(M-001)*
- [x] Env is validated once and `.env.example` matches (DEC-008). *(M-002)*
- [x] `typecheck`, `lint`, `build` pass. *(M-001/M-002)*
- [x] Baseline re-verified with recorded evidence. *(M-001 — `docs/reports/BASELINE.md`)*

## 9. Risks & open decisions

- Consumer impact: changing response shapes can break existing client code; the
  affected clients must be updated in the same milestone.
- No open decisions block this epic.

## 10. Handoff notes

- Later epics may assume: handlers own auth+validation, routes are thin, env is
  typed and validated, `{ success, data | error }` is universal.
- Do not re-litigate the envelope shape; amend DEC-003 if a deviation is truly
  required.
