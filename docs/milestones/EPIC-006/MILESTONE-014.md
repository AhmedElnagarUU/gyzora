# MILESTONE-014 — Shared Renderer & Section Library

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-014 |
| Epic | EPIC-006 — Template System & Quality |
| Title | Shared Renderer & Section Library |
| Status | Not Started |
| Owner | — |
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

- Change: `features/templates/components/TemplateRenderer.tsx` — rewrite.
- Add: `features/templates/sections/*.tsx` (one per `SectionType`).
- Add: `features/templates/theme.ts` — theme token application.
- Add: `features/templates/components/ImageWithFallback.tsx`.

## 8. Tasks

- **T01 — Renderer skeleton**
  - Work: iterate `template.pages`, resolve sections, render in order, skip
    unknown.
  - Done when: an unknown section is skipped without error.
- **T02 — Core sections**
  - Work: hero, intro, services, features, featured-projects, cta, contact.
  - Done when: each renders real content and hides when empty.
- **T03 — Project sections**
  - Work: project-grid + project-detail from the `projects` argument.
  - Done when: projects render with cover/gallery and fallbacks.
- **T04 — Optional sections**
  - Work: stats (only real data), process, about-body.
  - Done when: absent when data missing.
- **T05 — Theme + images**
  - Work: apply theme tokens; `next/image` with error fallback + alt text.
  - Done when: theme visibly affects output; broken images degrade gracefully.

## 9. Interfaces & contracts touched

```ts
// features/templates/components/TemplateRenderer.tsx
type Props = {
  template: TemplateDefinition;
  content: SiteContent;
  projects: ProjectView[];
  locale: 'en'|'ar';
  theme: TemplateTheme;
};
```

## 10. Data model impact

- None (render-only).

## 11. API impact

- None.

## 12. UI/UX impact

- Responsive sections; loading/empty states; accessible headings/landmarks;
  consistent spacing/typography.

## 13. Localization impact

- Components resolve `LocalizedText` via `resolveLocalized(value, locale)` (M-018
  provides it; use a temporary local shim if needed, replaced in M-018).
- `dir`-aware layout (logical properties).

## 14. Security & tenancy

- Render-only; no DB access; receives only already-scoped data.

## 15. Testing & verification

- Unit: unknown section skipped; empty content omits sections; no placeholder
  strings in output.
- Unit: image error fallback renders.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — One renderer renders any template from `SiteContent` + projects.
- **AC-02** — All `SectionType`s have components; unknown types skip safely.
- **AC-03** — Empty optional content omits sections; no placeholder text appears.
- **AC-04** — Images use `next/image` with alt text and fall back gracefully.
- **AC-05** — Theme tokens visibly affect rendering.
- **AC-06** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- M-018 replaces the fallback shim with the shared `resolveLocalized`.
- Sections must not assume template-specific fields; both templates share them.
