# MILESTONE-013 — Template Content Schema, Section Contract & Default Content

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-013 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Template Content Schema, Section Contract & Default Content |
| Status | Done |
| Owner | Lead Engineering Agent |
| Depends on | M-001, M-002 |
| Blocks | M-003*, M-004, M-005, M-008, M-014, M-015, M-016 |
| PRD refs | FR-04, FR-05, FR-10, PA-06 |
| Decisions | DEC-002, DEC-005, DEC-006 |
| Estimated size | L |

## 2. Objective

Define the single template contract: `TemplateDefinition`, `SiteContent`,
`LocalizedText`, `ImageRef`, `SectionType`, page/section composition, and
bilingual default content — the shape every template, editor, and renderer uses.

## 3. Background & rationale

D-04: templates are shallow image-slot lists with no content schema, so FR-04/05
cannot be met. DEC-002 mandates one shared data contract. This milestone freezes
that contract; EPIC-002 persists it and EPIC-006 renders it.

## 4. Scope (in scope)

- `features/templates/types.ts`: full `TemplateDefinition`, `SiteContent`,
  `SectionType`, `ImageRef`, `TemplateTheme`.
- `features/templates/index.ts`: registry (`getTemplate`, `listTemplates`),
  template metadata.
- `cloneTemplateContent(template, companyInput)` helper.
- Zod `siteContentSchema` (shared with M-004) + section schemas.
- Bilingual default content for both templates (generic, non-fabricated).

## 5. Out of scope

- Rendering components (M-014); template styling/identity (M-015/016); imagery
  provider (M-017); editors (EPIC-004).

## 6. Dependencies & preconditions

- M-001 (types/conventions), M-002 (env; templates must not read env at module
  load in a way that breaks build).

## 7. Deliverables

- Change: `features/templates/types.ts` — full contract.
- Change: `features/templates/index.ts` — registry + metadata.
- Add: `features/templates/content.ts` — `cloneTemplateContent`,
  `defaultContent` per template.
- Add: `features/templates/schema.ts` — Zod content/section schemas.
- Add: `features/templates/definitions/{real-estate,construction}/definition.ts`
  — definition skeletons with pages/sections/defaults.

## 8. Tasks

- **T01 — Types**
  - Work: define `TemplateDefinition`, `SiteContent`, `LocalizedText`,
    `ImageRef`, `SectionType`, `TemplatePage`, `TemplateTheme`.
  - Done when: types compile and are exported.
- **T02 — Section schemas**
  - Work: Zod schema per section type + site content aggregate.
  - Done when: valid/invalid content discriminated correctly.
- **T03 — Default content**
  - Work: bilingual, generic, category-appropriate defaults per template; set
    `isSampleContent: true`.
  - Done when: a site created from defaults renders meaningful content.
- **T04 — Clone helper**
  - Work: `cloneTemplateContent` deep-copies and overlays company input.
  - Done when: mutating the result never affects the definition.
- **T05 — Registry**
  - Work: `getTemplate(id)`, `listTemplates()` with metadata for selection.
  - Done when: both templates are resolvable by id/slug.

## 9. Interfaces & contracts touched

See `project/TEMPLATE_SYSTEM.md` §1–3. Key types: `SiteContent`, `LocalizedText`,
`ImageRef`, `SectionType`, `TemplateDefinition`.

## 10. Data model impact

- Defines the shape persisted by M-004 (`Site.content`, `PublishedSnapshot`).

## 11. API impact

- None directly; shapes flow through `/api/sites` and `/api/projects`.

## 12. UI/UX impact

- None; enables renderer and editors.

## 13. Localization impact

- `LocalizedText` throughout; defaults include both `en` and `ar`.

## 14. Security & tenancy

- Templates hold no customer data and no secrets; definitions are pure data.

## 15. Testing & verification

- Unit: schema accepts valid content, rejects invalid; unknown section type
  handled; clone immutability.
- Unit: both templates provide all six pages.
- `typecheck`, `lint`, `build` pass.

### Task results (2026-10-11)

| Task | Result | Evidence |
|---|---|---|
| T01 — Types | **Done** | `features/templates/types.ts` rewritten: full contract (`TemplateDefinition`, `SiteContent`, `LocalizedText`, `ImageRef`, `SectionType`, `TemplatePage`, `TemplateTheme`, `Locale`, `TemplateCategory`); legacy `imageSlots`/`defaultTheme` retained so existing tooling keeps compiling |
| T02 — Section schemas | **Done** | `features/templates/schema.ts`: `localizedTextSchema`, `imageRefSchema`, `imageRefsSchema` (partial slot map), `siteContentSchema`, `SECTION_SCHEMAS` covering all 12 `SectionType`s |
| T03 — Default content | **Done** | `features/templates/content.ts`: `defaultRealEstateContent` + `defaultConstructionContent` — bilingual (`en`/`ar`) generic text, `isSampleContent: true`, no fabricated stats/claims |
| T04 — Clone helper | **Done** | `cloneTemplateContent(template, companyInput)` — `structuredClone` deep copy + localized overlay; runtime-verified immutability |
| T05 — Registry | **Done** | `features/templates/index.ts`: `TEMPLATES`, `getTemplate(id|slug)`, `listTemplates()`; definitions under `definitions/{real-estate,construction}/definition.ts` |

