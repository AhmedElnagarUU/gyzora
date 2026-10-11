# MILESTONE-005 — Project↔Site Linkage & Bilingual Project Schema

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-005 |
| Epic | EPIC-002 — Domain, Ownership & Persistence |
| Title | Project↔Site Linkage & Bilingual Project Schema |
| Status | Not Started |
| Owner | — |
| Depends on | M-001, M-013 |
| Blocks | M-006, M-011 |
| PRD refs | FR-07, FR-10, FR-12, PA-05 |
| Decisions | DEC-004, DEC-005, DEC-006 |
| Estimated size | M |

## 2. Objective

Make every portfolio project belong to a Site (required `siteId`) and store its
title/description/location as bilingual `LocalizedText`, with ordering and cover
image fields.

## 3. Background & rationale

D-12: `Project.siteId` is optional and queries filter only by `tenantId`. D-13:
`title`/`description` are single strings. FR-07 requires per-Site ownership and
bilingual content. DEC-004 makes projects part of the published snapshot in
`order`.

## 4. Scope (in scope)

- `Project.siteId` required, indexed; `tenantId` retained for isolation.
- `title`, `description` → `LocalizedText`; add `location?: LocalizedText`.
- Add `coverImage?: ImageRef`, `images: ImageRef[]`, `order: number`,
  `slug` (unique per site), `category`.
- Repository queries scoped by `siteId` (+ `tenantId`).
- Zod schema for project input.

## 5. Out of scope

- Project CRUD UI/handlers (M-011), media picker UX (M-012), migration/backfill
  of existing rows (M-006).

## 6. Dependencies & preconditions

- M-013 done (`LocalizedText`, `ImageRef`). M-001 done (envelope). MongoDB.

## 7. Deliverables

- Change: `features/projects/model.ts` — required `siteId`, bilingual fields,
  media/order fields, indexes.
- Change: `features/projects/types.ts`, `features/projects/schema.ts`.
- Change: `features/projects/repository.ts` — filter by `(tenantId, siteId)`,
  ordering, unique-per-site slug handling.
- Change: `features/projects/service.ts` — set `siteId` from the owned Site.

## 8. Tasks

- **T01 — Model changes**
  - Work: required `siteId`; `LocalizedText` title/description/location; add
    `coverImage`, `images`, `order`, `slug`, `category`.
  - Done when: schema compiles; indexes declared (`{siteId, order}`,
    `{siteId, slug}` unique, `{tenantId}`).
- **T02 — Repository scoping**
  - Work: all reads filter by `tenantId` and `siteId`; ordered by `order` asc.
  - Done when: cross-site/tenant reads are impossible.
- **T03 — Validation**
  - Work: `createProjectSchema`/`updateProjectSchema` with bilingual fields and
    optional media.
  - Done when: invalid project input rejected server-side.
- **T04 — Service linkage**
  - Work: creating a project resolves the caller's Site and sets `siteId`.
  - Done when: a project cannot be created without an owned Site.

## 9. Interfaces & contracts touched

```ts
// features/projects/types.ts
type Project = {
  _id: ObjectId; tenantId: ObjectId; siteId: ObjectId;
  title: LocalizedText; description: LocalizedText; location?: LocalizedText;
  slug: string; category: string; order: number;
  status: 'DRAFT'|'PUBLISHED'|'ARCHIVED';
  coverImage?: ImageRef; images: ImageRef[];
  seoMetadata?: {...};
};
```

## 10. Data model impact

- `Project.siteId` required + indexed.
- `Project.title/description/location` → `LocalizedText`.
- New: `coverImage`, `images`, `order`, `slug`, `category` (if absent).
- Indexes: `{tenantId:1}`, `{siteId:1, order:1}`, `{siteId:1, slug:1}` unique.
- Backfill handled by M-006.

## 11. API impact

- Request/response shapes for `/api/projects` change to bilingual fields; the
  handlers are updated in M-011 (route already envelope-conformant from M-001).

## 12. UI/UX impact

- None here; enables M-011/M-012.

## 13. Localization impact

- Bilingual project fields; rendering fallback per M-018.

## 14. Security & tenancy

- Ownership via `siteId` derived from the session's Site; `tenantId` filter
  retained as defense in depth. Delete/update validate ownership server-side.

## 15. Testing & verification

- Integration: project without owned Site is rejected.
- Integration: cross-tenant/cross-site read/edit/delete denied.
- Unit: bilingual validation.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — `Project.siteId` is required and indexed; queries scope by it.
- **AC-02** — Project title/description/location are bilingual.
- **AC-03** — Ordering and cover/gallery fields persist.
- **AC-04** — Cross-site access is denied.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Changing field types requires the M-006 backfill before unique indexes apply.
- M-011 must send/receive bilingual shapes; M-021 snapshots projects in `order`.
