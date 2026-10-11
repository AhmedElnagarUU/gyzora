# MILESTONE-022 — Owner-Only Preview

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-022 |
| Epic | EPIC-008 — Publishing & Public Website |
| Title | Owner-Only Preview |
| Status | Not Started |
| Owner | — |
| Depends on | M-021 |
| Blocks | — |
| PRD refs | FR-09, PA-08 |
| Decisions | DEC-004 |
| Estimated size | S |

## 2. Objective

Let the Site owner render the current **draft** content on a preview route that is
authenticated, ownership-checked, and never publicly cacheable.

## 3. Background & rationale

FR-09 requires previewing unpublished changes. DEC-004 mandates preview render
from draft on an owner-only, non-cacheable route. Without it, customers publish
blindly to see changes.

## 4. Scope (in scope)

- Preview route renders draft `Site.content` + live projects using the shared
  renderer.
- Auth + ownership required; `Cache-Control: no-store`; never indexed.
- Banner indicating "preview / unpublished".

## 5. Out of scope

- Publishing (M-021); public rendering (M-023); comparing versions.

## 6. Dependencies & preconditions

- M-021 (publish service; though preview is independent, ordering groups it here).

## 7. Deliverables

- Add: `app/api/sites/preview/route.ts` (thin) or `app/dashboard/preview/page.tsx`
  (owner page). Choose the simplest that satisfies "owner-only, non-cacheable".
- Add: `features/sites/preview-service.ts` — `getPreviewData(tenantId)`.
- Add: `features/sites/components/PreviewBanner.tsx`.

## 8. Tasks

- **T01 — Preview read**
  - Work: load draft content + projects for the owner's site.
  - Done when: unauthenticated/foreign access is denied (401/403/404).
- **T02 — Render**
  - Work: render via `TemplateRenderer` with draft content.
  - Done when: draft changes appear immediately in preview.
- **T03 — Cache/SEO**
  - Work: send `no-store`; `robots: noindex`; no public caching.
  - Done when: response headers and meta forbid caching/indexing.

## 9. Interfaces & contracts touched

```ts
// features/sites/preview-service.ts
getPreviewData(tenantId: ObjectId): Promise<{ site: Site; projects: Project[] } | null>;
```

## 10. Data model impact

- None (read-only).

## 11. API impact

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/api/sites/preview` | owner | rendered HTML; `Cache-Control: no-store` |

## 12. UI/UX impact

- Preview view with an "unpublished" banner and a link back to the editor.

## 13. Localization impact

- Preview renders in the dashboard locale or `?lang`; banner localized.

## 14. Security & tenancy

- Owner-only; foreign/unauthenticated denied; draft content never public.

## 15. Testing & verification

- Integration: unauthenticated ⇒ 401; foreign tenant ⇒ 403/404.
- Integration: response has `no-store` and `noindex`.
- Integration: draft edit appears in preview.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Preview renders current draft content.
- **AC-02** — Only the owner can access preview.
- **AC-03** — Preview is never publicly cacheable or indexed.
- **AC-04** — Draft changes are visible immediately in preview.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Do not reuse the public route for preview; keep caching semantics separate.
