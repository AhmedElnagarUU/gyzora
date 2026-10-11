# MILESTONE-006 — Data Migration & Index Enforcement

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-006 |
| Epic | EPIC-002 — Domain, Ownership & Persistence |
| Title | Data Migration & Index Enforcement |
| Status | Not Started |
| Owner | — |
| Depends on | M-003, M-004, M-005 |
| Blocks | M-008, M-025 |
| PRD refs | FR-12, PA-02, PA-09 |
| Decisions | DEC-001, DEC-002, DEC-004, DEC-005 |
| Estimated size | M |

## 2. Objective

Define and run a safe, idempotent migration that brings existing data into the
new schema (owner fields, bilingual content, project linkage) and enforces the
new indexes without data loss.

## 3. Background & rationale

M-003/M-004/M-005 add required fields and uniqueness that existing rows may not
satisfy (U-05, OD-6). Without a validated migration, index creation fails or
silently drops data. FR-12 requires integrity for real data, not just fresh
databases.

## 4. Scope (in scope)

- A migration script (e.g. `scripts/migrate-*.ts` or documented MongoDB steps)
  that: sets `Site.ownerUserId` from the owning Tenant's user when possible;
  wraps string project fields into `{ en, ar: '' }`; sets `Project.siteId` from
  the tenant's Site; fills `Site.content`/`defaultLocale` defaults; removes/keeps
  pre-existing auto-created empty Sites per OD-6.
- Idempotent, dry-run-first, logged, reversible where feasible.
- Index creation after backfill.

## 5. Out of scope

- Feature UI; public rendering. New data written by the app after migration.

## 6. Dependencies & preconditions

- M-003, M-004, M-005 done.
- **A database dump/backup must exist** before running (AGENTS §14, FR-12).
- OD-6 decision required (migrate vs delete auto-created empty Sites).
- U-05: validate against a real dump before production.

## 7. Deliverables

- Add: `scripts/migrations/00X-backfill-site-project.ts` (or documented
  equivalent) with a `--dry-run` mode.
- Add: `docs/reports/MIGRATION.md` — steps, decisions, and a validated dry-run
  report.
- Change: index definitions if creation is part of boot/migration.

## 8. Tasks

- **T01 — Inventory existing data**
  - Work: count Sites without `ownerUserId`, Projects without `siteId`, and
    single-language project rows; identify duplicate Sites per user.
  - Done when: counts recorded in MIGRATION.md from a dump (not guesses).
- **T02 — Write migration (dry-run)**
  - Work: implement backfills idempotently; `--dry-run` prints intended changes.
  - Done when: dry-run on the dump reports changes with zero writes.
- **T03 — Resolve duplicates**
  - Work: decide keep/delete for duplicate/empty auto-created Sites per OD-6.
  - Done when: a documented rule handles every duplicate deterministically.
- **T04 — Apply + enforce indexes**
  - Work: run the migration, then create unique indexes.
  - Done when: all target indexes exist; no uniqueness error.
- **T05 — Verify**
  - Work: post-migration invariants hold (one site per owner, all projects linked,
  bilingual fields valid).
  - Done when: verification queries return zero violations.

## 9. Interfaces & contracts touched

- No app interfaces; data-level only. May add `scripts/` npm entries.

## 10. Data model impact

- Backfills the fields introduced in M-003/004/005; then enforces:
  `Site.ownerUserId` unique, `Site.tenantId` unique, `Site.slug` unique,
  `Project.{siteId,slug}` unique, `Project.siteId` required.

## 11. API impact

- None.

## 12. UI/UX impact

- None.

## 13. Localization impact

- Existing single-language strings become `{ en: value, ar: '' }`; empty `ar`
  renders via fallback (M-018).

## 14. Security & tenancy

- Migration runs server-side with DB credentials only; never logs secrets or PII.
- Must not merge data across tenants.

## 15. Testing & verification

- Run the migration twice (idempotency).
- Assert zero uniqueness violations and zero unlinked projects after apply.
- `typecheck`, `lint`, `build` pass (script compiles).

## 16. Acceptance criteria

- **AC-01** — Dry-run is non-destructive and complete.
- **AC-02** — Migration is idempotent (second run is a no-op).
- **AC-03** — All target unique indexes exist after migration.
- **AC-04** — Post-migration invariant queries return zero violations.
- **AC-05** — Migration validated against a real dump (U-05); otherwise reported
  blocked, not passing.

## 17. Handoff & risks

- **Blocked if** no dump/backup is available — report blocked (do not run blind).
- OD-6 must be resolved (delete vs keep empty auto-created Sites).
- Keep a documented rollback/restore path.
