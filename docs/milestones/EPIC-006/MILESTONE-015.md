# MILESTONE-015 — Real Estate Template

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-015 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Real Estate Template |
| Status | Not Started |
| Owner | — |
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

- **T01 — Composition**
  - Work: define page→section composition for all six pages.
  - Done when: all six pages render with real sections.
- **T02 — Identity/theme**
  - Work: premium palette/typography/spacing tokens; large hero treatment.
  - Done when: visually distinct from construction template.
- **T03 — Default content**
  - Work: category-appropriate service/feature/process defaults, flagged sample.
  - Done when: no empty sections, no fabricated facts.
- **T04 — Responsive/RTL**
  - Work: verify mobile/tablet/desktop and `dir="rtl"`.
  - Done when: layout correct in both directions.

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

## 16. Acceptance criteria

- **AC-01** — All six pages render as a complete experience.
- **AC-02** — Template is visually distinct and coherent.
- **AC-03** — Default content is generic and flagged sample.
- **AC-04** — Responsive and RTL-correct.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Bundled imagery files land in M-017; reference them by slot here.
- Do not invent property counts or achievements (FR-05).
