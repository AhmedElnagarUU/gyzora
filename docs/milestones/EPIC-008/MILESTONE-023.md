# MILESTONE-023 — Public Website Rendering from Snapshot

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-023 |
| Epic | EPIC-008 — Publishing & Public Website |
| Title | Public Website Rendering from Snapshot |
| Status | Not Started |
| Owner | — |
| Depends on | M-004, M-014, M-015, M-016, M-018 |
| Blocks | M-020, M-021, M-024, M-027 |
| PRD refs | FR-11, FR-09, PA-06, PA-08 |
| Decisions | DEC-002, DEC-004, DEC-005 |
| Estimated size | L |

## 2. Objective

Render the public website at `/s/[slug]` exclusively from the published snapshot,
for published/active sites, using the correct template and locale, with graceful
handling of missing/unpublished sites.

## 3. Background & rationale

D-11: the public route renders placeholder blocks and derives imagery from the
first project. FR-11 requires resolving the correct site and rendering the
published template/content. DEC-004 forbids reading draft on the public route.

## 4. Scope (in scope)

- `findPublishedSiteBySlug` returning snapshot + template + theme + projects,
  gated by `status==='PUBLISHED'` and `Tenant.status==='ACTIVE'`.
- Render via `TemplateRenderer` from the snapshot (never draft).
- Multi-page public structure (Home/About/Services/Projects/Project Details/
  Contact) using the snapshot content.
- Graceful 404 for missing/unpublished/suspended.
- Correct caching/ISR headers.

## 5. Out of scope

- Locale switching UX (M-020, but locale is accepted here); SEO metadata (M-024);
  publish workflow (M-021).

## 6. Dependencies & preconditions

- M-004 (snapshot schema), M-014/015/016 (renderer/templates), M-018 (locale
  helper).

## 7. Deliverables

- Change: `app/s/[slug]/page.tsx` — render from snapshot; locale prop.
- Add: `app/s/[slug]/[page]/page.tsx` or section-based pages for
  about/services/projects/project-details/contact.
- Change: `features/sites/public-service.ts` — snapshot-based resolver.
- Add: `features/sites/components/PublicNotFound.tsx`.

## 8. Tasks

- **T01 — Resolver**
  - Work: resolve by slug from `published`; check status/tenant.
  - Done when: unpublished/suspended/missing ⇒ not found.
- **T02 — Snapshot render**
  - Work: render snapshot content/template/theme/projects.
  - Done when: public reflects the last publish only.
- **T03 — Pages**
  - Work: expose the six page types from snapshot data.
  - Done when: each page renders real content.
- **T04 — 404 + caching**
  - Work: graceful not-found; ISR/revalidate headers.
  - Done when: correct behavior and headers.

## 9. Interfaces & contracts touched

```ts
// features/sites/public-service.ts
getPublicSite(slug: string): Promise<{
  snapshot: PublishedSnapshot; theme: TemplateTheme; template: TemplateDefinition;
} | null>;
```

## 10. Data model impact

- Reads `Site.published`; no writes.

## 11. API impact

- None (server-rendered page).

## 12. UI/UX impact

- Complete public website; responsive; accessible; graceful not-found page.

## 13. Localization impact

- Accepts locale; renders localized snapshot content (`ar→en→omit`).

## 14. Security & tenancy

- Public route reads only published data; tenant isolation via slug resolution;
  no draft leakage; suspended tenants hidden.

## 15. Testing & verification

- Integration: published site renders snapshot; unpublished ⇒ 404; suspended ⇒
  404; draft edit not reflected.
- Render test: six pages render without placeholders.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Public renders only the published snapshot.
- **AC-02** — Draft edits never appear publicly until re-publish.
- **AC-03** — Six page types render with real content.
- **AC-04** — Missing/unpublished/suspended sites 404 gracefully.
- **AC-05** — No cross-tenant rendering.
- **AC-06** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Ensure snapshot projects are read from the snapshot, not the live collection.
- M-020 layers locale UX on this surface; M-024 adds SEO/tracking.
