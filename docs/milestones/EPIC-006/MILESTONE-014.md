# MILESTONE-014 — Shared Renderer & Section Library

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-014 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Shared Renderer & Section Library |
| Status | Done |
| Owner | Lead Engineering Agent |
| Depends on | M-013 |
| Blocks | M-015, M-016, M-017, M-018, M-023 |
| PRD refs | FR-04, FR-05, FR-08, FR-14, PA-06 |
| Decisions | DEC-002, DEC-006 |
| Estimated size | L |

## 2. Objective

Build one template-agnostic `TemplateRenderer` plus a section component library
that renders any template's pages from `SiteContent`, with graceful degradation
and no placeholder text.

## 3. Background & rationale

D-04/D-11: the current renderer hardcodes "Property Name" blocks and ignores
theme. FR-04 requires rendering real content; DEC-002 mandates a single renderer
driven by section type.

## 4. Scope (in scope)

- `TemplateRenderer` rendering `template.pages` → sections in order.
- Section components: `Hero`, `Intro`, `Services`, `Features`,
  `FeaturedProjects`, `Stats`, `Process`, `Cta`, `Contact`, `AboutBody`,
  `ProjectGrid`, `ProjectDetail`.
- Fallbacks: omit empty sections; image error → styled placeholder; no
  placeholder copy.
- Theme token application (colors, spacing, radii, typography).

## 5. Out of scope

- Template-specific composition/identity (M-015/016); imagery provider (M-017);
  localization wiring (M-018, but components accept `locale` now).

## 6. Dependencies & preconditions

- M-013 types/content. `projects` passed as a separate argument.

## 7. Deliverables

- Change: `features/templates/components/TemplateRenderer.tsx` — rewrite
  (Server Component).
- Add: `features/templates/sections/*.tsx` — one component per `SectionType`
  (12), plus `sections/types.ts` (shared `SectionProps`).
- Change: `features/templates/theme.ts` — `themeCssVars()` token application.
- Add: `features/templates/components/ImageWithFallback.tsx`.
- Add: `features/templates/lib/text.ts` (`resolveLocalized` shim + UI copy
  map) and `features/templates/lib/icons.ts` (lucide icon resolver).

## 8. Tasks

- **T01 — Renderer skeleton** ✅
  - Work: iterate `template.pages`, resolve sections, render in order, skip
    unknown.
  - Done when: an unknown section is skipped without error.
  - Result: `TemplateRenderer` resolves the page by `pageId` (default: home
    `'/'`), maps sections through the `SECTION_COMPONENTS` registry, and skips
    any `SectionType` without a component — verified by the `unknown-skip`
    runtime check (all 12 types render + an injected `'mystery'` type is
    silently skipped).
- **T02 — Core sections** ✅
  - Work: hero, intro, services, features, featured-projects, cta, contact.
  - Done when: each renders real content and hides when empty.
  - Result: both home pages render their declared core sections; `services=[]`
    and empty `contact` omit their sections entirely (verified at runtime).
- **T03 — Project sections** ✅
  - Work: project-grid + project-detail from the `projects` argument.
  - Done when: projects render with cover/gallery and fallbacks.
  - Result: `project-grid` and `project-detail` render from the
    `ProjectView[]` argument (covers, category, gallery, back link);
    `activeProjectSlug` selects the detail project; empty → omitted.
- **T04 — Optional sections** ✅
  - Work: stats (only real data), process, about-body.
  - Done when: absent when data missing.
  - Result: `stats` renders only with real data (defaults stay stats-free —
    FR-05), `process` empty → omitted, `about-body` renders title/body/
    mission/vision + image.
- **T05 — Theme + images** ✅
  - Work: apply theme tokens; `next/image` with error fallback + alt text.
  - Done when: theme visibly affects output; broken images degrade gracefully.
  - Result: `themeCssVars()` maps `TemplateTheme` colors/fonts to `--tp-*`
    custom props on the renderer root (verified `#2563eb` etc. in output);
    `ImageWithFallback` renders a styled placeholder for empty slots, swaps on
    `onError`, and keeps `alt` on the placeholder.

