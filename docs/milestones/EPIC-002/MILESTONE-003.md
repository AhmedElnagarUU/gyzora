# MILESTONE-003 — Site Ownership & One-Site-Per-User

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-003 |
| Epic | EPIC-002 — Domain, Ownership & Persistence |
| Title | Site Ownership & One-Site-Per-User |
| Status | Not Started |
| Owner | — |
| Depends on | M-001, M-013 |
| Blocks | M-006, M-007, M-008 |
| PRD refs | FR-02, FR-12, PA-02 |
| Decisions | DEC-001 |
| Estimated size | M |

## 2. Objective

Make ownership explicit and enforce the one-Site-per-user invariant at both the
database and service layer, and stop auto-creating a Site at signup.

## 3. Background & rationale

D-01: `features/auth/auth-client.ts` calls `createTenantWithSite()`, so every
user already has a Site, bypassing the creation journey. D-02: `Site` has no
unique index on `ownerUserId`/`tenantId` and `createSiteRecord` has no existence
check, so multiple Sites are possible. DEC-001 defines the target model.

## 4. Scope (in scope)

- Add `Site.ownerUserId` (required, unique) and make `Site.tenantId` unique.
- Add `createSite` service guard + duplicate-key (11000) → `ONE_SITE_LIMIT`
  mapping, safe under concurrency.
- Change signup so it creates only a Tenant (no Site).
- Provide `getOwnedSite(userId/tenantId)` resolution used by dashboard lines.

## 5. Out of scope

- Content/snapshot fields (M-004); project linkage (M-005); migration of existing
  data (M-006); creation UI (M-008).

## 6. Dependencies & preconditions

- M-001 done (envelope/status codes), M-013 done (shared content type available
  for the model if needed).
- MongoDB available to create/verify indexes.

## 7. Deliverables

- Change: `features/sites/model.ts` — `ownerUserId` + unique indexes.
- Change: `features/sites/repository.ts` — `countSitesByOwner`, index-aware
  (depends on model), duplicate-key handling support.
- Change: `features/sites/service.ts` — `createSite` guard +
  `ONE_SITE_LIMIT`; `getOwnedSite`.
- Change: `features/tenants/service.ts` — `createTenantWithSite` split into
  `createTenant` (no site) used by signup.
- Change: `features/auth/auth-client.ts` — call `createTenant` only.
- Change: `features/sites/handlers.ts` — POST returns 409 `ONE_SITE_LIMIT`.

## 8. Tasks

- **T01 — Model + indexes**
  - Work: add `ownerUserId` (ref user, required) and unique indexes on
    `ownerUserId` and `tenantId`; keep unique `slug`.
  - Done when: indexes are declared and created on connect.
- **T02 — Service guard**
  - Work: `createSite` rejects when a site already exists for the owner/tenant;
    catch E11000 and map to `ONE_SITE_LIMIT`.
  - Done when: second create returns a conflict; concurrent creates yield one.
- **T03 — Signup without Site**
  - Work: signup creates Tenant only.
  - Done when: a new user has a Tenant and **no** Site.
- **T04 — Handler status**
  - Work: `POST /api/sites` returns 409 `ONE_SITE_LIMIT` when owned; 201 on
    success.
  - Done when: contract testable.

## 9. Interfaces & contracts touched

```ts
// features/sites/service.ts
createSite(input: CreateSiteInput, ctx: TenantContext): Promise<Site>;
getOwnedSite(tenantId: ObjectId): Promise<Site | null>;
// features/tenants/service.ts
createTenant(input: { name: string; userId: ObjectId }): Promise<Tenant>;
```

## 10. Data model impact

- `Site.ownerUserId`: `ObjectId`, required, **unique**.
- `Site.tenantId`: **unique** (was non-unique index).
- No backfill here; M-006 performs the migration for existing rows.

## 11. API impact

| Method | Path | Change |
|---|---|---|
| POST | `/api/sites` | 409 `ONE_SITE_LIMIT` when a site already exists |

## 12. UI/UX impact

- None directly; enables M-007/M-008 states. Error code `ONE_SITE_LIMIT` is
  surfaced later by the dashboard.

## 13. Localization impact

- Error code is stable/machine-readable; message localized by client (M-019).

## 14. Security & tenancy

- `ownerUserId`/`tenantId` always come from the session (`getTenantContext`),
  never the request body (CODE_RULES §5).
- Unique indexes are the server-side source of truth for the invariant.

## 15. Testing & verification

- Integration: second create → 409; two concurrent creates → exactly one row.
- Integration: signup creates Tenant, not Site.
- Index introspection asserts uniqueness on `ownerUserId` and `tenantId`.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Unique indexes exist on `Site.ownerUserId` and `Site.tenantId`.
- **AC-02** — Duplicate creation returns `ONE_SITE_LIMIT`; concurrent creation
  yields one Site.
- **AC-03** — Signup no longer creates a Site.
- **AC-04** — `getOwnedSite` resolves the single site for a tenant.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Risk: existing rows with null `ownerUserId`/duplicates break the unique index —
  M-006 must run the backfill first in production order.
- Keep `Tenant` (OD-1, DEC-001); do not introduce a second ownership abstraction.
- M-008 depends on `ONE_SITE_LIMIT` semantics.
