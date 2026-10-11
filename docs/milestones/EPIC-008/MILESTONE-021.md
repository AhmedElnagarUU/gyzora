# MILESTONE-021 — Draft/Publish Workflow & Snapshot Service

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-021 |
| Epic | EPIC-008 — Publishing & Public Website |
| Title | Draft/Publish Workflow & Snapshot Service |
| Status | Not Started |
| Owner | — |
| Depends on | M-004, M-008, M-023 |
| Blocks | M-022, M-026, M-027 |
| PRD refs | FR-09, FR-11, PA-08 |
| Decisions | DEC-004 |
| Estimated size | L |

## 2. Objective

Implement publish/unpublish that validates draft content and eligible projects,
writes an immutable `Site.published` snapshot atomically, and refreshes public
caches — without ever exposing unfinished edits.

## 3. Background & rationale

D-03: "publish" only flips `Site.status`; there is no snapshot, so draft edits
would leak and failed publishes can't be detected. FR-09 requires a validated,
safe publication distinct from editing. S-04 notes caches are never invalidated.

## 4. Scope (in scope)

- `publishSite`: validate draft content + collect non-`ARCHIVED` projects in
  `order`; deep-copy into the snapshot; set `status='PUBLISHED'`; increment
  `version`; set `publishedAt`; `revalidatePath`.
- `unpublishSite`: set `status='DRAFT'`; revalidate.
- Atomicity: validate first; write snapshot + status in one update; on any
  failure nothing is written and the error is returned.
- Endpoints `POST /api/sites/publish` and `/unpublish`.

## 5. Out of scope

- Preview (M-022); public rendering (M-023, but revalidation targets it); SEO
  (M-024).

## 6. Dependencies & preconditions

- M-004 (snapshot schema), M-008 (site exists + valid content), M-023 (public
  route to revalidate).

## 7. Deliverables

- Add: `features/sites/publish-service.ts` (or extend `service.ts`) —
  `publishSite`, `unpublishSite`, `buildSnapshot`.
- Change: `features/sites/repository.ts` — `setPublishedAndStatus`,
  `setStatus`.
- Change: `features/sites/handlers.ts` — publish/unpublish handlers (envelope).
- Add: `app/api/sites/publish/route.ts`, `app/api/sites/unpublish/route.ts` —
  thin re-exports.
- Change: `features/sites/api-client.ts` — publish/unpublish.
- Change: `features/sites/components/SitePublishButton.tsx` — real action +
  feedback.

## 8. Tasks

- **T01 — Validation**
  - Work: server-side validation of what is required to publish (e.g. company
    name, at least the template's required content); collect eligible projects.
  - Done when: invalid publish returns 422 with a reason; nothing written.
- **T02 — Snapshot build**
  - Work: `buildSnapshot(site, projects, locale)` deep-copies content + projects
    in `order`.
  - Done when: snapshot is immutable relative to later draft edits.
- **T03 — Atomic write + status**
  - Work: single write setting `published`, `status`, `version`, `publishedAt`.
  - Done when: on failure, no partial state.
- **T04 — Revalidate**
  - Work: `revalidatePath('/s/{slug}')` (+ locale variants).
  - Done when: a published update is served promptly.
- **T05 — Unpublish**
  - Work: `status='DRAFT'`; revalidate; public 404s.
  - Done when: unpublish hides the site.

## 9. Interfaces & contracts touched

```ts
// features/sites/publish-service.ts
publishSite(tenantId: ObjectId): Promise<Site>;   // throws PublishValidationError
unpublishSite(tenantId: ObjectId): Promise<Site>;
buildSnapshot(site: Site, projects: Project[]): PublishedSnapshot;
```

## 10. Data model impact

- Writes `Site.published`, `Site.status`, `version`, `publishedAt`.

## 11. API impact

| Method | Path | Request | Response | Status |
|---|---|---|---|---|
| POST | `/api/sites/publish` | `{ id }` | `{ success, data: Site }` | 200 / 422 / 404 |
| POST | `/api/sites/unpublish` | `{ id }` | `{ success, data: Site }` | 200 / 404 |

## 12. UI/UX impact

- Publish/unpublish buttons with confirmation, loading, success, and error
  (validation) states. No false success.

## 13. Localization impact

- Publish validation messages localized by code (M-019).

## 14. Security & tenancy

- Ownership-scoped: only the owner's site can be published; `tenantId` from
  session; id must match the owned site.

## 15. Testing & verification

- Integration: publish writes snapshot; draft edits after publish don't change
  public; failed publish writes nothing; unpublish hides.
- Integration: snapshot is an independent deep copy (mutating draft doesn't
  mutate snapshot).
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Publish validates and writes an immutable snapshot atomically.
- **AC-02** — Failed publish writes nothing and reports failure (422).
- **AC-03** — Public reads only the snapshot; draft edits never leak.
- **AC-04** — Publish invalidates public caches; unpublish hides the site.
- **AC-05** — Only non-ARCHIVED projects, in `order`, are included.
- **AC-06** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- OD-4 (deploy/CDN) affects revalidation strategy.
- Ensure snapshot deep-copy (no shared references with `Site.content`).
