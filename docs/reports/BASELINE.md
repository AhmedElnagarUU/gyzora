# Baseline Report — Pre-MILESTONE-001

Recorded evidence for MILESTONE-001 task **T01 (Record baseline)**. These are the
frozen commands the recovery builds on; every later milestone compares against
them.

- **Date:** 2026-10-11
- **Node:** v24.18.1 · **npm:** 11.16.0
- **Environment:** local `.env` present (values never printed/committed).

## Commands actually run

| Command | Result | Notes |
|---|---|---|
| `npm run typecheck` | **Pass** (exit 0, no output) | `tsc --noEmit` |
| `npm run lint` | **Pass** — 0 errors, 44 warnings | `eslint .` |
| `npm run build` | **Pass** (exit 0) | Next.js 16.4.0 (Turbopack); compiled in ~48s |

### Lint warning inventory (44)

Warnings only; no errors. They are pre-existing and are **not** part of
MILESTONE-001 scope (tracked for later hardening):

- `@typescript-eslint/no-explicit-any` — mostly in `features/*/model.ts`
  (`Schema.Types.ObjectId as any`), admin route logic, and `TrackingScripts`.
- `@typescript-eslint/no-unused-vars` — unused imports/vars in dashboard pages
  and health route.
- `@next/next/no-img-element` — media page and `TemplateConfigContent`.

The admin/route `any` and unused-var warnings concentrated in
`app/api/admin/*` are resolved as a side effect of moving that logic into
`features/admin/` (MILESTONE-001 T02/T03).

### Build route inventory (31 routes)

`/`, `/_not-found`, `/api/{admin/analytics, admin/tenants, admin/users,
auth/[...all], auth/session, health, media, projects, sites, tenants, tracking,
users}`, `/auth/{signin, signup}`, `/dashboard` (+ `admin/{analytics,tenants,
users}`, `media`, `projects`, `projects/new`, `settings`, `settings/tracking`,
`sites`, `sites/new`, `templates`, `templates/[id]/configure`), `/owner`,
`/s/[slug]`.

> The DIAGNOSIS report cited "25 routes"; that figure matches the static-page
> generation count (`25/25`). The full route table contains **31** entries. The
> correct number is recorded here.

## Post-MILESTONE-001 verification (2026-10-11)

Re-run after the API boundary/contract cleanup:

| Command | Result |
|---|---|
| `npm run typecheck` | **Pass** (exit 0, no output) |
| `npm run lint` | **Pass** — 0 errors, **30 warnings** (down from 44; the `app/api/admin/*` `any`/unused-var warnings were removed with the route logic) |
| `npm run build` | **Pass** (exit 0) — 31 routes; `Generating static pages (25/25)` |

## Runtime verification

`MONGODB_URI` is a remote Atlas-style cluster reached over DNS SRV. During this
session DNS resolution was **intermittent**: the same route returned
`503 {"status":"degraded","checks":{"database":{"status":"error"}}}` when the SRV
lookup failed and `200 {"status":"healthy"}` when it succeeded. Because a
database connection was at times reachable, unauthenticated endpoint behavior
**was** exercised with `npm run dev`:

| Request | Observed |
|---|---|
| `GET /api/health` | `200 {"status":"healthy","timestamp":…,"checks":{"database":{"status":"ok"}}}` (or `503` degraded when SRV failed) |
| `GET /api/auth/session` | `401 {"success":false,"error":"Unauthorized"}` |
| `GET /api/projects` | `401 {"success":false,"error":"UNAUTHORIZED"}` |
| `GET /api/tracking` | `401 {"success":false,"error":"UNAUTHORIZED"}` |
| `GET /api/admin/{analytics,users,tenants}` | `401 {"success":false,"error":"UNAUTHORIZED"}` |

Authenticated paths (200/400/404/409) and the `PUT /api/sites` 400 mapping were
not exercised: no test credentials exist and creating users in the shared
database is unsafe (`AGENTS.md` §14). Those remain statically verified and are
closed by `MILESTONE-026` with `mongodb-memory-server`. Build/typecheck/lint
require no database.
