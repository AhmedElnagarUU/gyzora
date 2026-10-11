# Module Map

Feature ownership and responsibilities. Verified against the source tree. Any
module not listed does not exist.

## Features

| Feature | Path | Owns | Public interface (consumed by others) |
|---|---|---|---|
| auth | `features/auth/` | Better Auth wiring, signup/signin, session, `updateUser` | `auth-client` (server), `api-client` (client), `service.updateUser` |
| users | `features/users/` | `User` model, profile reads | `service.getUserById/getUserProfile` |
| tenants | `features/tenants/` | `Tenant` model, tenant creation, tenant reads | `service.*`, `handlers` |
| sites | `features/sites/` | `Site` model, site creation/update, public resolution | `service.*`, `public-service.*`, `handlers` |
| projects | `features/projects/` | `Project` (portfolio) model + CRUD | `service.*`, `handlers` |
| media | `features/media/` | `Media` model, S3 pre-signed upload + metadata | `service.*`, `handlers` |
| templates | `features/templates/` | Template/theme definitions, renderer, section components | `index.ts` (definitions), `components/` |
| tracking | `features/tracking/` | `TrackingConfig` model, public script rendering | `service.*`, `repository`, `components/TrackingScripts` |
| admin | `features/admin/` | Platform-owner console (analytics, tenants, users); no model of its own — composes owner-named functions from the domain features | `handlers` |
| health | `features/health/` | Monitoring health handler (route stays thin) | `handlers` |
| dashboard | `features/dashboard/` | Dashboard shell/nav (client) | `components/DashboardShell` |

## Shared

| Module | Path | Responsibility |
|---|---|---|
| DB | `shared/lib/db/mongoose.ts` | Cached Mongoose connection |
| Auth | `shared/lib/auth/session.ts` | `getTenantContext`, `requireSession`, `requireRole` |
| Auth | `shared/lib/auth/auth-client.ts` | Lazily-built Better Auth instance |
| Auth | `shared/lib/auth/auth-client.ts` / `session-client.ts` | client hooks |
| S3 | `shared/lib/s3/s3-client.ts` | Pre-signed URLs, public URL, MIME/size limits |
| Images | `shared/lib/images/pexels.ts` *(to add, M-017)* | Optional server-side Pexels provider |
| Env | `shared/lib/env.ts` | Zod-validated server env (lazy `getEnv()`/typed `env`; `publicEnv`) |
| i18n | `shared/i18n/` | Locale helpers, direction, fallback *(to extend)* |
| UI | `shared/ui/` | Button, Input, Modal, Header, Footer |

## App routes

| Route | Type | Renders |
|---|---|---|
| `/` | marketing | Landing (`app/(marketing)/components/*`) |
| `/auth/signin`, `/auth/signup` | public | Auth forms |
| `/dashboard` | dyn | Overview / site lifecycle |
| `/dashboard/sites`, `/dashboard/sites/new` | dyn | Site list / creation |
| `/dashboard/projects`, `/dashboard/projects/new` | dyn | Portfolio management |
| `/dashboard/media` | public shell | Media library |
| `/dashboard/templates`, `/dashboard/templates/[id]/configure` | mixed | Template selection/config |
| `/dashboard/settings`, `/dashboard/settings/tracking` | dyn | Settings / tracking |
| `/dashboard/admin/{analytics,tenants,users}` | dyn | Owner console |
| `/owner` | dyn | Owner landing |
| `/s/[slug]` | dyn (ISR) | Public published site |
| `/api/*` | route | Thin re-exports (target, DEC-003) |

## Cross-feature rules

- `sites.service` may call `tenants` (reads) and `templates` (definitions).
- `sites.public-service` may read `projects` and `tracking` data.
- `projects` may call `media` (image references) but not its repository.
- `templates` is pure data/UI — it must not import DB models.
- `dashboard` is presentation only.
- `admin` owns no model; it calls owner-named functions on `tenants`, `sites`,
  `projects`, and `auth` services only (`CODE_RULES.md` §1/§5) — never their
  models or repositories.

Anything not listed above must be added deliberately and recorded here.