## 16. Acceptance criteria

- **AC-01** — A single `SiteContent` contract is defined and used by both
  templates.
- **AC-02** — Section types + schemas are defined; unknown types are skippable.
- **AC-03** — Both templates declare Home/About/Services/Projects/Project
  Details/Contact.
- **AC-04** — Default content is bilingual, generic, and flagged sample.
- **AC-05** — `cloneTemplateContent` deep-copies (verified by test).
- **AC-06** — `typecheck`/`lint`/`build` pass.

### Acceptance results (2026-10-11)

| AC | Result | Evidence |
|---|---|---|
| AC-01 | **Pass** | One `SiteContent` shape (`types.ts`) used by both definitions; runtime check confirms both share `SECTION_SCHEMAS` |
| AC-02 | **Pass** | 12 `SectionType`s; `SECTION_SCHEMAS` covers every type (runtime `section-schemas-complete` true); unknown-section skipping is M-014 |
| AC-03 | **Pass** | Both definitions declare `home/about/services/projects/project-detail/contact` (runtime `pages-real-estate`/`pages-construction` true) |
| AC-04 | **Pass** | Defaults bilingual `en`+`ar`; runtime `bilingual-*`/`sample-*`/`no-stats-*` true; generic wording, no fabricated numbers |
| AC-05 | **Pass** | `cloneTemplateContent` deep-clones via `structuredClone`; runtime `clone-source-immutable` + `clone-result-isolated` true after aggressive mutation |
| AC-06 | **Pass** | `typecheck` pass; `lint` 0 errors/30 warnings (pre-existing); `build` pass (31 routes) |

### Verification (commands actually run, 2026-10-11)

```
npm run typecheck   # pass, exit 0
npm run lint        # 0 errors, 30 warnings (pre-existing)
npm run build       # pass, exit 0 — 31 routes
Runtime check: temporary GET /api/m13-check route via `npm run dev`
  → 24/24 checks true; route removed after verification.
```

Verified behaviors: registry resolves both templates by `id` and `slug`,
returns `undefined` for unknown ids; both defaults pass `siteContentSchema`
while an empty `company.name` is rejected; a deeply mutated clone leaves the
template definition and the original clone untouched.

## 17. Handoff & risks

- This contract is consumed by M-004, M-008, M-014, and EPIC-004 editors; changes
  require coordinated updates.
- Avoid fabricated claims in defaults (FR-05).
- *M-003 lists M-013 as a dependency only for shared type layout; ownership work
  does not otherwise need the content shape.

### Handoff record

| Field | Value |
|---|---|
| Milestone | MILESTONE-013 — Template Content Schema, Section Contract & Default Content |
| Owner | Lead Engineering Agent |
| Date | 2026-10-11 |
| Status | **Done** |

**Files changed**

| Path | Change | Why |
|---|---|---|
| `features/templates/types.ts` | Rewritten | Full contract (`TemplateDefinition`, `SiteContent`, `LocalizedText`, `ImageRef`, `SectionType`, `TemplatePage`, `TemplateTheme`); kept `ImageSlotKey`/`ImageSlotDefinition`/`defaultTheme`/`imageSlots` for existing tooling |
| `features/templates/index.ts` | Rewritten | `TEMPLATES` registry + `getTemplate`/`listTemplates` + re-exports (types, schemas, content, themes) |
| `features/templates/content.ts` | **new** | Bilingual defaults for both templates + `cloneTemplateContent` |
| `features/templates/schema.ts` | **new** | `siteContentSchema` + per-section schemas (shared with M-004) |
| `features/templates/definitions/real-estate/definition.ts` | **new** | Full `real-estate` definition |
| `features/templates/definitions/construction/definition.ts` | **new** | Full `construction` definition |
| `app/s/[slug]/page.tsx` | Import fix | `TEMPLATES` imported from `@/features/templates` (registry) instead of the raw `types` module |

**Deviations & decisions**

- Removed the unused placeholder `SectionDefinition`/`sections[]` field; page
  composition is now `pages[].sections`. `imageSlots` retained (configure UI
  depends on it until EPIC-004).
- `TemplateTheme` carries explicit color/font tokens on each definition
  (self-contained immutable modules); `defaultTheme` kept as the legacy
  theme-id mirror used by the configure page.
- `images` slot schema is an explicit partial `z.object` — Zod 4's
  `z.record(z.enum(...), …)` required every declared key.
- Defaults contain **no** `stats` (would fabricate numbers) and use generic
  category-appropriate copy per DEC-006/FR-05.
- Intramodule imports inside `features/templates` use relative paths
  (permitted; lint-clean) to keep the modules self-contained.

**Known gaps / follow-ups**

- Renderer/section components, unknown-section skipping, and theme token
  application land in **M-014**. Editors and persistence consume this contract
  in M-004/EPIC-004.
- Permanent unit tests for schema/clone land under the M-025 Vitest harness;
  the 24 runtime checks above are interim evidence.
- `supportedLocales` fixed to `['en','ar']` (DEC-005).

**Consumed by (next):** M-003, M-004, M-005, M-008, M-014, M-015, M-016.
