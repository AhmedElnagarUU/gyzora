# EPIC-002 — Domain, Ownership & Persistence

## 1. Summary

Establish the ownership and persistence core: one Site per user (enforced by
unique indexes), bilingual `SiteContent` with an immutable published snapshot,
and portfolio projects linked to a Site with bilingual fields. This is the
foundation every feature reads and writes.

## 2. Motivation

The current schema cannot satisfy the PRD: Sites are auto-created at signup
(D-01), no uniqueness is enforced (D-02), there is no content or published
snapshot (D-03), and projects are not linked to a Site or bilingual (D-12, D-13).
Fixing symptoms in the UI is pointless without the correct data layer.

## 3. Scope

- In scope: `Site` ownership fields + indexes; `SiteContent` + `PublishedSnapshot`
  persistence; `Project.siteId` required + bilingual fields; migration/backfill
  and index enforcement.
- Out of scope: editors/UI (EPIC-004/005), templates (EPIC-006), publish API
  (EPIC-008).

## 4. Related requirements

| PRD | Requirement |
|---|---|
| FR-02 | Dashboard & site lifecycle, one site |
| FR-06 | Website content editing (storage) |
| FR-07 | Portfolio management (storage) |
| FR-12 | Persistence and data integrity |
| PA-02 | One Site per user |
| PA-09 | API and data integrity |

## 5. Related decisions

- DEC-001 — user owns one Tenant and one Site; signup must not create a Site.
- DEC-002 — templates immutable; `Site.content` a clone of default content.
- DEC-004 — draft content + published snapshot.

## 6. Milestones

| ID | Title | Depends on | Status |
|---|---|---|---|
| MILESTONE-003 | Site Ownership & One-Site-Per-User | M-001, M-013 | Not Started |
| MILESTONE-004 | Bilingual Site Content & Published Snapshot Schema | M-001, M-013 | Not Started |
| MILESTONE-005 | Project↔Site Linkage & Bilingual Project Schema | M-001, M-013 | Not Started |
| MILESTONE-006 | Data Migration & Index Enforcement | M-003, M-004, M-005 | Not Started |

## 7. Dependencies

- Requires: EPIC-001 (envelope, env), MILESTONE-013 (content shape).
- Unblocks: EPIC-003 (creation), EPIC-004 (editing), EPIC-005 (portfolio),
  EPIC-008 (publishing), M-025 (domain tests).

## 8. Definition of Done (epic)

- [ ] Unique indexes on `Site.ownerUserId` and `Site.tenantId` exist and are
      enforced (concurrent-create test proves exactly one site).
- [ ] Signup no longer creates a Site.
- [ ] `Site.content` and `Site.published` persist per the DATA_MODEL contract.
- [ ] `Project.siteId` is required; project text is bilingual.
- [ ] Migration is defined and validated; no customer data loss.
- [ ] Domain/isolation tests pass (M-025).

## 9. Risks & open decisions

- OD-1 (keep Tenant vs migrate) — DEC-001 recommends keeping Tenant.
- OD-6 / U-05 (existing auto-created empty sites) — migration must be validated
  against a real dump.
- Changing `Project.title/description` type requires a backfill; coordinate with
  M-011 consumers.

## 10. Handoff notes

- Contracts frozen: `SiteContent`, `PublishedSnapshot`, `LocalizedText`,
  `Site.ownerUserId/tenantId` uniqueness, `Project.siteId` required,
  `Project` bilingual fields.
- EPIC-008 assumes `Site.published` is `null` until first publish.
