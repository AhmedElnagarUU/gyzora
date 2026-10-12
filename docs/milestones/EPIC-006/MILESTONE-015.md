# MILESTONE-015 — Real Estate Template

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-015 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Real Estate Template |
| Status | Done |
| Owner | Lead Engineering Agent |
| Depends on | M-013, M-014 |
| Blocks | M-017, M-018, M-023 |
| PRD refs | FR-04, FR-05, FR-08, PA-06 |
| Decisions | DEC-002, DEC-006 |
| Estimated size | L |

## 2. Objective

Deliver the `real-estate` template as a premium, property-forward company profile
using the shared section contract and default content, coherent in EN and AR and
responsive.

## 3. Background & rationale

FR-04 requires improving the existing Real Estate template rather than replacing
it. It must feel complete and distinctive while sharing the data contract.

## 4. Scope (in scope)

- Definition composition: Home (hero, intro, featured listings/projects,
  services, features, process, cta, contact), About, Services, Projects,
  Project Details, Contact.
- Real-estate-specific default content (generic, non-fabricated) and theme
  tokens (premium palette, large imagery, spacious layout).
- Curated bundled fallback imagery references (files added in M-017).
- Responsive + RTL-safe layout.

## 5. Out of scope

- Renderer internals (M-014); imagery provider/pipeline (M-017); other template
  (M-016).

## 6. Dependencies & preconditions

- M-013 (contract/defaults), M-014 (renderer/sections).

## 7. Deliverables

- Change: `features/templates/definitions/real-estate/definition.ts`.
- Change: `features/templates/definitions/real-estate/theme.ts` (or shared
  `theme.ts` entry).
- Add: default content overrides specific to real estate (within M-013 shape).

## 8. Tasks

- **T01 — Composition** ✅
  - Work: define page→section composition for all six pages.
  - Done when: all six pages render with real sections.
  - Result: all six pages composed (Home, About, Services, Projects, Project
    Details, Contact). Home now renders **8 sections** incl. `process`
    (hero, intro, services, features, featured-projects, **process**, cta,
    contact) — `process` was added to the M-013 composition per this
    milestone's scope. Verified at runtime: all declared sections render in
    order through `TemplateRenderer`; empty `contact` data omits the contact
    section (customer data, M-013 rule); nav lists the five real pages and
    excludes the `/projects/[slug]` route.
- **T02 — Identity/theme** ✅
  - Work: premium palette/typography/spacing tokens; large hero treatment.
  - Done when: visually distinct from construction template.
  - Result: real-estate now uses a **premium light palette — deep teal
    primary `#0f766e`, warm gold accent `#d97706`, warm stone neutrals, and
    an elegant serif heading stack (`Cormorant Garamond, Georgia, serif`)**
    — clearly distinct from construction's dark blue (`#3b82f6`).
    `themeCssVars` applies `--tp-*` tokens (verified `#0f766e` + Cormorant in
    output; old `#2563eb`/Inter-heading gone). Hero with no image renders a
    clean typographic panel in the new tokens (imagery files land M-017).
- **T03 — Default content** ✅
  - Work: category-appropriate service/feature/process defaults, flagged sample.
  - Done when: no empty sections, no fabricated facts.
  - Result: the M-013 default content already delivers real-estate-specific,
    generic, bilingual defaults (residential sales / rentals / commercial /
    valuation; curated listings, local knowledge, clear guidance,
    post-choice support; 4-step process) — `isSampleContent: true`, no
    fabricated counts/achievements, `contact`/`images` intentionally empty
    (customer data). Verified: no rendered section is empty and no
    placeholder/fabricated copy appears across the six pages.
- **T04 — Responsive/RTL** ✅
  - Work: verify mobile/tablet/desktop and `dir="rtl"`.
  - Done when: layout correct in both directions.
  - Result: sections are the shared M-014 library (responsive Tailwind
    breakpoints + logical layout, no inline LTR styling). Runtime check:
    AR renders `dir="rtl"`/`lang="ar"` with Arabic copy across sections;
    layout primitives identical in both locales. (Full visual browser pass is
    out of scope of npm checks; noted in handoff.)

## 9. Interfaces & contracts touched

- `TemplateDefinition` for id `real-estate`; consumes `TemplateRenderer`.

## 10. Data model impact

- None; provides `defaultContent` cloned by M-008.

## 11. API impact

- None.

## 12. UI/UX impact

- Premium, image-forward layout; consistent iconography; clear CTA; accessible.

