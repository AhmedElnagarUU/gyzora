# Diagnosis Report — Gzora Recovery

Evidence-based assessment of the repository at the start of the recovery. Every
claim is tied to a file path, a command result, or both. Classifications:
**Confirmed** (observed), **Suspected** (strong inference, not yet reproduced),
**Unresolved** (needs runtime/environment access).

## 1. Baseline verification (commands actually run)

| Command | Result | Evidence |
|---|---|---|
| `npm run typecheck` | **Pass** (exit 0, no output) | `tsc --noEmit` |
| `npm run lint` | **Pass** — 0 errors, 44 warnings | `eslint .` |
| `npm run build` | **Pass** — compiled in 63s, TS in 65s, 25 routes | Next.js 16.4.0 (Turbopack) |
| Test framework | **Absent** — no `vitest`, `@playwright`, or `jest` in `node_modules`; no `test` script in `package.json` | verified |

Stack: Next.js `16.4.0`, React `19.3.0`, Mongoose `9.11.0`, Better Auth `1.7.7`,
next-intl `4.14.9`, Zod `4.6.5`, Tailwind `4.3.3`, `lucide-react` `1.53.0`,
`aws-sdk` v2 `2.1693.0`.

**Production-readiness caveat (PRD FR-15):** compiling successfully is *not*
production readiness. Required tests do not exist, and multiple FRs are
unimplemented (below).

## 2. Requirement conformance summary

| PRD | Requirement | Status | Evidence |
|---|---|---|---|
| FR-01 | Auth (signup/login/session/roles) | **Mostly implemented** | `features/auth`, `proxy.ts`, `shared/lib/auth/*` |
| FR-02 | Dashboard & site lifecycle, one site | **Partially / contradicted** | Sites auto-created at signup; multi-site UI |
| FR-03 | Site creation with company info | **Not implemented** | `sites/new` collects only name/slug/template/theme/status |
| FR-04 | Improve the 2 existing templates | **Not done** | Templates only declare image slots; no content/rich sections |
| FR-05 | Required pages/sections | **Not done** | `TemplateRenderer` renders hardcoded placeholder blocks |
| FR-06 | Edit site content after create/publish | **Absent** | `Site` has no content field; no editor |
| FR-07 | Portfolio project CRUD | **Partial** | CRUD exists but title/description are single-language; no media attach UI |
| FR-08 | Image management + Pexels | **Pexels absent** | No integration code; only `PEXELS_API_KEY` in `.env.example` |
| FR-09 | Publication vs draft | **Absent** | Only `Site.status` enum; no snapshot; publish just flips status |
| FR-10 | Arabic/English | **Not wired** | next-intl installed but no provider/`[locale]`/middleware; UI hardcoded English |
| FR-11 | Public website access | **Minimal** | `/s/[slug]` renders placeholder; no pages/home-about-services |
| FR-12 | Persistence & one-site invariant | **Not enforced** | No unique index on owner/tenant; multiple Sites possible |
| FR-13 | Multi-tenant security | **Mostly present, gaps** | Some routes exceed scoping (see §5) |
| FR-14 | UX/visual quality | **Partial** | Landing acceptable; dashboard has dead links/stubs |
| FR-15 | Reliability/production readiness | **Not met** | No tests; unverified journeys |

## 3. Confirmed defects

### D-01 Site auto-created on signup, contradicting the creation journey — **Confirmed**
`features/auth/auth-client.ts:36-50` calls `createTenantWithSite()` on user
create; `features/tenants/service.ts:20-47` creates a Tenant **and a Site**
(`name + " - Site"`, slug `"${slug}-site"`). Consequence: every new user already
owns a Site, so the "create your first website" journey (PRD §5) is bypassed and
the dashboard "Create Site" can produce a **second** Site.

### D-02 No one-Site-per-user enforcement — **Confirmed**
`features/sites/model.ts:57-60` defines only a unique `slug` index and a
non-unique `(tenantId, slug)` index. `createSiteRecord` has no existence check.
FR-12 requires a unique constraint and safe concurrent creation. Violated.

### D-03 No editable site content; no draft/published separation — **Confirmed**
`features/sites/model.ts:3-13` has `name, slug, template, theme, status` only.
No content, no snapshot. `SitePublishButton` flips `status` via `PUT /api/sites`.
PRD FR-06 and FR-09 cannot be satisfied by the current schema.

### D-04 Templates are shallow and render placeholder content — **Confirmed**
`features/templates/types.ts:44-155` defines templates as image-slot lists with
two sections at most. `features/templates/components/TemplateRenderer.tsx:113-177`
renders hardcoded "Property Name" / "Description of the featured property
listing." blocks. `TemplateConfigContent.tsx:63-66` "Save Configuration" calls
`alert(...)` and persists nothing. FR-04, FR-05, PA-06 violated.

