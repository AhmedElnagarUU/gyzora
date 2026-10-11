# MILESTONE-018 — next-intl Wiring, Locale Direction & Fallback

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-018 |
| Epic | EPIC-007 — Localization (Arabic / English) |
| Title | next-intl Wiring, Locale Direction & Fallback |
| Status | Not Started |
| Owner | — |
| Depends on | M-014, M-015, M-016 |
| Blocks | M-019, M-020, M-023 |
| PRD refs | FR-10, FR-11, PA-07 |
| Decisions | DEC-005 |
| Estimated size | L |

## 2. Objective

Wire next-intl into the app (provider, locale resolution, `resolveLocalized`
fallback) and make `<html>` `lang`/`dir` follow the resolved locale, without
introducing a `[locale]` URL segment.

## 3. Background & rationale

D-05: next-intl is installed but unused; `app/layout.tsx` hardcodes
`lang="en" dir="ltr"`. FR-10 requires correct direction and explicit language
modeling. DEC-005 fixes the approach (cookie + `?lang`, no prefix).

## 4. Scope (in scope)

- `NextIntlClientProvider` in the root layout with server-resolved locale +
  messages.
- Locale resolution: dashboard from `locale` cookie (default `en`); public from
  `Site.defaultLocale` / `?lang` (wired fully in M-020).
- `resolveLocalized(value, locale)` in `shared/i18n` (`ar`→`en`→omit).
- `<html lang dir>` driven by locale.
- Root-level language switch that persists the cookie.

## 5. Out of scope

- Translating all dashboard copy (M-019); public page switching/`hreflang`
  (M-020); SEO metadata (M-024).

## 6. Dependencies & preconditions

- M-014/015/016 (content/components to localize).
- **OD-2 resolved** (default DEC-005). If unresolved, proceed with DEC-005 and
  record the assumption.

## 7. Deliverables

- Change: `app/layout.tsx` — provider + dynamic `lang`/`dir`.
- Add: `shared/i18n/index.ts` — `resolveLocalized`, `getLocaleFromCookie`,
  direction helper.
- Change: `i18n/config.ts` / `i18n/routing.ts` — align with DEC-005 (no prefix).
- Change: `i18n/messages/{en,ar}.json` — ensure key parity scaffolding.
- Add: `shared/i18n/LanguageSwitcher.tsx` (cookie-based).

## 8. Tasks

- **T01 — Provider**
  - Work: server-resolve locale; mount `NextIntlClientProvider`.
  - Done when: `useTranslations`/`getTranslations` work in the app.
- **T02 — Fallback helper**
  - Work: implement and export `resolveLocalized`.
  - Done when: `ar`→`en`→omit unit-tested.
- **T03 — Direction**
  - Work: set `lang`/`dir` on `<html>` from the resolved locale.
  - Done when: `ar` yields `dir="rtl"`.
- **T04 — Switcher**
  - Work: switch locale via cookie; refresh without losing state.
  - Done when: switching preserves dashboard form state.

## 9. Interfaces & contracts touched

```ts
// shared/i18n/index.ts
export type Locale = 'en' | 'ar';
export function resolveLocalized(v: LocalizedText | undefined, locale: Locale): string;
export function dirFor(locale: Locale): 'ltr' | 'rtl';
export const LOCALE_COOKIE = 'locale';
```

## 10. Data model impact

- None.

## 11. API impact

- None (locale is presentational). Error codes remain stable for client mapping.

## 12. UI/UX impact

- Language switcher in the header; direction-aware layout; RTL verified.

## 13. Localization impact

- This milestone establishes the localization substrate; M-019/M-020 consume it.

## 14. Security & tenancy

- Locale is not an authorization input; ignored for ownership decisions.

## 15. Testing & verification

- Unit: `resolveLocalized` fallback cases; `dirFor`.
- Build: no `[locale]` route introduced; existing routes unchanged.
- `typecheck`, `lint`, `build` pass.

## 16. Acceptance criteria

- **AC-01** — next-intl provider is mounted and translations resolve.
- **AC-02** — `resolveLocalized` implements `ar`→`en`→omit and is tested.
- **AC-03** — `<html lang dir>` matches the locale (`ar` ⇒ `rtl`).
- **AC-04** — Language switching persists via cookie and preserves state.
- **AC-05** — No `[locale]` URL segment is introduced.
- **AC-06** — `typecheck`/`lint`/`build` pass.

## 17. Handoff & risks

- OD-2 unresolved ⇒ record the DEC-005 assumption and flag for confirmation.
- M-019/M-020 depend on `resolveLocalized` and the provider.
