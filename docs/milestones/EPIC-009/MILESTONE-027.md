# MILESTONE-027 — Playwright E2E (EN/AR)

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-027 |
| Epic | EPIC-009 — Testing & Production Readiness |
| Title | Playwright E2E (EN/AR) |
| Status | Not Started |
| Owner | — |
| Depends on | M-008, M-009, M-011, M-020, M-021, M-023 |
| Blocks | M-028 |
| PRD refs | FR-15, PA-03, PA-04, PA-05, PA-07, PA-08, PA-10 |
| Decisions | DEC-007, DEC-004, DEC-005 |
| Estimated size | L |

## 2. Objective

Automate the critical user journeys in a real browser — signup, site creation,
content editing, portfolio management, preview, publish, and viewing — in both
English and Arabic and for both templates.

## 3. Background & rationale

FR-15/PA-10 require critical journeys to be tested, not assumed. The product is
bilingual and template-based, so journeys must be proven in both locales and for
both templates (PA-06/PA-07).

## 4. Scope (in scope)

- Playwright config + `test:e2e` script; chromium (minimum).
- Specs for journeys in `TEST_STRATEGY.md` §5, EN + AR.
- Both templates: create → publish → view.
- RTL/direction assertions and language switching.

## 5. Out of scope

- Cross-browser matrix beyond chromium; visual regression snapshots; load tests.

## 6. Dependencies & preconditions

- All feature milestones listed in `Depends on` are Done.
- A test database and a runnable app (`npm run dev` or built `next start`).
- Auth strategy for tests (seed/test-login) — do not depend on live email.

## 7. Deliverables

- Add: `playwright.config.ts`.
- Change: `package.json` — `test:e2e` (+ optional `test:e2e:ui`).
- Add: `e2e/journeys/auth.spec.ts`, `create-site.spec.ts`, `edit-content.spec.ts`,
  `projects.spec.ts`, `preview-publish.spec.ts`, `localization.spec.ts`,
  `templates.spec.ts`.
- Add: `e2e/support/fixtures.ts` — seeding + cleanup.

## 8. Tasks

- **T01 — Harness**
  - Work: config + web-server + test DB seeding.
  - Done when: `npm run test:e2e` boots the app and runs a smoke test.
- **T02 — Core journeys**
  - Work: signup → create → edit → projects → preview → publish → view.
  - Done when: each journey passes in EN.
- **T03 — Bilingual + RTL**
  - Work: repeat key journeys in AR; assert `dir="rtl"` and language switching.
  - Done when: AR journeys pass with correct direction.
- **T04 — Both templates**
  - Work: create/publish/view for `real-estate` and `construction`.
  - Done when: both templates produce complete published pages.

## 9. Interfaces & contracts touched

- Test-only; may add a test-only seeding path guarded to non-production.

## 10. Data model impact

- Uses a test database; no production writes.

## 11. API impact

- Drives real API routes; surfaces defects (fixed at root cause).

## 12. UI/UX impact

- None; validates UX states (empty/loading/error).

## 13. Localization impact

- EN and AR journeys; asserts direction and switching.

## 14. Security & tenancy

- Journey includes a check that another tenant's site is not viewable/editable.

## 15. Testing & verification

- `npm run test:e2e` passes locally.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — `npm run test:e2e` runs and passes.
- **AC-02** — Core journey passes in EN.
- **AC-03** — Key journeys pass in AR with correct RTL.
- **AC-04** — Both templates publish a complete site.
- **AC-05** — Cross-tenant denial verified in-browser.
- **AC-06** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- E2E needs a DB and a running app; if unavailable, report blocked (do not mock
  the browser journey into passing).
- Avoid flaky waits; use role/text-based locators.
