# API Contracts

Distinguishes the **verified current** API from the **agreed target**. Do not
assume an endpoint exists because it is in the target table. Envelope rule
(DEC-003): `{ success: true, data }` | `{ success: false, error }` with HTTP
400/401/403/404/409/500.

## 1. Verified current endpoints

| Method | Path | Auth | Response shape | Notes |
|---|---|---|---|---|
| GET/POST | `/api/auth/[...all]` | public | Better Auth | sign-up/in/out |
| GET | `/api/auth/session` | session | `{ success, data: { user } }` / 401 `{ success:false, error }` | conforming (M-001) |
| GET | `/api/sites` | session+tenant | `{ success, data }` | list or `?slug=` single |
| POST | `/api/sites` | session+tenant | `{ success, data }` 201 | **no one-site guard** |
| PUT | `/api/sites` | session+tenant | `{ success, data }` | update by `id` (incl. `status`) |
| GET/POST/PUT/DELETE | `/api/projects` | session+tenant | `{ success, data }` | logic in `features/projects/handlers.ts` (M-001) |
| GET/POST/PUT/DELETE | `/api/media` | session+tenant | `{ success, data }` | conforming |
| GET/POST | `/api/tracking` | session+tenant | `{ success, data }` | logic in `features/tracking/handlers.ts` (M-001) |
| GET | `/api/tenants` | session (+OWNER for list) | `{ success, data }` | |
| POST | `/api/tenants` | OWNER | `{ success, data }` 201 | |
| GET | `/api/users` | session | `{ success, data }` | `?userId=` accepted (S-02) |
| GET | `/api/admin/analytics` | OWNER | `{ success, data }` | conforming (M-001) |
| GET/POST | `/api/admin/tenants` | OWNER | `{ success, data }` | GET list or `?id=`; POST `{ id, action }` lifecycle (M-001) |
| GET | `/api/admin/users` | OWNER | `{ success, data: { users, total } }` | conforming (M-001) |
| GET | `/api/health` | public | `{ status, checks }` | monitoring; acceptable |

## 2. Target endpoints

### Sites
| Method | Path | Request | Response | Rules |
|---|---|---|---|---|
| GET | `/api/sites` | — | `{ success, data: Site[] }` | 0 or 1 item |
| POST | `/api/sites` | `CreateSiteInput` | 201 `{ success, data: Site }` | 409 `ONE_SITE_LIMIT` if owned; 409 `SLUG_TAKEN` |
| PUT | `/api/sites` | `UpdateSiteInput` | `{ success, data: Site }` | updates settings/draft content; ownership-scoped |
| POST | `/api/sites/publish` | `{ id }` | `{ success, data: Site }` | validates + snapshots; 422 on validation failure |
| POST | `/api/sites/unpublish` | `{ id }` | `{ success, data: Site }` | `status='DRAFT'` |
| GET | `/api/sites/preview` | `?slug=` | rendered HTML (owner-only) | draft content; `no-store` |

### Projects
| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/projects` | `?id=` optional | `{ success, data: Project[] \| Project }` |
| POST | `/api/projects` | `CreateProjectInput` | 201 `{ success, data: Project }` |
| PUT | `/api/projects` | `{ id, ...UpdateProjectInput }` | `{ success, data: Project }` |
| DELETE | `/api/projects` | `?id=` | `{ success, data: { deleted: true } }` |

All project handlers live in `features/projects/handlers.ts`; `route.ts`
re-exports only.

### Media (conforming today; keep)
`POST` → `{ uploadUrl, key, url }`; `PUT` → metadata; `GET` → list; `DELETE?id=`.
Server-side MIME/size validation; keys `tenants/{tenantId}/...`.

### Tracking
`GET` → `{ success, data: TrackingConfig | { trackers: [] } }`;
`POST` → `{ success, data }` with Zod validation.

### Images (optional, M-017)
`GET /api/images/search?q=&orientation=` → `{ success, data: { images: [...] } }`.
Server-only Pexels call; returns `[]` (never errors) when the provider is
unconfigured or fails, so the UI can fall back to curated defaults.

## 3. Contract rules

- Handlers own auth + Zod validation; services own business logic; repositories
  own queries (`.lean()`).
- Tenant/owner identifiers always derive from the session, never request body.
- Errors are strings, never stack traces or secrets.
- `/api/sites/preview` and any draft-data endpoint must send `Cache-Control:
  no-store` and require ownership.
- List endpoints return arrays (possibly empty), never `undefined`.

## 4. Verification

Every endpoint above is covered by `MILESTONE-026` contract tests and, where
user-facing, `MILESTONE-027` E2E tests. Cross-tenant denial is tested for
`sites`, `projects`, `media`, `tracking`, and `users`.