### D-05 No localization wiring — **Confirmed**
`i18n/routing.ts` and `i18n/config.ts` exist, but there is no
`NextIntlClientProvider`, no `useTranslations`, no `[locale]` segment, and
`proxy.ts` does not run next-intl middleware. `app/layout.tsx:30` hardcodes
`lang="en" dir="ltr"`. All UI copy is hardcoded English. `i18n/messages/{en,ar}.json`
cover only landing-page strings. FR-10, PA-07 violated.

### D-06 Pexels integration does not exist — **Confirmed**
Grep for `pexels` finds only `.env.example:24` and the PRD. No provider code,
no `images.pexels.com` in `next.config.ts` `remotePatterns`. FR-08 unmet.

### D-07 CODE_RULES route/handler violations — **Confirmed**
`CODE_RULES.md` §1 requires `route.ts` to be a thin re-export and logic to live
in `features/*/handlers.ts`. Violated by:
`app/api/projects/route.ts` (full logic), `app/api/tracking/route.ts`,
`app/api/admin/{analytics,tenants,users}/route.ts`, `app/api/health/route.ts`,
`app/api/auth/session/route.ts`.

### D-08 Inconsistent API response envelope — **Confirmed**
`CODE_RULES.md` §7 requires `{ success, data | error }`. Violated by
`app/api/projects/route.ts` (raw objects, `{ error }`), `app/api/tracking/route.ts`,
`app/api/admin/*` (raw objects / bespoke shapes), `app/api/auth/session/route.ts`
(`{ user }`). Consumers depend on the inconsistent shapes
(`features/media/api-client.ts` expects `data.data`; projects page expects raw).

### D-09 Dead ends and stub UI in the dashboard — **Confirmed**
- `app/(dashboard)/dashboard/(panel)/projects/new/page.tsx:15-18` renders
  "Project creation form is coming soon."
- `app/(dashboard)/dashboard/(panel)/settings/page.tsx` is static text with dead
  links (`/about`, `/contact`, `/privacy` in `shared/ui/Footer.tsx` route nowhere).
- `DashboardShell` nav (`features/dashboard/components/DashboardShell.tsx:15-40`)
  has no link to `/dashboard/settings/tracking` and uses emoji icons instead of
  `lucide-react`, contradicting FR-14 and the existing `lucide-react` dependency.
- `TemplateConfigContent` "Save" is a no-op (D-04).

### D-10 Tracking scripts never rendered on the public site — **Confirmed**
`features/tracking/components/TrackingScripts.tsx` exists but is not imported by
`app/s/[slug]/page.tsx` or any route (grep found no usage). The public site loads
no configured pixels.

### D-11 Public site renders unconfigured placeholder content; theme classes unused — **Confirmed**
`app/s/[slug]/page.tsx:55-64` wraps `TemplateRenderer` in a theme class from
`getThemeClass()` (`'dark'`/`'brand'`/`'light'`), but no CSS defines those
classes and `TemplateRenderer` hardcodes `bg-white text-gray-900`. Theme
selection has no visual effect. Public imagery is derived from the *first*
published project (`public-service.ts:57-99`), not from configured slots.

### D-12 Portfolios are not linked to a Site — **Confirmed**
`features/projects/model.ts:8` has `siteId?: ObjectId` **optional** and no
query filters by it. `findProjectsByTenant` filters only by `tenantId`. FR-07 /
§7 "portfolio projects belong to a Site" is not enforced. Given DEC-001 (one
site per user) the practical impact is limited, but the contract must be tightened.

### D-13 Project content is not bilingual — **Confirmed**
`features/projects/model.ts:9-11` stores `title`/`description` as single strings;
`ProjectEditor.tsx` collects one language. FR-07/FR-10 require bilingual project
content.

### D-14 Dangling documentation references — **Confirmed**
Code comments reference `docs/KNOWN_ISSUES.md`
(`features/sites/public-service.ts:97`, `TemplateConfigContent.tsx:64`), which
does not exist. This diagnosis report replaces it; the comments should be
updated by the relevant milestone.

## 4. Suspected issues (need runtime confirmation)

- **S-01** `getThemeClass()` output is not consumed by any style; theme
  selection appears to have no effect anywhere.
- **S-02** `features/users/service.ts:getUserProfile` ignores `tenantId` and
  returns any user by id; `GET /api/users?userId=` may allow cross-tenant user
  reads (session-only check). Needs an authorization review and regression test.
