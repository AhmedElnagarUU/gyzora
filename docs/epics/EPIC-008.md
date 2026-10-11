# EPIC-008 — Publishing & Public Website

## 1. Summary

Deliver the draft/publish model and the public website: publishing snapshots
validated content + eligible projects; the public route renders only the
snapshot; the owner can preview unpublished changes; and public pages carry SEO
metadata and configured tracking scripts.

## 2. Motivation

Today "publish" only flips `Site.status` (D-03) and the public route renders
placeholder content (D-11) while tracking scripts are never loaded (D-10). FR-09
and FR-11 require a safe published version distinct from editable content.

## 3. Scope

- In scope: publish/unpublish service + snapshot, cache revalidation, owner-only
  preview, public rendering from snapshot, SEO metadata, tracking scripts on the
  public site.
- Out of scope: editor UI (EPIC-004/005), template design (EPIC-006), localization
  wiring (EPIC-007, consumed here), custom domains/CDN beyond existing config.

## 4. Related requirements

| PRD | Requirement |
|---|---|
| FR-09 | Publication and updates |
| FR-11 | Public website access |
| FR-08 | Image handling on public render |
| PA-08 | Publication |

## 5. Related decisions

- DEC-004 — draft content + immutable published snapshot; public reads snapshot
  only when `PUBLISHED`; publish invalidates caches; preview is owner-only and
  non-cacheable.

## 6. Milestones

| ID | Title | Depends on | Status |
|---|---|---|---|
| MILESTONE-021 | Draft/Publish Workflow & Snapshot Service | M-004, M-008, M-023 | Not Started |
| MILESTONE-022 | Owner-Only Preview | M-021 | Not Started |
| MILESTONE-023 | Public Website Rendering from Snapshot | M-004, M-014, M-015, M-016, M-018 | Not Started |
| MILESTONE-024 | Public SEO Metadata & Tracking Scripts | M-020, M-023 | Not Started |

## 7. Dependencies

- Requires: EPIC-002 (snapshot schema), EPIC-006 (renderer/templates), EPIC-007
  (localization).
- Unblocks: M-026 (publishing tests), M-027 (E2E publish), M-028.

## 8. Definition of Done (epic)

- [ ] Publish validates and writes a snapshot atomically; failure writes nothing
      and reports failure.
- [ ] Public route renders only the snapshot, only when `status==='PUBLISHED'`.
- [ ] Draft edits never leak to the public site; re-publish refreshes it.
- [ ] Preview shows draft content to the owner only and is never publicly
      cacheable.
- [ ] SEO metadata (`title`, `description`, OG, `hreflang`) and configured tracking
      scripts render on the public site.
- [ ] Deleted/unpublished/missing sites return a graceful 404.
- [ ] `typecheck`, `lint`, `build` pass; publish isolation covered by tests.

## 9. Risks & open decisions

- OD-4 (deploy/CDN) — affects revalidation strategy.
- S-04: publish must call `revalidatePath` for the site (and locale variants).
- S-02 (users API cross-tenant read) should be closed before public release.

## 10. Handoff notes

- Contract frozen: `POST /api/sites/publish`, `/unpublish`, `/preview`
  (owner-only, `no-store`); `PublishedSnapshot` shape.
- EPIC-009 verifies the full publish journey.
