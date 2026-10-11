# MILESTONE-020 — Public Site Localization & Language Switching

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-020 |
| Epic | EPIC-007 — Localization (Arabic / English) |
| Title | Public Site Localization & Language Switching |
| Status | Not Started |
| Owner | — |
| Depends on | M-018, M-023 |
| Blocks | M-024, M-027 |
| PRD refs | FR-10, FR-11, PA-07 |
| Decisions | DEC-005 |
| Estimated size | M |

## 2. Objective

Make published websites render localized customer content with correct direction
and a language switch (`?lang=ar|en`) that preserves the site and route.

## 3. Background & rationale

FR-10/FR-11 require the public site to support both languages with correct
direction and switching that preserves context. The public renderer (M-023)
creates the surface; this milestone localizes it.

## 4. Scope (in scope)

- Resolve public locale from `?lang` else `Site.defaultLocale`.
- Render localized content via `resolveLocalized`; set `lang`/`dir` on the public
  wrapper.
- Language toggle on the public site (same slug, only `?lang` changes).
- Graceful 404 regardless of locale for missing/unpublished sites.

## 5. Out of scope

- SEO metadata/hreflang (M-024); dashboard localization (M-019); template design
  (M-014/015/016).

## 6. Dependencies & preconditions

- M-018 (locale substrate), M-023 (public render surface).

## 7. Deliverables

- Change: `app/s/[slug]/page.tsx` — locale resolution + wrapper `lang`/`dir`.
- Add: `features/sites/components/PublicLanguageSwitcher.tsx`.
- Change: template components to consume resolved locale (via M-014 props).

## 8. Tasks

- **T01 — Locale resolution**
  - Work: read/validate `?lang`; else `Site.defaultLocale`; else `en`.
  - Done when: unknown `?lang` falls back safely.
- **T02 — Direction wrapper**
  - Work: set `lang`/`dir` for the public site subtree.
  - Done when: `ar` ⇒ `dir="rtl"`.
- **T03 — Language toggle**
  - Work: switch `?lang` preserving slug/route.
  - Done when: switch keeps the same site and page.
- **T04 — Fallback + 404**
  - Work: localized content fallback; unpublished/missing ⇒ 404 in any locale.
  - Done when: no crash, no leakage.

## 9. Interfaces & contracts touched

```ts
// features/sites/public-service.ts (or page)
resolvePublicLocale(searchParams, site): 'en' | 'ar';
```

## 10. Data model impact

- None.

## 11. API impact

- None (server-rendered). Caching must vary by locale appropriately.

## 12. UI/UX impact

- Public language toggle; RTL-correct public pages; readable typography per
  direction.

## 13. Localization impact

- Customer content rendered per locale with `ar→en→omit`; UI labels localized.

## 14. Security & tenancy

- Locale cannot change which site is resolved; slug ownership/status checks
  unchanged.

## 15. Testing & verification

- Integration: `?lang=ar` renders Arabic content + `dir="rtl"`; `en` renders LTR.
- Integration: unpublished site ⇒ 404 in both locales.
- E2E (M-027): toggle language on a published site.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — Public locale resolves from `?lang`/`defaultLocale` safely.
- **AC-02** — `lang`/`dir` correct per locale.
- **AC-03** — Language switch preserves site and route.
- **AC-04** — Missing/unpublished sites 404 in any locale.
- **AC-05** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- Cache variance by locale must be correct (M-024/OD-4).
- Avoid duplicating `resolveLocalized`; use the shared helper (M-018).
