# EPIC-006 — Template System & Quality

## 1. Summary

Turn the two shallow, placeholder-rendering templates into rich, coherent,
reusable company-profile experiences that share one section contract and one
renderer, with category-appropriate imagery and optional Pexels support.

## 2. Motivation

The current templates are image-slot lists with hardcoded "Property Name" blocks
and a no-op save (D-04, D-11). FR-04/FR-05 require six complete pages rendered
from real structured content. This epic defines the content contract the rest of
the product depends on.

## 3. Scope

- In scope: `TemplateDefinition` content schema + section contract + bilingual
  default content; one `TemplateRenderer` + section component library; the
  `real-estate` and `construction` templates; curated fallback imagery + optional
  server-only Pexels provider.
- Out of scope: customer editors (EPIC-004/005 write the content), publish
  (EPIC-008), localization wiring (EPIC-007).

## 4. Related requirements

| PRD | Requirement |
|---|---|
| FR-04 | Website templates |
| FR-05 | Required pages and sections |
| FR-08 | Image management and Pexels |
| FR-14 | UX and visual quality |
| PA-06 | Template quality |

## 5. Related decisions

- DEC-002 — immutable template definitions; one renderer; shared data contract.
- DEC-006 — pages, sample content flag, bundled imagery, optional Pexels,
  `lucide-react` only.

## 6. Milestones

| ID | Title | Depends on | Status |
|---|---|---|---|
| MILESTONE-013 | Template Content Schema, Section Contract & Default Content | M-001, M-002 | **Done** (2026-10-11) |
| MILESTONE-014 | Shared Renderer & Section Library | M-013 | **Done** (2026-10-12) |
| MILESTONE-015 | Real Estate Template | M-013, M-014 | **Done** (2026-10-12) |
| MILESTONE-016 | Construction Template | M-013, M-014 | **Done** (2026-10-12) |
| MILESTONE-017 | Template Imagery & Optional Pexels | M-013, M-014, M-015, M-016 | **Done** (2026-10-12) |

## 7. Dependencies

- Requires: EPIC-001 (stable env/types); content shape (M-013) is early because
  EPIC-002 persists it.
- Unblocks: EPIC-007 (localized rendering), EPIC-008 (public render),
  M-023, M-027.

## 8. Definition of Done (epic)

- [x] One `SiteContent` shape and one section contract used by both templates. *(M-013)*
- [x] A single `TemplateRenderer` renders both templates; unknown sections skip
      safely; missing content degrades gracefully (no placeholder text). *(M-014)*
- [x] *Real Estate* renders Home/About/Services/Projects/Project Details/Contact
      *(M-015 — all six pages verified via the shared renderer; 8 sections on
      Home incl. `process`).*
- [x] *Construction* renders Home/About/Services/Projects/Project Details/Contact
      *(M-016 — all six pages verified via the shared renderer; process leads
      the capabilities block on Home; industrial identity).*
      as complete, responsive experiences.
- [x] Imagery uses bundled fallbacks; Pexels is optional and never a dependency.
      *(M-017 — 13 bundled license-free photos under `public/templates/`,
      server-only Pexels provider returning `[]` without a key, `/api/images/search`
      endpoint.)*
- [ ] `lucide-react` icons only; `next/image` with sane fallbacks.
- [ ] `typecheck`, `lint`, `build` pass; template quality covered by tests.

## 9. Risks & open decisions

- OD-3 (Pexels key/terms) — provider optional; bundled defaults cover it.
- Default content must avoid fabricated claims (FR-05); flagged as sample.
- Section contract additions later require a schema/migration note.

## 10. Handoff notes

- Contracts frozen: `TemplateDefinition`, `SiteContent`, `LocalizedText`,
  `ImageRef`, `SectionType`, `TemplateRenderer` props.
- EPIC-004 editors and EPIC-008 public render both consume these contracts.
