# MILESTONE-011 — Project CRUD (bilingual)

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-011 |
| Epic | EPIC-005 — Portfolio (Projects) |
| Title | Project CRUD (bilingual) |
| Status | Not Started |
| Owner | — |
| Depends on | M-005, M-008 |
| Blocks | M-012, M-027 |
| PRD refs | FR-07, FR-10, PA-05 |
| Decisions | DEC-004, DEC-005 |
| Estimated size | L |

## 2. Objective

Deliver bilingual project create/read/update/delete for the owned Site, replacing
the "coming soon" stub, with validation and correct ownership enforcement.

## 3. Background & rationale

D-09: `projects/new` is a stub; D-13: fields are single-language; D-12: no site
linkage. FR-07 requires full CRUD. The schema was corrected in M-005; this
milestone delivers the handlers + UI.

## 4. Scope (in scope)

- Project list (Site-scoped), create, edit, delete.
- Bilingual title/description/location; category; status (draft/published/
  archived as publish eligibility).
- Server handlers (moved to feature `handlers.ts`), envelope responses.
- Client pages: replace `projects/new` stub; wire `ProjectEditor`.

## 5. Out of scope

- Cover image, gallery, ordering UX (M-012); public rendering (M-023); publish
  snapshot (M-021).

## 6. Dependencies & preconditions

- M-005 (schema), M-008 (site exists), M-001 (envelope).

## 7. Deliverables

- Change: `app/(dashboard)/dashboard/(panel)/projects/page.tsx` — real list.
- Change: `app/(dashboard)/dashboard/(panel)/projects/new/page.tsx` — real form.
- Add: `app/(dashboard)/dashboard/(panel)/projects/[id]/edit/page.tsx` (if absent).
- Change: `features/projects/handlers.ts`, `service.ts`, `api-client.ts`,
  `components/ProjectEditor.tsx`, `components/ProjectCard/List`.

## 8. Tasks

- **T01 — List**
  - Work: server component lists the Site's projects in order.
  - Done when: projects render with name/status and empty state.
- **T02 — Create/Edit**
  - Work: bilingual form for title/description/category/location; validate;
    save.
  - Done when: values persist across reload; EN/AR independent.
- **T03 — Delete**
  - Work: authorized delete, ownership-scoped, confirm dialog.
  - Done when: deleting another tenant's project is denied.
- **T04 — Status**
  - Work: draft/published/archived selection (eligibility semantics per DEC-004).
  - Done when: status persists and is explained in UI.

## 9. Interfaces & contracts touched

```ts
// features/projects/api-client.ts
listProjects(): Promise<Project[]>;
createProject(input: CreateProjectInput): Promise<Project>;
updateProject(input: UpdateProjectInput & { id: string }): Promise<Project>;
deleteProject(id: string): Promise<{ deleted: true }>;
```

## 10. Data model impact

- None beyond M-005; writes project rows scoped to the Site.

## 11. API impact

| Method | Path | Change |
|---|---|---|
| GET/POST/PUT/DELETE | `/api/projects` | envelope + bilingual shapes (already relocated in M-001) |

## 12. UI/UX impact

- Project list with cards/table, editor form, empty/loading/error states,
  accessible controls, responsive.

## 13. Localization impact

- Bilingual fields; new UI strings in catalogs; RTL-aware layout (M-019).

## 14. Security & tenancy

- All operations scoped by session tenant + owned `siteId`; deletion
  authorization server-side.

## 15. Testing & verification

- Integration: CRUD round-trip; cross-tenant denial; validation rejects bad input.
- Component: bilingual round-trip.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Users can create, view, edit, and delete their projects.
- **AC-02** — Title/description/location support EN and AR without overwriting.
- **AC-03** — Cross-tenant read/edit/delete are denied.
- **AC-04** — `projects/new` is no longer a stub.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- M-012 adds media/order; M-021 snapshots non-ARCHIVED projects in `order`.
- Public pages must not break on missing fields (fallback M-018).
