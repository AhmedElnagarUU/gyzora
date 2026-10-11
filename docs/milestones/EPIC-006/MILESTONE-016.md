# MILESTONE-016 — Construction Template

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-016 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Construction Template |
| Status | Not Started |
| Owner | — |
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

- **T01 — Composition**
  - Work: six pages with process/capabilities emphasis.
  - Done when: all six pages render.
- **T02 — Identity/theme**
  - Work: industrial palette/typography/spacing.
  - Done when: visually distinct from real estate.
- **T03 — Default content**
  - Work: generic services/process/features; flagged sample; no fabricated
    certifications/stats.
  - Done when: no empty sections, no false claims.
- **T04 — Responsive/RTL**
  - Work: verify both directions and breakpoints.
  - Done when: layout correct.

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

## 16. Acceptance criteria

- **AC-01** — All six pages render as a complete experience.
- **AC-02** — Template is visually distinct from real estate.
- **AC-03** — Default content is generic; no fabricated certifications/stats.
- **AC-04** — Responsive and RTL-correct.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Stats sections appear only when real data exists (DEC-006).
- Bundled imagery added in M-017.
