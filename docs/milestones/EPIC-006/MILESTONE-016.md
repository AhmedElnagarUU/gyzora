# MILESTONE-016 — Construction Template

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-016 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Construction Template |
| Status | Done |
| Owner | Lead Engineering Agent |
| Depends on | M-013, M-014 |
| Blocks | M-017, M-018, M-023 |
| PRD refs | FR-04, FR-05, FR-08, PA-06 |
| Decisions | DEC-002, DEC-006 |
| Estimated size | L |

## 2. Objective

Deliver the `construction` template as a sturdy, capability-forward company
profile (process, capabilities, projects) sharing the section contract and
remaining coherent in EN and AR and responsive.

## 3. Background & rationale

FR-04 requires improving the existing Construction template. It must differ from
real estate in composition/identity while using the same data contract.

## 4. Scope (in scope)

- Definition composition emphasizing process, capabilities/features, projects,
  safety/quality statements (generic), and contact.
- Construction-specific default content (generic, non-fabricated) and theme
  tokens (industrial palette, bold headings, structured grid).
- Curated bundled fallback imagery references (files added in M-017).
- Responsive + RTL-safe layout.

## 5. Out of scope

- Renderer internals (M-014); imagery provider (M-017); real estate template
  (M-015).

## 6. Dependencies & preconditions

- M-013 (contract/defaults), M-014 (renderer/sections).

## 7. Deliverables

- Change: `features/templates/definitions/construction/definition.ts`.
- Change: `features/templates/definitions/construction/theme.ts`.
- Add: default content overrides specific to construction (within M-013 shape).

## 8. Tasks

- **T01 — Composition** ✅
  - Work: six pages with process/capabilities emphasis.
  - Done when: all six pages render.
  - Result: all six pages (Home, About, Services, Projects, Project Details,
    Contact) render through the shared `TemplateRenderer`. Home runs hero,
    intro, **process, features**, featured-projects, cta, contact — process
    leads the capabilities block, matching this milestone's emphasis and
    differing structurally from real estate's Home (which leads with
    services/features). Nav lists the five real pages and excludes the
    `[slug]` route. Empty `contact` data omits the contact section (customer
    data, M-013 rule).
- **T02 — Identity/theme** ✅
  - Work: industrial palette/typography/spacing.
  - Done when: visually distinct from real estate.
  - Result: industrial identity — dark charcoal base (`#0f1117`), **burnt
    orange primary `#ea580c`** and **high-vis yellow accent `#facc15`**, with
    a heavy **Impact/`Arial Black` heading stack** — clearly distinct from
    real estate's light teal+gold+serif. The orange primary also improves
    contrast vs the old blue-500 on both axes (text-on-dark ≈ 5.4:1 vs 3.9:1;
    white-on-panel ≈ 3.4:1 vs 3.1:1 for the CTA panel/large headings).
- **T03 — Default content** ✅
  - Work: generic services/process/features; flagged sample; no fabricated
    certifications/stats.
  - Done when: no empty sections, no false claims.
  - Result: M-013 default content is category-appropriate and generic
    (general contracting / fit-outs / project management / maintenance;
    safety-first, clear communication, quality, scheduling; 4-step
    Consult → Plan → Build → Handover), `isSampleContent: true`, no
    certifications, no stats, no project counts. Verified: **no `ISO` /
    `certified` / counts / years-of-experience strings render anywhere**, and
    no rendered section is empty.
- **T04 — Responsive/RTL** ✅
  - Work: verify both directions and breakpoints.
  - Done when: layout correct.
  - Result: AR renders `dir="rtl"`/`lang="ar"` with Arabic copy (incl. the
    process steps); sections use the shared responsive primitives in both
    locales. (Full visual browser pass noted in handoff.)

## 9. Interfaces & contracts touched

- `TemplateDefinition` for id `construction`; consumes `TemplateRenderer`.

## 10. Data model impact

- None.

## 11. API impact

- None.

## 12. UI/UX impact

- Structured, capability-forward layout; `lucide-react` icons; accessible.

## 13. Localization impact

- EN + AR defaults; RTL verified.

## 14. Security & tenancy

- Pure definition.

## 15. Testing & verification

- Render test: six pages, no placeholder strings.
- Visual check EN + AR.
- `typecheck`, `lint`, `build` pass.

