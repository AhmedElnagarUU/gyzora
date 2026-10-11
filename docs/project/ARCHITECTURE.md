# Architecture

Describes the **target** architecture of the recovery, grounded in the verified
current structure. Decisions live in `TECHNICAL_DECISIONS.md`; this document
shows how the system is wired.

## 1. Runtime stack (verified)

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js `16.4.0` (App Router, Turbopack) | Breaking changes — consult `node_modules/next/dist/docs/` |
| Language | TypeScript `6.0.3`, `strict: true` | `npm run typecheck` |
| UI | React `19.3.0`, Tailwind CSS `4.3.3`, `lucide-react` | No component library |
| Server runtime | Route Handlers + Server Components | No Server Actions |
| DB | MongoDB via Mongoose `9.11.0` | cached connection, `bufferCommands: false` |
| Auth | Better Auth `1.7.7` + `@better-auth/mongo-adapter` | users in `user` collection |
| Storage | Amazon S3 (`aws-sdk` v2) pre-signed uploads | metadata in MongoDB |
| i18n | next-intl `4.14.9` | see `LOCALIZATION.md` |
| Validation | Zod `4.6.5` | per-feature `schema.ts` |
| Middleware | `proxy.ts` (Next.js 16 "proxy") | auth + role gates |

> Risk: `aws-sdk` v2 is end-of-support (build warning). Migration to v3 is out of
> scope for the MVP but recorded as a risk; do not add new v2-only usage.

## 2. Layering

```
app/                     Routing only (thin pages, thin route.ts re-exports)
  (marketing)/           Landing page (public)
  (dashboard)/           Authenticated dashboard
  (owner)/               Owner console
  s/[slug]/              Public published site
  api/                   Route handlers → thin re-export of feature handlers
features/<feature>/      One folder per feature
  components/            UI (server + client)
  handlers.ts            auth + validation, then service
  api-client.ts          fetch wrapper for client components
  service.ts             business logic
  repository.ts          DB queries only (.lean())
  model.ts               Mongoose schema + interface
  schema.ts              Zod validation
  types.ts
shared/                  Used by 2+ features only
  lib/                   auth, db, s3, env, images, logger
  ui/                    Button, Input, Modal, Header, Footer
  i18n/                  locale helpers, direction, fallback
i18n/                    next-intl routing/config + messages/{en,ar}.json
```

Flow inside a feature: `UI → api-client → route.ts → handlers → service →
repository → model` (`CODE_RULES.md` §4). Server Components may call the
feature **service** directly.

## 3. Request paths

### Authenticated mutation (dashboard)
```
Client component → features/<f>/api-client.ts
  → app/api/<f>/route.ts (re-export)
    → features/<f>/handlers.ts (requireSession + requireTenantContext + Zod)
      → features/<f>/service.ts
        → features/<f>/repository.ts → model
```

### Server-rendered read (dashboard / public)
```
Server Component → features/<f>/service.ts → repository → model
```

### Public published site
```
GET /s/[slug] (?lang=ar|en)
  → features/sites/public-service.ts
      → findPublishedSiteBySlug (status==='PUBLISHED')
      → Tenant.status === 'ACTIVE'
  → TemplateRenderer( site.published snapshot, locale, projects )
```

## 4. Ownership & tenancy

- `getTenantContext(headers)` resolves `{ userId, role, tenantId, sessionId }`
  from the Better Auth session (`shared/lib/auth/session.ts`).
- `requireSession` → 401; `requireRole('OWNER')` → 403.
- `handlers` for tenant-scoped features call `requireTenantContext` (session +
  non-empty tenantId).
- **Every** tenant-scoped repository function takes `tenantId` as its first
  argument and filters by it (`CODE_RULES.md` §5).
- Owner cross-tenant access is only via explicit owner-named functions.

## 5. Publication model (target, DEC-004)

```
Site.content      → draft (editable anytime)
Site.published    → immutable snapshot { content, template, theme, defaultLocale,
                    projects[], version, publishedAt }
Site.status       → DRAFT | PUBLISHED  (gates public visibility)
```

- Publish: validate → build snapshot → atomic write → `revalidatePath`.
- Public render reads **only** `Site.published`.
- Preview reads draft (`Site.content`) on an owner-only, non-cacheable route.

## 6. Template system (target, DEC-002)

- `TemplateDefinition` (immutable, code) → pages/sections/content-schema/defaults.
- `Site.content` is a deep clone of `defaultContent` + company input.
- `TemplateRenderer` is template-agnostic; section components in
  `features/templates/sections/` render by section `type`.
- Templates differ by composition, order, theme, identity — not by data shape.

See `TEMPLATE_SYSTEM.md`.

## 7. Configuration & environment

- Server env validated once by `shared/lib/env.ts` (Zod) — DEC-008.
- S3 client is lazily constructed so `next build` never depends on S3 env.
- `next.config.ts` sets security headers, ISR cache headers for `/s/*`, and
  `images.remotePatterns` (S3 + Pexels).

## 8. Caching / revalidation

- Public route: `revalidate = 3600` currently; publish must call
  `revalidatePath('/s/{slug}')` (+ locale variants) to refresh.
- Dashboard routes: `dynamic = 'force-dynamic'`.
- Preview: always dynamic and never publicly cacheable.

## 9. Boundaries that must not be crossed

- No feature imports another feature's `model.ts`/`repository.ts` — call its
  `service.ts` (`CODE_RULES.md` §1).
- Client components never import server-only modules (mongoose, models, services
  that touch secrets).
- `app/api/**/route.ts` contains no logic (DEC-003).
- Shared templates are never mutated (DEC-002, PRD invariant 8).
