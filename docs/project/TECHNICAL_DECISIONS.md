# Technical Decisions

Authoritative cross-cutting decisions for the recovery. These decisions bind
**all** epics and milestones. If an implementation needs to deviate, the
deviation must be recorded here (new `DEC-*` entry or an amendment) **before**
implementation, and open questions are tracked as `OD-*`.

Status legend: **Accepted** (binding), **Proposed** (binding until amended),
**Open** (needs a product/owner decision — do not silently resolve).

Evidence references use `path:line` where useful. "Verified" means confirmed by
reading source and/or running the command named.

---

## DEC-001 — Ownership model: User owns one Tenant and one Site

**Status:** Accepted · **Owner:** Architecture · **Epics:** 002, 003

- A `User` (Better Auth `user` collection) is the ownership principal.
- Signup creates exactly one `Tenant` for the user. For CUSTOMER users the
  tenant↔user relationship is **1:1** in the MVP.
- Signup **must not** auto-create a `Site`. Verified defect: the current auth
  hook calls `createTenantWithSite()`, which creates a Site immediately
  (`features/auth/auth-client.ts:41`, `features/tenants/service.ts:37`),
  contradicting PRD §5 and FR-02.
- A `Site` records **both** `ownerUserId` (unique) and `tenantId` (unique). The
  unique indexes enforce FR-12 one-Site-per-user at the database layer; the
  service layer performs a pre-check and converts duplicate-key (11000) errors
  into a stable `ONE_SITE_LIMIT` conflict.
- All reads/writes are ownership-scoped: `tenantId`/`ownerUserId` always come
  from the session (`getTenantContext()`), never from client input
  (`CODE_RULES.md` §5).
- The OWNER role retains cross-tenant access only through explicit
  owner-named repository functions.

**Rationale:** Preserves the existing tenant-scoped architecture (media keys,
tracking, admin dashboard) while satisfying the PRD's user-ownership rule.
Removing `Tenant` would be a large, risky refactor for no product benefit.

---

## DEC-002 — Template definitions are immutable, code-resident, and versioned

**Status:** Accepted · **Owner:** Architecture · **Epics:** 006

- Templates are **static module definitions** in `features/templates/`, not a
  mutable DB collection.
- A `TemplateDefinition` contains: `id`, `name`, `slug`, `description`,
  supported locales, `previewImage`, `pages[]`, `sections[]` (typed content
  schema), `imageSlots[]`, and `defaultContent` (bilingual).
- `Site.content` is initialized by a **deep clone** of the template's
  `defaultContent` plus company input. Template objects are **never mutated** by
  customer edits (PRD invariant 8, FR-06, FR-12).
- A single `TemplateRenderer` renders any template from
  `(template, siteContent, locale, media, projects)`. Section rendering is
  additive per section `type`; templates differ by section composition, order,
  and theme — not by divergent data contracts.
- Both existing templates (`real-estate`, `construction`) must implement the
  same page/section contract.

---

## DEC-003 — API response envelope and thin route handlers

**Status:** Accepted · **Owner:** Architecture · **Epics:** 001

- Every feature handler returns exactly one of:
  `{ success: true, data: T }` or `{ success: false, error: string }`
  (`CODE_RULES.md` §7).
- `app/api/**/route.ts` is a **thin re-export** of a feature handler. No logic
  in `route.ts` (`CODE_RULES.md` §1).
- Verified violations to correct: `app/api/projects/route.ts` (full logic, raw
  objects), `app/api/tracking/route.ts` (full logic, raw objects),
  `app/api/admin/*` (logic + raw objects), `app/api/auth/session/route.ts`
  (`{ user }` shape). See `reports/DIAGNOSIS.md`.
- HTTP status mapping: 400 validation, 401 no session, 403 no permission,
  404 not found, 409 conflict (e.g. one-site limit, slug taken), 500 unexpected.

---

## DEC-004 — Editing vs publication: draft content + published snapshot

**Status:** Accepted · **Owner:** Architecture/Product · **Epics:** 002, 008

- `Site.content` is the **draft** (editable at any time, before or after first
  publication). Editing never requires publishing (PRD invariant 6, FR-09).
- `Site.published` is a **snapshot** written only by the publish operation:
  `{ content, template, theme, defaultLocale, projects[], version, publishedAt }`.
- The public route renders **only** from `Site.published` and only when
  `Site.status === 'PUBLISHED'`. Draft edits can never leak to the public site.