- **S-03** `createTenantWithSite` is not transactional (the auth adapter is
  constructed without a MongoClient to keep transactions disabled —
  `auth-client.ts:7-10`). A failure between Tenant and Site creation can leave
  orphaned data.
- **S-04** `/s/[slug]` is a dynamic route with `revalidate = 3600` but no
  `revalidatePath` is called on publish, so published updates may not refresh
  promptly.
- **S-05** `Project.status` semantics are ambiguous relative to publishing;
  the dashboard exposes Draft/Published/Archived per project while "publish" is
  site-level.

## 5. Tenant-isolation and security review

| Area | Finding | Class |
|---|---|---|
| Sites API | Scoped by session `tenantId`; no client-id trust | OK |
| Projects API | Filtered by session `tenantId` | OK |
| Media API | Tenant-scoped keys `tenants/{tenantId}/`; repository filters | OK |
| Tracking API | Scoped by `tenantId` | OK |
| Users API | `getUserById` ignores tenant; `?userId=` accepted | **Suspected gap (S-02)** |
| Admin APIs | `requireRole('OWNER')` guards all | OK |
| Public site | Requires `status==='PUBLISHED'` and `Tenant.status==='ACTIVE'` | OK |
| Public S3 objects | Pre-signed uploads with `ACL: 'public-read'`; images are public by design | Acceptable, document |

## 6. Architecture & data flow (as-is)

`UI → api-client → route.ts → handlers → service → repository → model`
(`CODE_RULES.md` §4). Server Components read through services directly.

```
User ──1:1── Tenant ──1:N── Site ──0:N── Project
                                  └── 0:N── Media (tenant-scoped)
                                  └── 0:1── TrackingConfig (tenant-scoped)
```

No `Site.content`; no published snapshot; template definitions are code-only.

## 7. What is already solid (do not rewrite)

- Feature-based structure and layering are consistent in most features
  (`sites`, `media`, `tenants`, `users`, `auth`).
- Better Auth integration and session/tenant context (`shared/lib/auth/session.ts`)
  are functional and should be preserved (PRD §11).
- S3 pre-signed upload flow with server-side type/size validation is sound.
- Landing page and auth pages are coherent.
- `npm run build` is green — the app compiles and type-checks.

## 8. Recommended corrections (mapped to epics)

| Defect | Correction | Epic / Milestone |
|---|---|---|
| D-07, D-08 | Thin routes + envelope | EPIC-001 / M-001 |
| D-14, env gaps | Env validation, doc refs | EPIC-001 / M-002 |
| D-01, D-02, D-12 | Ownership + unique indexes + site linkage | EPIC-002 / M-003, M-005, M-006 |
| D-03 | Content + published snapshot schema | EPIC-002 / M-004 |
| D-01, D-09 | One-site dashboard lifecycle | EPIC-003 / M-007 |
| FR-03 | Creation flow from template | EPIC-003 / M-008 |
| FR-06 | Content editors | EPIC-004 / M-009, M-010 |
| D-13 | Bilingual project CRUD | EPIC-005 / M-011, M-012 |
| D-04, D-11 | Rich templates + renderer | EPIC-006 / M-013…M-017 |
| D-05 | Localization wiring | EPIC-007 / M-018…M-020 |
| D-03, D-11, D-10, S-04 | Publish snapshot, preview, public render, tracking, cache | EPIC-008 / M-021…M-024 |
| FR-15 | Tests + production readiness | EPIC-009 / M-025…M-028 |

## 9. Unresolved / blocked

- **U-01** No test framework and no evidence of a running MongoDB during this
  audit; end-to-end runtime behavior was not exercised (build-time only).
- **U-02** Pexels availability (API key + usage terms) is unknown — OD-3.
- **U-03** Deployment target and CDN not confirmed — OD-4.
- **U-04** Locale routing strategy needs a product decision — OD-2.
- **U-05** Existing production data contents are unknown; migration strategy must
  be validated against a database dump before M-006.

## 10. Evidence appendix

Commands run during this audit:

```
npm run typecheck   # pass, no output
npm run lint        # 0 errors, 44 warnings
npm run build       # pass — Next.js 16.4.0, 25 routes
```

Route inventory from the build: `/`, `/auth/signin`, `/auth/signup`,
`/dashboard` (+ `admin/*`, `media`, `projects`, `projects/new`, `settings`,
`settings/tracking`, `sites`, `sites/new`, `templates`, `templates/[id]/configure`),
`/owner`, `/s/[slug]`, and APIs `/api/{admin/*, auth/*, health, media, projects,
sites, tenants, tracking, users}`.
