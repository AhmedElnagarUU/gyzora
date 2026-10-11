# MILESTONE-007 — Site Lifecycle Dashboard

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-007 |
| Epic | EPIC-003 — Site Creation & Dashboard |
| Title | Site Lifecycle Dashboard |
| Status | Not Started |
| Owner | — |
| Depends on | M-003 |
| Blocks | — |
| PRD refs | FR-02, FR-14, PA-02 |
| Decisions | DEC-001, DEC-009 |
| Estimated size | M |

## 2. Objective

Make the dashboard reflect the one-site reality: a clear "no site yet" state with
a create call-to-action, and a "your site" state linking to editing, projects,
preview, publishing, and settings — with no multi-site creation workflow.

## 3. Background & rationale

D-01/D-09: sites are auto-created and the dashboard presents a multi-site
workflow with dead links and stubs. FR-02 requires the dashboard to show
existence, allow creation if none, and manage the existing site with status.

## 4. Scope (in scope)

- Dashboard overview resolves the single owned Site (or none).
- No-site state → link to creation (M-008).
- Has-site state → links to editor (M-009/010), projects (M-011), settings,
  preview (M-022), publish (M-021), media, template config.
- Show publication status; remove/disable multi-site creation entries; replace
  dead links with real routes.
- Use `lucide-react` icons (FR-14).

## 5. Out of scope

- The creation form itself (M-008); editors (EPIC-004); publishing logic
  (EPIC-008).

## 6. Dependencies & preconditions

- M-003 done (`getOwnedSite`, no auto-create).
- Server Component read path works (service → repository).

## 7. Deliverables

- Change: `app/(dashboard)/dashboard/(panel)/page.tsx` — lifecycle-aware
  overview.
- Change: `features/sites/service.ts` (read-only) usage; a small
  `features/dashboard/components/*` overview component.
- Change: `features/dashboard/components/DashboardShell.tsx` — nav links fixed,
  `lucide-react` icons, tracking link added.
- Change: `features/sites/components/SitePublishButton.tsx` wiring to the real
  publish action (M-021) or hidden until then.

## 8. Tasks

- **T01 — Overview states**
  - Work: server component resolves owned site; renders empty vs site overview.
  - Done when: a user with no site sees the create CTA; a user with a site sees
    links.
- **T02 — Navigation cleanup**
  - Work: fix dead links; add tracking; use lucide icons.
  - Done when: no dead/`coming soon` nav entries remain.
- **T03 — Status display**
  - Work: show DRAFT/PUBLISHED and last-published info when available.
  - Done when: status is accurate.

## 9. Interfaces & contracts touched

- Consumes `features/sites/service.getOwnedSite(tenantId)`.

## 10. Data model impact

- None.

## 11. API impact

- None (server component reads via service).

## 12. UI/UX impact

- New empty/site states; loading/error handling; consistent buttons/icons;
  responsive.

## 13. Localization impact

- New UI strings added to catalogs (M-019 completes wiring; add keys now).

## 14. Security & tenancy

- Site resolved from the session's tenant only.

## 15. Testing & verification

- Component/manual: no-site and has-site render correctly.
- No dead links (assert hrefs resolve to real routes).
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — No-site state shows a create action; has-site state shows management
  links.
- **AC-02** — No multi-site creation entry is presented.
- **AC-03** — Publication status is shown accurately.
- **AC-04** — No dead links or `coming soon` stubs in dashboard nav.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Publish/preview links depend on M-021/M-022; until then, render them disabled or
  omit with a note rather than dead.
- DEC-009: do not expand dashboard scope beyond lifecycle + existing features.
