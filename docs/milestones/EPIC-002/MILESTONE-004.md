# MILESTONE-004 — Bilingual Site Content & Published Snapshot Schema

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-004 |
| Epic | EPIC-002 — Domain, Ownership & Persistence |
| Title | Bilingual Site Content & Published Snapshot Schema |
| Status | Not Started |
| Owner | — |
| Depends on | M-001, M-013 |
| Blocks | M-006, M-008, M-009, M-010, M-021, M-023 |
| PRD refs | FR-06, FR-09, FR-10, FR-12, PA-04, PA-08 |
| Decisions | DEC-002, DEC-004, DEC-005 |
| Estimated size | M |

## 2. Objective

Add the `Site.content` draft (bilingual) and the immutable `Site.published`
snapshot to the `Site` model, plus `defaultLocale`, so editing and publication
are separated per DEC-004.

## 3. Background & rationale

D-03: `Site` stores only `name/slug/template/theme/status`, so FR-06 (editing)
and FR-09 (draft vs published) are impossible. M-013 defines the `SiteContent`
shape; this milestone persists it and defines the snapshot.

## 4. Scope (in scope)

- Add `Site.content: SiteContent` (draft) and `Site.published:
  PublishedSnapshot | null`.
- Add `Site.defaultLocale: Locale` (default `en`).
- Repository/service helpers to read/update draft content and to write/read the
  snapshot.
- Zod schema for `SiteContent` and `PublishedSnapshot` (validated on write).

## 5. Out of scope

- Publish API/workflow (M-021), preview (M-022), public rendering (M-023).
- Editors (M-009/M-010). Note: this milestone stores content; the UI comes later.

## 6. Dependencies & preconditions

- M-013 defines `SiteContent`/`LocalizedText`/`ImageRef` types — consume, don't
  redefine.
- M-001 done (envelope). MongoDB available.

## 7. Deliverables

- Change: `features/sites/model.ts` — `content`, `published`, `defaultLocale`.
- Change: `features/sites/types.ts` — re-export/reference content types.
- Change: `features/sites/schema.ts` — Zod `siteContentSchema`,
  `publishedSnapshotSchema`, `updateSiteContentSchema`.
- Change: `features/sites/repository.ts` — `updateSiteContent`,
  `setPublished`, `clearPublished` (draft read already exists as find).
- Change: `features/sites/service.ts` — `updateDraftContent`, snapshot
  read/write helpers; `cloneTemplateContent` usage on create.

## 8. Tasks

- **T01 — Content + snapshot fields**
  - Work: add fields with sensible defaults (`content` seeded at create, not
    empty literal); `published` defaults to `null`; `defaultLocale` default `en`.
  - Done when: a created Site carries cloned template content (via M-008) or a
    minimal valid draft.
- **T02 — Zod validation**
  - Work: `siteContentSchema` validating the M-013 contract; `publishedSnapshotSchema`.
  - Done when: invalid content is rejected server-side.
- **T03 — Repository/service helpers**
  - Work: `updateDraftContent(tenantId, content)`, `setPublished(tenantId,
    snapshot)`, plus reads.
  - Done when: draft and snapshot are independently readable/writable; snapshot is
    never written by draft updates.
- **T04 — Immutability guarantee**
  - Work: ensure no code path mutates a `TemplateDefinition`; create deep-clones.
  - Done when: a test shows mutating `Site.content` does not affect the template.

## 9. Interfaces & contracts touched

```ts
// features/sites/service.ts
updateDraftContent(tenantId: ObjectId, content: SiteContent): Promise<Site>;
getDraftContent(tenantId: ObjectId): Promise<SiteContent | null>;
getPublishedSnapshot(slug: string): Promise<PublishedSnapshot | null>;
setPublished(tenantId: ObjectId, snap: PublishedSnapshot): Promise<Site>;
// shared/content or features/templates
cloneTemplateContent(t: TemplateDefinition, company: CompanyInput): SiteContent;
```

## 10. Data model impact

- `Site.content: SiteContent` (draft, bilingual).
- `Site.published: PublishedSnapshot | null`.
- `Site.defaultLocale: 'en' | 'ar'` (default `en`).
- No new indexes.

## 11. API impact

- No public endpoint change here. `PUT /api/sites` (existing) will later accept
  `content`; the handler/service path is prepared. Publish endpoints are M-021.

## 12. UI/UX impact

- None. Enables M-009/M-010 editors.

## 13. Localization impact

- All editable text is `LocalizedText`; `defaultLocale` seeds the public locale.
- Fallback resolution lives in `shared/i18n` (M-018).

## 14. Security & tenancy

- Content reads/writes are tenant-scoped; `tenantId` from session only.

## 15. Testing & verification

- Unit: Zod accepts valid content, rejects invalid; `LocalizedText` shape
  enforced.
- Integration: draft update does not change `published`; snapshot write is
  independent.
- Unit: template immutability after clone.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — `Site` persists draft `content`, `published` snapshot,
  `defaultLocale`.
- **AC-02** — Draft updates never modify the published snapshot.
- **AC-03** — Content is validated by Zod before persistence.
- **AC-04** — Template definitions are never mutated by content operations.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Snapshot content must be a deep copy at publish time (M-021) so later draft
  edits cannot mutate it.
- M-006 must backfill `content`/`defaultLocale` for existing sites.
- The exact `SiteContent` shape is owned by M-013; changes require updating both.
