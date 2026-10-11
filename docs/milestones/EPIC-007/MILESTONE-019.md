# MILESTONE-019 — Dashboard Localization & RTL

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-019 |
| Epic | EPIC-007 — Localization (Arabic / English) |
| Title | Dashboard Localization & RTL |
| Status | Not Started |
| Owner | — |
| Depends on | M-018 |
| Blocks | — |
| PRD refs | FR-10, FR-14, PA-07 |
| Decisions | DEC-005 |
| Estimated size | L |

## 2. Objective

Replace hardcoded English in the dashboard and editors with message-catalog
strings, and make the dashboard fully RTL-correct in Arabic.

## 3. Background & rationale

D-05: all dashboard UI copy is hardcoded English. FR-10 requires the dashboard
and forms to support both languages with correct direction and no data loss on
switch.

## 4. Scope (in scope)

- Move dashboard/editor/nav/validation strings into `i18n/messages/{en,ar}.json`.
- Localize error/empty/loading states and API error codes.
- Convert directional spacing to logical utilities (`ms/me/ps/pe/text-start/end`).
- Verify RTL across dashboard shell, forms, lists, editors.

## 5. Out of scope

- Public site localization (M-020); SEO (M-024); new features.

## 6. Dependencies & preconditions

- M-018 (provider, fallback, switcher).
- Dashboard/editors implemented (EPIC-003/004/005).

## 7. Deliverables

- Change: `i18n/messages/{en,ar}.json` — full dashboard keys.
- Change: all dashboard/editor components under `app/(dashboard)/**` and
  `features/*/components/**` — `useTranslations`/`getTranslations`.
- Change: `features/dashboard/components/DashboardShell.tsx` — localized nav.
- Change: validation error mapping (Zod → localized message or code → message).

## 8. Tasks

- **T01 — Extract strings**
  - Work: catalog all dashboard UI strings; replace literals.
  - Done when: no hardcoded user-visible English remains in the dashboard.
- **T02 — Error/empty/loading**
  - Work: localize states and map API error codes to messages.
  - Done when: errors display localized text.
- **T03 — RTL layout**
  - Work: replace physical spacing/alignment with logical utilities.
  - Done when: Arabic dashboard mirrors correctly.
- **T04 — No data loss**
  - Work: switching language preserves unsaved form input.
  - Done when: verified in editors.

## 9. Interfaces & contracts touched

- Message keys namespaced by feature (`sites.*`, `projects.*`, `common.*`).
- API error codes remain machine-stable; client maps to messages.

## 10. Data model impact

- None.

## 11. API impact

- None.

## 12. UI/UX impact

- Fully localized dashboard; RTL-correct; consistent icons/labels.

## 13. Localization impact

- `ar.json` must contain every `en.json` key (parity test in M-025).

## 14. Security & tenancy

- None new; localization does not affect auth/ownership.

## 15. Testing & verification

- Catalog parity test.
- Component test: dashboard renders in `ar` with `dir="rtl"`.
- Manual: switch language; verify no layout breakage or data loss.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — No hardcoded user-visible English in dashboard surfaces.
- **AC-02** — Dashboard is fully usable in Arabic (RTL).
- **AC-03** — Validation/error messages are localized.
- **AC-04** — Language switch preserves form state.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- RTL regressions are subtle; rely on M-027 E2E and visual checks.
- Keep keys stable to avoid churn in later milestones.