## 9. Interfaces & contracts touched

```ts
// features/templates/components/TemplateRenderer.tsx  (Server Component)
export interface TemplateRendererProps {
  template: TemplateDefinition
  content: SiteContent
  projects?: ProjectView[]          // separate argument — not part of SiteContent
  locale?: Locale                   // 'en' | 'ar', default 'en'
  theme?: TemplateTheme             // defaults to template.theme
  pageId?: string                   // template page id; defaults to home ('/')
  activeProjectSlug?: string        // for 'project-detail' sections
}

// features/templates/sections/types.ts
export interface SectionProps {
  type: SectionType                 // section marks its own root: data-section={type}
  content: SiteContent
  projects: ProjectView[]
  locale: Locale
  theme: TemplateTheme
  page: TemplatePage                // current page (names, project-detail path)
  activeProjectSlug?: string
}

// features/templates/types.ts — new view-model (self-contained, no cross-feature imports)
export interface ProjectView {
  id: string
  slug: string
  title: string
  description: string
  category?: string
  coverImage?: string
  gallery: string[]
}

// features/templates/theme.ts
function themeCssVars(theme: TemplateTheme): CSSProperties  // --tp-{primary,secondary,…} + --tp-font-*
```

## 10. Data model impact

- None (render-only).

## 11. API impact

- None.

## 12. UI/UX impact

- Responsive sections; loading/empty states; accessible headings/landmarks;
  consistent spacing/typography.

## 13. Localization impact

- Components resolve `LocalizedText` via `resolveLocalized(value, locale)`.
  Implemented as a temporary shim in `features/templates/lib/text.ts` (M-018
  replaces it with the shared `shared/i18n` helper).
- The renderer sets `dir`/`lang` from the locale; sections use logical
  layout classes and a localized UI-copy map (`lib/text.ts`, `uiCopy`) for
  structural labels (buttons, headings, footer) — these are interface copy,
  never customer content.

## 14. Security & tenancy

- Render-only; no DB access; receives only already-scoped data.

## 15. Testing & verification

- Unit: unknown section skipped; empty content omits sections; no placeholder
  strings in output.
- Unit: image error fallback renders.
- `typecheck`, `lint`, `build` pass.

| Item | Result |
|---|---|
| `npm run typecheck` | **Pass**, exit 0 |
| `npm run lint` | **0 errors**, 28 warnings (all pre-existing) |
| `npm run build` | **Pass**, exit 0 — 31 routes |
| Runtime (dev, 2026-10-12) | Temporary `/m14-check` server page → **23/23 checks true** |

Verified behaviors (2026-10-12): both templates' home pages render their
declared sections in order; all 12 `SectionType`s have components; an injected
unknown section type is skipped without error; empty `services`/`process`/
`contact` omit their sections entirely; `stats` renders only with real data (and
is absent from defaults); neither home page contains placeholder copy
(`Property Name`, `lorem`, `coming soon`, old hardcoded strings…); theme tokens
(`--tp-*` + `#2563eb`) appear in the output; empty image slots render a styled
fallback and filled slots render `<img>`; project pages/detail render from the
`projects` argument (and are omitted without it); `ar` renders `dir="rtl"` with
Arabic UI copy; nav lists the five real pages and excludes the `[slug]` route.

> Note: Next 16 rejects `react-dom/server` imports inside `app/` routes, so the
> runtime verification used a temporary server-component page (the same RSC path
> as `/s/[slug]`) instead of an API route. The page and its temp artifacts were
> removed after verification.

## 16. Acceptance criteria

