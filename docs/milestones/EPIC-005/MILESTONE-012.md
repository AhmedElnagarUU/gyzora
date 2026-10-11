# MILESTONE-012 — Project Media / Cover / Ordering

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-012 |
| Epic | EPIC-005 — Portfolio (Projects) |
| Title | Project Media / Cover / Ordering |
| Status | Not Started |
| Owner | — |
| Depends on | M-011 |
| Blocks | — |
| PRD refs | FR-07, FR-08, FR-14, PA-05, PA-06 |
| Decisions | DEC-005, DEC-006 |
| Estimated size | M |

## 2. Objective

Let customers attach a cover image and a gallery to each project, reorder projects
for display, and choose from their uploaded media.

## 3. Background & rationale

FR-07 lists cover image, additional images, and ordering; there is currently no
attach UI (DIAGNOSIS FR-07). Customer project imagery must be distinguishable
from illustrative template imagery (FR-08/DEC-006).

## 4. Scope (in scope)

- Cover image picker (from the tenant media library).
- Gallery: add/remove/reorder project images.
- Project display ordering (drag or up/down controls) persisted to `order`.
- Alt text (localized) per image.

## 5. Out of scope

- Upload flow itself (existing media feature); template illustration imagery
  (M-017); public rendering (M-023).

## 6. Dependencies & preconditions

- M-011 (project CRUD). Existing media/S3 feature functional.

## 7. Deliverables

- Change: `features/projects/components/ProjectEditor.tsx` — media sections.
- Add: `features/projects/components/ProjectMediaPicker.tsx`,
  `ProjectOrderControls.tsx`.
- Change: `features/projects/api-client.ts` — update cover/images/order.
- Change: `features/projects/service.ts` — persist `coverImage`, `images`,
  `order`.

## 8. Tasks

- **T01 — Cover picker**
  - Work: select one image as cover with localized alt.
  - Done when: cover persists and is used by listing/detail.
- **T02 — Gallery**
  - Work: multi-image add/remove/reorder with alt text.
  - Done when: gallery persists in order.
- **T03 — Project ordering**
  - Work: reorder controls update `order`; list reflects it.
  - Done when: order persists after reload.
- **T04 — Imagery labeling**
  - Work: mark customer images `source: 'upload'`; never mix with illustration.
  - Done when: public render can distinguish sources.

## 9. Interfaces & contracts touched

```ts
// features/projects/api-client.ts
updateProjectMedia(input: { id: string; coverImage?: ImageRef; images?: ImageRef[] }): Promise<Project>;
reorderProjects(input: { ids: string[] }): Promise<Project[]>;
```

## 10. Data model impact

- Writes `Project.coverImage`, `Project.images`, `Project.order`.

## 11. API impact

| Method | Path | Change |
|---|---|---|
| PUT | `/api/projects` | accepts cover/images |
| PUT | `/api/projects/reorder` (or `PUT ?order`) | persists ordering |

## 12. UI/UX impact

- Media picker modal, gallery grid, ordering controls; empty/loading/error
  states; keyboard-accessible reordering; responsive.

## 13. Localization impact

- Localized alt text per image; UI strings in catalogs.

## 14. Security & tenancy

- Media references must belong to the session's tenant; reject foreign keys;
  pre-signed upload constraints preserved.

## 15. Testing & verification

- Integration: media/order persist; foreign media reference rejected.
- Integration: reorder round-trip.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Projects have a persistable cover image.
- **AC-02** — Projects have a persistable, ordered gallery with alt text.
- **AC-03** — Project display order is editable and persists.
- **AC-04** — Only the tenant's own media can be referenced.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Public rendering (M-023) must size images consistently and fall back gracefully
  when no cover exists.