- Publish validation runs server-side; on failure nothing is written and the
  response reports failure (FR-09 "Failed publishing must not falsely report
  success").
- `Project.status ∈ {DRAFT, PUBLISHED, ARCHIVED}` means "eligible for the next
  site publish": publish snapshots content + all non-`ARCHIVED` projects in
  `order`. Editing a project does not change the live snapshot until re-publish.
- Publish/unpublish invalidates public caches (`revalidatePath`) for the site.
- Preview renders from draft content on an owner-authenticated route that is
  never publicly cacheable.

**Rationale:** The simplest design that guarantees "editing must not expose
unfinished changes" without a second collection or a diff engine.

---

## DEC-005 — Localization: bilingual content, no URL locale prefix

**Status:** Proposed (see OD-2) · **Owner:** Product/Architecture · **Epics:** 007

- Supported locales: `en` (default) and `ar`.
- All customer-editable text is stored as `LocalizedText = { en: string; ar: string }`
  (or localized arrays). Language is modeled explicitly, never inferred from
  text direction (FR-10).
- Fallback policy: requested locale → `en` → omit the field/section. Defined
  once in `shared/i18n`.
- Dashboard locale comes from a `locale` cookie (default `en`) via next-intl
  "without i18n routing". UI strings live in `i18n/messages/{en,ar}.json`.
- Public site default locale is `Site.defaultLocale`; visitors switch with
  `?lang=ar|en`. The public wrapper sets `lang`/`dir`; a language toggle is
  rendered on the public site. `hreflang` alternates are emitted.
- **No `[locale]` URL segment** is introduced — this preserves the existing
  routing scheme (PRD FR-11: do not introduce a new routing scheme).
- Root `<html>` `lang`/`dir` follow the resolved locale.
- RTL layout uses `dir` plus logical CSS properties (`ms-`/`me-`/`ps-`/`pe-`,
  `text-start`/`text-end`) so nothing breaks in either direction.

**Open question:** whether SEO warrants locale-prefixed routes (OD-2).

---

## DEC-006 — Template quality, imagery, and sample content

**Status:** Accepted · **Owner:** Product/Architecture · **Epics:** 006

- Both templates provide these pages: **Home, About, Services, Projects,
  Project Details, Contact** (PRD FR-05).
- No placeholder-only or empty sections on a newly created site; defaults are
  real, coherent, category-appropriate content.
- Default/sample content is flagged (`isSampleContent`) and worded generically.
  No invented achievements, certifications, project counts, or years of
  experience are presented as a customer's real facts (FR-05, FR-08).
- Imagery: each template ships **curated fallback images** bundled with the app;
  an **optional** server-only Pexels provider (`shared/lib/images/pexels.ts`)
  may supply illustrative imagery when `PEXELS_API_KEY` is configured. Site
  creation/render must **not** depend on the provider being reachable (FR-08).
- Illustrative imagery is always distinguishable from customer-uploaded project
  imagery; illustration is never labeled as a customer project.
- Icons: `lucide-react` only (FR-14). Images: `next/image`; `images.pexels.com`
  added to `next.config.ts` `remotePatterns`.
- Alt text required for meaningful images; failed image loads degrade to a
  styled placeholder.

---

## DEC-007 — Testing: Vitest for units/integration, Playwright for E2E

**Status:** Accepted · **Owner:** QA/Architecture · **Epics:** 009

- Add Vitest for services/repositories with a real MongoDB
  (`mongodb-memory-server` preferred; `TEST_MONGODB_URI` local fallback).
- Add Playwright for critical journeys.
- Add npm scripts `test`, `test:watch`, `test:e2e`.
- Required regression tests: tenant isolation for every tenant-scoped feature;
  one-Site-per-user including concurrent creation; publish-snapshot isolation;
  AR/EN rendering and `dir` attributes.
- `CODE_RULES.md` §11 already mandates this; it is currently unmet (no test
  framework installed — verified).

---

## DEC-008 — Server environment validation

**Status:** Accepted · **Owner:** Architecture · **Epics:** 001

- A server-only Zod-validated env module (`shared/lib/env.ts`) parses and
  validates environment variables once; missing required vars produce a clear
  startup error instead of an obscure runtime crash.
- Client code may only read `NEXT_PUBLIC_*`. Secrets never reach the client.
- `.env.example` is the documented template and is kept in sync (never commit
  `.env`).

---

## DEC-009 — Scope guard for pre-existing extras

**Status:** Accepted · **Owner:** Product · **Epics:** all

- The repository already contains an Owner dashboard, tracking/pixels, S3 media,
  and a Subscription/plan field. PRD §8 excludes **advanced analytics and
  marketing automation** and a **new billing system** from the MVP.
- Decision: these existing features are **retained and only hardened** (tenant
  isolation, API envelope, localization where user-facing). The recovery does
  **not** expand them, and they are not MVP acceptance gates except where they
  affect user-facing FRs (e.g. tracking scripts on the public site, FR-11/FR-14).
- Any expansion of these features requires a new documented decision.

---

## Open decisions

| ID | Question | Options | Impact | Owner |
|---|---|---|---|---|
| OD-1 | Keep `Tenant` or migrate to direct User ownership? | Keep Tenant (recommended, DEC-001) / Remove Tenant | Data model, all repos | Architecture |
| OD-2 | Locale in URL (`/ar/...`) or cookie + `?lang`? | Cookie + `?lang` (DEC-005) / locale-prefixed routes | SEO, routing, all pages | Product |
| OD-3 | Pexels: attribution and key availability? | Use if key present / drop provider | Template imagery | Product/Ops |
| OD-4 | Deployment target (Vercel vs self-hosted) & CDN | Vercel / self-host / other | ISR + revalidation, cache | Ops |
| OD-5 | Project `status` semantics vs site-level publish | Site publish gate (DEC-004) / per-project publish | Publish model, UI | Product |
| OD-6 | Migrate/delete pre-existing auto-created empty Sites? | Migrate / delete / keep | Existing data | Product |
| OD-7 | Is the Owner dashboard in MVP scope? | Harden only (DEC-009) / out of scope | Effort | Product |

Open decisions must be resolved through a recorded amendment here before the
dependent milestone is marked complete. They must not be silently changed.