## 13. Localization impact

- Default content in EN + AR; RTL layout verified.

## 14. Security & tenancy

- Pure definition; no customer data.

## 15. Testing & verification

- Render test: all six pages render without placeholder strings.
- Visual check EN + AR, mobile + desktop.
- `typecheck`, `lint`, `build` pass.

| Item | Result |
|---|---|
| `npm run typecheck` | **Pass**, exit 0 |
| `npm run lint` | **0 errors**, 28 warnings (all pre-existing) |
| `npm run build` | **Pass**, exit 0 — 31 routes |
| Runtime (dev, 2026-10-12) | Temporary `/m15-check` server page → **40/40 checks true** |

Verified behaviors (2026-10-12): Home renders all 8 declared sections in
composition order with `process` after `featured-projects`; empty `contact`
data omits the contact section; the new palette applies (`--tp-primary
#0f766e`, `--tp-font-heading Cormorant Garamond, Georgia, serif`) and the old
blue (`#2563eb`) is gone; no `dark` mode class; process renders its 4 numbered
steps; nav lists Home/About/Services/Projects/Contact and excludes the
`[slug]` route; About, Services, Projects, Project Details, and Contact pages
each render their sections with real content (projects grid shows both sample
projects; detail shows only the active slug's project); AR renders
`dir="rtl"`/`lang="ar"` with Arabic process copy and nav; no placeholder
strings (`Property Name`, `lorem`, `coming soon`, …) anywhere.

> Note: Next 16 rejects `react-dom/server` inside `app/` routes, so the runtime
> verification used a temporary server-component page (same RSC path as
> `/s/[slug]`). The page and temp artifacts were removed after verification.

## 16. Acceptance criteria

| AC | Status | Evidence |
|---|---|---|
| AC-01 | **Pass** | All six pages render via `TemplateRenderer` with real sections; home runs 8 sections incl. `process`; `m15-*` page checks true for every page |
| AC-02 | **Pass** | Premium light identity (teal `#0f766e`/gold `#d97706`/stone + Cormorant serif) renders in output; distinct from construction's dark blue; old `#2563eb` absent |
| AC-03 | **Pass** | Defaults are generic, category-appropriate, bilingual, `isSampleContent: true`; no empty rendered sections, no fabricated facts/counts |
| AC-04 | **Pass** | AR renders `dir="rtl"` + `lang="ar"` with Arabic copy; shared responsive section primitives used in both directions |
| AC-05 | **Pass** | `typecheck` pass; `lint` 0 errors/28 warnings (pre-existing); `build` pass (31 routes) |

## 17. Handoff & risks

- Bundled imagery files land in M-017; reference them by slot here.
- Do not invent property counts or achievements (FR-05).

### Handoff record

| Field | Value |
|---|---|
| Milestone | MILESTONE-015 — Real Estate Template |
| Owner | Lead Engineering Agent |
| Date | 2026-10-12 |
| Status | **Done** |

**Files changed**

| Path | Change | Why |
|---|---|---|
| `features/templates/definitions/real-estate/definition.ts` | Theme + composition | Premium light identity (teal/gold/stone + serif headings) distinct from construction; `process` added to Home (8 sections) |

**Deviations & decisions**

- **Imagery references deferred to M-017.** §7 asked for "curated bundled
  fallback imagery references (files added in M-017)". Adding `images` refs
  now would point at files that do not exist yet and render broken-image
  fallback boxes on the public default page; instead the hero renders a clean
  typographic panel until M-017 ships both files and refs together. `imageSlots`
  (hero, hero-mobile, gallery, logo, favicon) are already defined.
- Default content (T03) was already delivered by M-013's contract work;
  M-015 verified it satisfies this milestone's criteria (no empty rendered
  sections, no fabricated facts, `isSampleContent: true`).
- `contact: {}` stays empty — phone/email/address are customer data; an
  invented sample number/address would be fabrication. Home and Contact pages
  omit the contact section and rely on the CTA until a tenant supplies details
  (wired in M-023).
- `--tp-accent` (gold) is applied as a token but no section uses it yet;
  candidate for CTA/highlight styling in M-016/M-017 if it earns its place.
- Full visual responsive pass (mobile/tablet/desktop in a real browser) needs
  a browser harness; the shared section library's responsive primitives and
  the RTL runtime check are the interim evidence (M-025/M-027 add proper tests).

**Consumed by (next):** M-016 (construction — same renderer, own identity),
M-017 (imagery), M-018, M-023.
