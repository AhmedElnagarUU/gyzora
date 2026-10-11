# Gzora — Code Rules

## 1. Structure: Feature-Based

Everything about a feature lives in ONE folder. No global models/, services/, or repositories/ folders.

gzora/
├── app/                      # Routing only (thin pages, layouts, thin route.ts files)
│   ├── (marketing)/
│   ├── (dashboard)/
│   ├── (owner)/
│   ├── s/[slug]/            # Public published sites (render snapshot only)
│   └── api/
├── features/
│   └── projects/             # one folder per feature
│       ├── components/       # UI (server + client)
│       ├── handlers.ts       # API logic: auth + validation, then calls service
│       ├── api-client.ts     # fetch wrapper used by client components
│       ├── service.ts        # Business logic
│       ├── repository.ts     # DB queries (only place that touches the model)
│       ├── model.ts          # Mongoose schema + interface for THIS feature
│       ├── schema.ts         # Zod validation
│       └── types.ts
├── shared/                   # Used by 2+ features only
│   ├── ui/                   # Button, Input, Modal...
│   ├── lib/                  # auth, db connection, s3, env, images
│   └── i18n/                 # locale helpers, direction, fallback
├── docs/                     # evidence-based project documentation (see AGENTS.md)
└── public/                   # static assets incl. bundled template imagery

Rules:
- A feature never imports another feature's model.ts or repository.ts. It calls the other feature's service.ts.
- Move code to shared/ only when a second feature needs it.
- app/api/.../route.ts is only a thin re-export of the feature's handlers (e.g. `export { POST } from '@/features/projects/handlers'`). No logic inside it.
- Each feature is a bundle: it can be understood, tested, or deleted on its own.

## 2. Naming

| Element | Convention | Example |
|---|---|---|
| Components | PascalCase | ProjectCard.tsx |
| Other files | kebab-case | project-service.ts |
| Models | PascalCase singular | Project |
| Collections | snake_case plural | projects |
| Env vars | SCREAMING_SNAKE | MONGODB_URI |
| i18n keys | dot.notation | projects.list.title |

## 3. Server / Client Boundary

- Server Components by default. `'use client'` only for interactivity, browser APIs, and pixels/analytics.
- Client components never import repository, service, model, or anything using secrets.
- All mutations and client-triggered requests go through API Routes (Route Handlers). No Server Actions.
- Client components call the API only through the feature's api-client.ts.
- Server Components may read data by calling the feature's service directly (no fetch to own API).
- Always validate on the server, even if validated on the client.

## 4. Flow Inside a Feature

UI → api-client → route.ts → handlers → service → repository → model

- Handler: auth check + Zod validation, then calls service.
- Service: business logic only.
- Repository: queries only. Returns plain objects (.lean()), never Mongoose documents.
- Pages/components never query the DB directly.

## 5. Multi-Tenancy

- tenantId always comes from the session (getTenantContext()), never from client input.
- Every tenant-scoped repository function takes tenantId as its first argument and filters by it.
- Every tenant-scoped model has an index on tenantId (compound when needed, e.g. `{ tenantId: 1, slug: 1 }`).
- OWNER cross-tenant access goes through explicit owner-named functions, never by skipping the filter.

## 6. Auth

- Better Auth only. No custom auth logic.
- Session has user.id, user.role, user.tenantId. Roles: CUSTOMER, OWNER.
- Use shared helpers: requireSession() and requireRole('OWNER'). Don't re-write the check in each file.
- For any resource by id: check it belongs to the session's tenant.

## 7. Validation & Errors

- Zod for all input, in each feature's schema.ts.
- Handlers use safeParse and return errors as values: 400 validation, 401 no session, 403 no permission, 404 not found, 500 unexpected.
- Every handler returns the same shape: `{ success: true; data: T } | { success: false; error: string }`.

## 8. Media (S3)

