# MILESTONE-024 — Public SEO Metadata & Tracking Scripts

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-024 |
| Epic | EPIC-008 — Publishing & Public Website |
| Title | Public SEO Metadata & Tracking Scripts |
| Status | Not Started |
| Owner | — |
| Depends on | M-020, M-023 |
| Blocks | M-028 |
| PRD refs | FR-11, FR-14, FR-10 |
| Decisions | DEC-004, DEC-005, DEC-009 |
| Estimated size | M |

## 2. Objective

Give public sites proper SEO metadata (title, description, OG, canonical,
`hreflang`) and render the tenant's configured tracking scripts.

## 3. Background & rationale

D-10: `TrackingScripts` exists but is never rendered. FR-11 requires correct
public presentation; FR-14 requires a complete experience. `hreflang` supports
the bilingual requirement (M-020). Tracking is a retained extra (DEC-009) that
must actually function since the UI exists.

## 4. Scope (in scope)

- `generateMetadata` for `/s/[slug]/*`: title/description from snapshot content,
  canonical, OG image (cover/bundled), `hreflang` alternates for `en`/`ar` +
  `x-default`.
- Render `TrackingScripts` with the tenant's enabled trackers on public pages.
- `robots`: index public pages; `noindex` preview.
- Correct `lang`/`dir` already from M-020.

## 5. Out of scope

- Tracking configuration UI (existing feature); analytics dashboards (DEC-009);
  custom domains.

## 6. Dependencies & preconditions

- M-020 (locale), M-023 (public surface). Tracking config exists already.

## 7. Deliverables

- Change: `app/s/[slug]/page.tsx` (+ subpages) — `generateMetadata`, importance
  of `TrackingScripts`.
- Add: `features/sites/metadata.ts` — build metadata from snapshot + locale.
- Change: `features/tracking/components/TrackingScripts.tsx` — consume the
  tenant's enabled trackers, render on public pages.

## 8. Tasks

- **T01 — Metadata**
  - Work: derive title/description from snapshot (company + locale), OG image,
    canonical, `hreflang`.
  - Done when: metadata reflects the published content.
- **T02 — Verification tokens (if any)**
  - Work: include configured verification/meta tags if the tracking config
    provides them.
  - Done when: tags render when configured.
- **T03 — Tracking scripts**
  - Work: render enabled trackers on public pages only.
  - Done when: configured pixels load; disabled ones don't.
- **T04 — Robots/canonical**
  - Work: index public; `noindex` preview (M-022).
  - Done when: correct robots behavior.

## 9. Interfaces & contracts touched

```ts
// features/sites/metadata.ts
buildSiteMetadata(site, snapshot, locale, projects): Metadata;
```

## 10. Data model impact

- Reads `Site.published`, `Project.seoMetadata`, `TrackingConfig`.

## 11. API impact

- None (server metadata).

## 12. UI/UX impact

- None visual; improves sharing/SEO.

## 13. Localization impact

- Metadata localized; `hreflang` for both locales.

## 14. Security & tenancy

- Only the resolved tenant's tracking config is rendered; scripts are the
  customer's own (documented risk: script injection is inherent to the feature).

## 15. Testing & verification

- Integration: metadata includes locale-appropriate title/description + hreflang.
- Integration: enabled tracker renders; disabled does not.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Public pages emit localized title/description/OG/canonical.
- **AC-02** — `hreflang` alternates for `en`/`ar` + `x-default` are present.
- **AC-03** — Configured tracking scripts render on public pages only.
- **AC-04** — Preview remains `noindex`.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- OD-4 (deploy/CDN) affects canonical/OG host; make it env-driven.
- Tracking scripts are user-supplied; keep them isolated to public routes.