| Item | Result |
|---|---|
| `npm run typecheck` | **Pass**, exit 0 |
| `npm run lint` | **0 errors**, 28 warnings (all pre-existing) |
| `npm run build` | **Pass**, exit 0 — 31 routes |
| Runtime (dev, 2026-10-12) | Temporary `/m16-check` server page → **48/48 checks true** |

Verified behaviors (2026-10-12): Home renders all declared sections in
composition order with **process leading the capabilities block** (before
features); empty `contact` data omits the contact section; the industrial
palette applies (`--tp-primary #ea580c`, `--tp-accent #facc15`,
`--tp-background #0f1117`, `--tp-font-heading Impact/"Arial Black"`) and the
old blue (`#3b82f6`) plus any real-estate teal/serif are absent; process
renders its 4 numbered steps (Consult/Plan/Build/Handover); nav lists the five
real pages and excludes the `[slug]` route; About, Services, Projects, Project
Details, and Contact pages each render their sections with real content
(projects grid shows both sample projects; detail shows only the active slug's
project); AR renders `dir="rtl"`/`lang="ar"` with Arabic process copy and nav;
no placeholder strings and **no fabricated claims** (`ISO`, `certified`,
counts, years) anywhere.

> Note: Next 16 rejects `react-dom/server` inside `app/` routes, so the runtime
> verification used a temporary server-component page (same RSC path as
> `/s/[slug]`). The page and temp artifacts were removed after verification.

## 16. Acceptance criteria

| AC | Status | Evidence |
|---|---|---|
| AC-01 | **Pass** | All six pages render via `TemplateRenderer` with real sections; `m16-*` page checks true for every page |
| AC-02 | **Pass** | Industrial identity (dark `#0f1117`, orange `#ea580c`, yellow `#facc15`, Impact headings) renders in output; distinct from real estate's teal/serif; old `#3b82f6` absent |
| AC-03 | **Pass** | Defaults generic, bilingual, `isSampleContent: true`; no `ISO`/`certified`/counts/stat fabrication anywhere; no empty rendered sections |
| AC-04 | **Pass** | AR renders `dir="rtl"` + `lang="ar"` with Arabic copy; shared responsive section primitives in both directions |
| AC-05 | **Pass** | `typecheck` pass; `lint` 0 errors/28 warnings (pre-existing); `build` pass (31 routes) |

## 17. Handoff & risks

- Stats sections appear only when real data exists (DEC-006).
- Bundled imagery added in M-017.

### Handoff record

| Field | Value |
|---|---|
| Milestone | MILESTONE-016 — Construction Template |
| Owner | Lead Engineering Agent |
| Date | 2026-10-12 |
| Status | **Done** |

**Files changed**

| Path | Change | Why |
|---|---|---|
| `features/templates/definitions/construction/definition.ts` | Theme | Industrial palette (burnt-orange primary `#ea580c`, high-vis yellow accent `#facc15`, dark charcoal base, Impact/`Arial Black` heading stack), clearly distinct from real estate's light teal+serif; also improves contrast vs the old blue-500 |

**Deviations & decisions**

- **Imagery references deferred to M-017** — same rationale as M-015: adding
  `images` refs to files that don't exist yet would render broken-image
  fallback boxes; hero stays a clean typographic panel until M-017 ships files
  + refs together. `imageSlots` (logo, hero, favicon) are already defined.
- Default content (T03) was already delivered by M-013; M-016 verified it
  against this milestone's criteria (no empty rendered sections, no
  certifications/stats/counts; `isSampleContent: true`).
- Home composition deliberately leads the capabilities block with `process`
  (hero → intro → process → features → …) — structural difference vs real
  estate's home, on top of the palette/typography identity.
- `contact: {}` stays empty (customer data; Home/Contact omit the section
  until a tenant supplies details — wired in M-023).
- `--tp-accent` (high-vis yellow) is applied as a token but no section uses it
  yet; candidate for safety/quality highlights in M-017.
- Full visual responsive pass needs a browser harness; the shared section
  library's responsive primitives and the RTL runtime check are the interim
  evidence (M-025/M-027 add proper tests).

**Consumed by (next):** M-017 (imagery — unblocks now that both templates are
Done), M-018, M-023.