- Files go to S3. MongoDB stores only metadata `{ key, url, size, mimeType, tenantId }`.
- Pre-signed uploads only. Key must start with `tenants/{tenantId}/`.
- Check max size and allowed mime types before signing.
- Use next/image.

## 9. TypeScript

- strict: true. No any — use unknown and narrow.
- Explicit return types on exported functions.
- Each model file exports its interface next to its schema.

## 10. Env

- Server-only: MONGODB_URI, BETTER_AUTH_SECRET, S3_*, POLAR_ACCESS_TOKEN.
- Client-safe: NEXT_PUBLIC_* only.
- Validate all env vars at startup (Zod).
- Never commit .env. Keep .env.example updated.

## 11. Testing

- Vitest for services/repositories (mongodb-memory-server).
- Required test per tenant-scoped feature: one tenant can't read another's data.
- Playwright for critical flows: signup → create site → publish → view.

## 12. Don't

| Don't | Do instead |
|---|---|
| Global models/ folder | model.ts inside the feature |
| Import another feature's model/repository | Call its service |
| Query DB in components | Use the feature repository |
| Trust client tenantId | Take it from session |
| Server Actions | API Route + handlers.ts |
| Logic inside route.ts | Put it in the feature's handlers.ts |
| Skip validation | Zod in schema.ts |
| Use any | unknown + narrowing |
| Pages Router / getServerSideProps | App Router + Server Components |

## 13. Localization (see `docs/project/LOCALIZATION.md`)

- All customer-editable text is `LocalizedText = { en: string; ar: string }`;
  language is modeled explicitly, never inferred from text direction.
- Fallback resolution (`requested → en → omit`) lives once in `shared/i18n`
  (`resolveLocalized`) — do not re-implement per feature.
- Dashboard locale: `locale` cookie (default `en`), next-intl without i18n
  routing. Public locale: `Site.defaultLocale` + `?lang=en|ar`.
- **No `[locale]` URL segment** (DEC-005).
- RTL uses logical CSS utilities (`ms-*`/`me-*`/`ps-*`/`pe-*`,
  `text-start`/`text-end`), never `ml/mr/left/right` for direction-sensitive
  spacing.
- UI strings live in `i18n/messages/{en,ar}.json`; every `en` key must exist in
  `ar`. No hardcoded user-visible strings.

## 14. Templates & content contract (see `docs/project/TEMPLATE_SYSTEM.md`)

- Templates are **immutable code definitions** in `features/templates/` — never
  a DB collection and never mutated by customer edits (DEC-002).
- One `SiteContent` shape and one `SectionType` union for **all** templates; a
  single `TemplateRenderer` renders any template.
- Site creation deep-clones `template.defaultContent` (+ company input) —
  `cloneTemplateContent` is the only reader of default content.
- Icons: `lucide-react` only. Images: `next/image`; failed loads degrade to a
  styled placeholder; alt text required.
- Imagery priority: uploads > optional Pexels > bundled fallbacks. Pexels is
  server-only, optional, and never a dependency of creation/rendering (DEC-006).
  Do not label illustrative imagery as a customer project.

## 15. Publishing & drafts (see DEC-004)

- `Site.content` = **draft**, editable anytime (before or after publishing).
- `Site.published` = immutable snapshot written only by the publish operation
  (`{ content, template, theme, defaultLocale, projects[], version, publishedAt }`).
- Public routes render **only** `Site.published`, and only when
  `status === 'PUBLISHED'`. Draft never leaks to the public site.
- Publish validates server-side; on failure nothing is written (no false
  success) and the response reports failure (422 on validation).
- Publish/unpublish invalidate public caches (`revalidatePath`).
- Preview renders draft content on an owner-only route with `no-store`.

## 16. Environment & secrets (see DEC-008)

- Server env validated once by `shared/lib/env.ts` (Zod); client code reads only
  `NEXT_PUBLIC_*`.
- `PEXELS_API_KEY` and other optional integrations must be modeled as optional —
  the app must run without them.
- Never commit `.env`; keep `.env.example` in sync. Never print/echo `.env`
  values.