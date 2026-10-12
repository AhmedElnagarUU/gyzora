# EPIC-007 — Localization (Arabic / English)

## 1. Summary

Wire the existing next-intl setup into the app so the dashboard and public
websites support English and Arabic with correct direction, localized customer
content, and language switching that preserves route context.

## 2. Motivation

next-intl is installed but unused (D-05): no provider, no middleware, no
`[locale]`, hardcoded `lang="en" dir="ltr"`, and all UI copy is hardcoded
English. FR-10/PA-07 require bilingual support throughout.

## 3. Scope

- In scope: next-intl provider + locale cookie, `resolveLocalized` fallback,
  dashboard localization + RTL, public site localization + `?lang` switching +
  `dir`/`lang`, catalog parity.
- Out of scope: locale-prefixed routing (OD-2, default no), auto-translation,
  Arabic-Indic numerals.

## 4. Related requirements

| PRD | Requirement |
|---|---|
| FR-10 | Arabic and English |
| FR-11 | Public website access (language switching) |
| FR-14 | UX and visual quality |
| PA-07 | Bilingual experience |

## 5. Related decisions

- DEC-005 — bilingual content, cookie + `?lang`, no `[locale]` prefix, logical
  CSS properties for RTL.

## 6. Milestones

| ID | Title | Depends on | Status |
|---|---|---|---|
| MILESTONE-018 | next-intl Wiring, Locale Direction & Fallback | M-014, M-015, M-016 | **Done** (2026-10-12) |
| MILESTONE-019 | Dashboard Localization & RTL | M-018 | Not Started |
| MILESTONE-020 | Public Site Localization & Language Switching | M-018, M-023 | Not Started |

## 7. Dependencies

- Requires: EPIC-006 (localized content to render).
- Unblocks: M-024 (hreflang/SEO), M-027 (E2E EN/AR).

## 8. Definition of Done (epic)

- [x] A single next-intl provider resolves locale from cookie (dashboard) and
      `Site.defaultLocale`/`?lang` (public).
      *(M-018 dashboard half: cookie-resolved provider + request config, no
      `[locale]` segment. Public half lands with M-020.)*
- [ ] `dir`/`lang` correct for `en`/`ar` on both surfaces.
- [ ] Customer content renders per locale with `ar→en→omit` fallback; switching
      language preserves content and route.
- [ ] No hardcoded user-visible English strings remain in localized surfaces.
- [ ] Catalog parity test passes (`en` keys ⊆ `ar`).
- [ ] RTL layout correct with logical properties.
- [ ] `typecheck`, `lint`, `build` pass; localization covered by tests.

## 9. Risks & open decisions

- OD-2 (locale routing) must be resolved before M-018; default DEC-005.
- RTL regressions are easy to miss; M-027 E2E must assert direction.

## 10. Handoff notes

- Contracts frozen: `Locale`, `resolveLocalized`, locale cookie name, `?lang`
  parameter, `<html>` direction handling.
- EPIC-008 emits `hreflang` alternates using the same locale resolution.
