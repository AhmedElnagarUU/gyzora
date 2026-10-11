# MILESTONE-013 — Template Content Schema, Section Contract & Default Content

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-013 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Template Content Schema, Section Contract & Default Content |
| Status | Not Started |
| Owner | — |
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

## 16. Acceptance criteria

- **AC-01** — A single `SiteContent` contract is defined and used by both
  templates.
- **AC-02** — Section types + schemas are defined; unknown types are skippable.
- **AC-03** — Both templates declare Home/About/Services/Projects/Project
  Details/Contact.
- **AC-04** — Default content is bilingual, generic, and flagged sample.
- **AC-05** — `cloneTemplateContent` deep-copies (verified by test).
- **AC-06** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- This contract is consumed by M-004, M-008, M-014, and EPIC-004 editors; changes
  require coordinated updates.
- Avoid fabricated claims in defaults (FR-05).
- *M-003 lists M-013 as a dependency only for shared type layout; ownership work
  does not otherwise need the content shape.