| AC | Status | Evidence |
|---|---|---|
| AC-01 | **Pass** | One `TemplateRenderer` renders both templates from `SiteContent` + projects; runtime home-page checks true for `real-estate` and `construction` |
| AC-02 | **Pass** | All 12 `SectionType`s have components (`all-12-section-types-render` true); unknown type skipped (`unknown-section-skipped` true) |
| AC-03 | **Pass** | Empty `services`/`process`/`contact` omitted; `stats` never fabricated; `no-placeholder-copy-*` true for both templates |
| AC-04 | **Pass** | `ImageWithFallback` uses `next/image` with localized `alt`; empty slot → styled placeholder (`image-fallback-empty-slot` true) |
| AC-05 | **Pass** | `themeCssVars` tokens present in rendered output (`--tp-primary`, `--tp-font-sans`, `#2563eb`) |
| AC-06 | **Pass** | `typecheck` pass; `lint` 0 errors/28 warnings (pre-existing); `build` pass (31 routes) |

## 17. Handoff & risks

- M-018 replaces the fallback shim with the shared `resolveLocalized`.
- Sections must not assume template-specific fields; both templates share them.

### Handoff record

| Field | Value |
|---|---|
| Milestone | MILESTONE-014 — Shared Renderer & Section Library |
| Owner | Lead Engineering Agent |
| Date | 2026-10-12 |
| Status | **Done** |

**Files changed**

| Path | Change | Why |
|---|---|---|
| `features/templates/components/TemplateRenderer.tsx` | Rewritten | Template-agnostic per-page renderer (Server Component): resolves page, renders sections in order via `SECTION_COMPONENTS`, applies theme tokens, header/nav/footer chrome |
| `features/templates/sections/*.tsx` + `types.ts` | **new** | 12 section components (one per `SectionType`) + shared `SectionProps`; each marks its own root with `data-section` |
| `features/templates/components/ImageWithFallback.tsx` | **new** | `next/image` wrapper — styled placeholder on empty src or `onError`; `unoptimized` for arbitrary media URLs |
| `features/templates/theme.ts` | Extended | `themeCssVars()` maps `TemplateTheme` → `--tp-*` CSS custom properties |
| `features/templates/lib/text.ts` | **new** | `resolveLocalized` shim + localized UI-copy map (M-018 replaces the shim) |
| `features/templates/lib/icons.ts` | **new** | lucide icon resolver with graceful fallback icon |
| `features/templates/types.ts` | Extended | `ProjectView` view-model for the renderer (projects stay out of `SiteContent`) |
| `features/templates/index.ts` | Extended | Re-exports `themeCssVars` + `ProjectView` |
| `app/s/[slug]/page.tsx` | Rewritten | Renders `TemplateRenderer` with `template.defaultContent` (sample, `isSampleContent: true`) merged with published-project slot images; snapshot wiring lands M-023 |

**Deviations & decisions**

- Renderer + sections are **Server Components**; only `ImageWithFallback` is a
  client component. Passing `TemplateDefinition` (which carries Zod
  `sectionSchemas` class instances) across a client boundary fails RSC
  serialization — the server-component design is the fix and matches
  CODE_RULES "Server Components by default" and the `/s/[slug]` call path.
- `data-section` markers live on each section's own root so a degraded (null)
  section leaves no artifact; an earlier wrapper marker emitted `data-section`
  even for empty sections and was removed.
- Added optional `pageId`/`activeProjectSlug` props (not in the draft
  interface) so the renderer renders one page at a time; template-route pages
  (e.g. `/projects/[slug]`) stay out of the nav.
- Nav/CTA links are template-relative (`/{pageId}`, `#contact`); real
  `/s/[siteSlug]/[page]` paths land with M-023 routing.
- `ImageWithFallback` uses `unoptimized` (bypasses remote-pattern config for
  S3/Pexels/upload URLs); revisit with the M-017 imagery provider.

**Known gaps / follow-ups**

- The only public route (`/s/[slug]`) renders the home page; per-page public
  routes and real nav paths land in **M-023**. Real customer content is wired
  from `Site.published.content` in M-023 as well (currently default content).
- `resolveLocalized` + `uiCopy` are local shims → **M-018** (shared i18n).
- Permanent unit tests (unknown-section skip, empty-section omission, image
  fallback) land under the M-025 Vitest harness; the 23 runtime checks above
  are interim evidence.

**Consumed by (next):** M-015, M-016, M-017, M-018, M-023.
