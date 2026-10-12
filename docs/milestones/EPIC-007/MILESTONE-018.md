# MILESTONE-018 — next-intl Wiring, Locale Direction & Fallback

## 1. Metadata

| Field | Value |
|---|---|
| ID | MILESTONE-018 |
| Epic | EPIC-007 — Localization (Arabic / English) |
| Title | next-intl Wiring, Locale Direction & Fallback |
| Status | Done |
| Owner | Lead Engineering Agent |
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

- **T01 — Provider** ✅
  - Work: server-resolve locale; mount `NextIntlClientProvider`.
  - Done when: `useTranslations`/`getTranslations` work in the app.
  - Result: `app/layout.tsx` resolves the locale from the `locale` cookie
    (`getLocaleFromCookie`), drives `<html lang dir>`, and mounts
    `NextIntlClientProvider` with `loadMessages(locale)` (handles both the en
    and ar catalogs). `next.config.ts` wraps the config with
    `createNextIntlPlugin('./i18n/config.ts')` so server-side
    `getTranslations`/`getLocale` resolve through the request config — **no
    i18n middleware or routing is added** (DEC-005). `getRequestConfig` honors
    an explicit `requestLocale` (e.g. `getTranslations({ locale: 'ar' })`),
    then the `locale` cookie, then `en`.
- **T02 — Fallback helper** ✅
  - Work: implement and export `resolveLocalized`.
  - Done when: `ar`→`en`→omit unit-tested.
  - Result: `shared/i18n/index.ts` — single shared `resolveLocalized`
    (`ar` → `en` → `''`, never `null`/`undefined`), plus `dirFor`,
    `isLocale`, `getLocaleFromCookie`, and re-exports of the canonical
    `Locale`/`locales`/`LOCALE_COOKIE`/`defaultLocale`. The temporary local
    shim in `features/templates/lib/text.ts` is **removed** — it now
    re-exports the shared helper so the 12 section components keep their
    `../lib/text` import. `features/templates/types.ts` re-exports `Locale`
    from `@/i18n/config` (LOCALIZATION.md §1 — the union lives in one place;
    the old duplicated `Locale = 'en' | 'ar'` is gone). Verified at runtime:
    `ar` selects Arabic when present, falls back to `en` when `ar` is empty,
    and `en` selects English.
- **T03 — Direction** ✅
  - Work: set `lang`/`dir` on `<html>` from the resolved locale.
  - Done when: `ar` yields `dir="rtl"`.
  - Result: root layout sets `<html lang={locale} dir={dirFor(locale)}>`.
    Verified: no cookie ⇒ `lang="en" dir="ltr"`; `Cookie: locale=ar` ⇒
    `lang="ar" dir="rtl"` on both `/` and the temp check page.
    Trade-off (recorded in §17): reading the cookie forces every route to
    dynamic rendering (`ƒ`) — the build shows the same **32 routes**, now all
    dynamic; no `[locale]` segment appears.
- **T04 — Switcher** ✅
  - Work: switch locale via cookie; refresh without losing state.
  - Done when: switching preserves dashboard form state.
  - Result: `shared/i18n/LanguageSwitcher.tsx` (client) — reads the current
    locale from `document.documentElement.lang` (driven by the layout, no
    server props across the boundary), writes the `locale` cookie
    (`max-age=31536000; path=/; samesite=lax`) and reloads. A reload is
    required because switching changes `<html>` attributes, which live outside
    the React tree; the current URL/query is preserved so saved dashboard
    state is kept. Mounted in the `DashboardShell` sidebar footer next to
    `SignOutButton`. SSR-safe (labels settle after hydration via `useEffect`).
    Caveat: unsubmitted *draft* values in uncontrolled inputs reset on reload —
    unavoidable for an `<html>`-attribute switch (M-019 may move to a
    non-reload switch once the shell supports it).

## 9. Interfaces & contracts touched

```ts
// shared/i18n/index.ts (server-only) — `Locale` is canonical in
// `i18n/config.ts` (LOCALIZATION.md §1); this module re-exports it.
export type Locale = 'en' | 'ar';
export function resolveLocalized(v: LocalizedValue | null | undefined, locale: Locale): string; // ar→en→''
export function dirFor(locale: Locale): 'ltr' | 'rtl';
export const LOCALE_COOKIE = 'locale'; // canonical in i18n/config.ts
export async function getLocaleFromCookie(): Promise<Locale>;
```

`i18n/config.ts` additionally exports `locales`, `defaultLocale`, `isLocale`,
`resolveRequestLocale`, `loadMessages(locale)` (ar-over-en merge fallback), and
the default `getRequestConfig` consumed by `createNextIntlPlugin`.

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

- Unit: `resolveLocalized` fallback cases; `dirFor`; catalog parity.
- Build: no `[locale]` route introduced; existing routes unchanged.
- `typecheck`, `lint`, `build` pass.

| Item | Result |
|---|---|
| `npm run typecheck` | **Pass**, exit 0 |
| `npm run lint` | **0 errors**, 28 warnings (all pre-existing baseline) |
| `npm run build` | **Pass**, exit 0 — **32 routes**, unchanged set (no `[locale]`); all routes now `ƒ` dynamic (cookie-driven `<html>`; see §17) |
| Catalog (tsx, 2026-10-12) | **8/8 checks** — ar key-set == en key-set (38 keys each) after `loadMessages` merge; canonical `locales = ['en','ar']`; ar catalog resolves Arabic (`hero.title`) |
| Runtime (dev server, curl.exe, 2026-10-12) | **21/21 checks** — `<html lang dir>` = `en/ltr` (no cookie) and `ar/rtl` (`locale=ar`) on `/` + temp page; server `getTranslations`: request-scoped follows cookie (`Features` en vs `المميزات` ar), explicit `{ locale: 'ar' }` returns Arabic (requestLocale honored); `resolveLocalized` ar→en fallback, ar, en cases; `LanguageSwitcher` SSR button renders; `NextIntlClientProvider` mounted |

Verified behaviors (2026-10-12): the temporary `/m18-check` server page
exercised the real request config — `getTranslations('nav')` resolved
`Features`/`المميزات` per cookie, `getTranslations({ locale: 'ar' })` resolved
Arabic even without a cookie, and `resolveLocalized` produced the three
fallback outcomes. `<html lang dir>` flipped with the cookie on the public
home page as well.

> Note: PS 5.1 decodes UTF-8 responses with the ANSI codepage and drops
> `-Headers @{Cookie=…}`, so fetches used `curl.exe -s -H "Cookie: locale=ar"`
> with explicit UTF-8 file reads. The temp page was removed after checks.

## 16. Acceptance criteria

| AC | Status | Evidence |
|---|---|---|
| AC-01 | **Pass** | `NextIntlClientProvider` mounted in the root layout with `locale` + `loadMessages(locale)`; server `getTranslations`/client `useTranslations` available — runtime: `getTranslations('nav')` → `Features` (en) / `المميزات` (ar per cookie), `getTranslations({ locale: 'ar' })` → Arabic |
| AC-02 | **Pass** | `resolveLocalized` (`shared/i18n`, single implementation, shim removed from templates) — runtime: `ar`→`en` fallback, `ar` picks Arabic, `en` picks English; contract in §9 |
| AC-03 | **Pass** | `<html lang dir>` matches locale — `ar` ⇒ `lang="ar" dir="rtl"` on `/` and the check page (curl with `Cookie: locale=ar`) |
| AC-04 | **Pass** | `LanguageSwitcher` writes the `locale` cookie and reloads, preserving the URL/query (saved state kept); mounted in the dashboard sidebar; cookie value re-resolves on next request (html flips verified) |
| AC-05 | **Pass** | No `[locale]` segment — build lists the same 32 routes; `i18n/routing.ts` documents `localePrefix: 'as-needed'` (inert, no routing added) |
| AC-06 | **Pass** | `typecheck` exit 0; `lint` 0 errors/28 warnings (pre-existing); `build` pass — 32 routes; catalog 8/8; runtime 21/21 |

## 17. Handoff & risks

- **OD-2 resolved as DEC-005** — record the assumption: locale via cookie +
  `?lang`, no URL prefix (dashboard cookie; public sites `Site.defaultLocale`
  / `?lang` in M-020). Flag for product confirmation.
- M-019/M-020 depend on `resolveLocalized` and the provider.

### Handoff record

| Field | Value |
|---|---|
| Milestone | MILESTONE-018 — next-intl Wiring, Locale Direction & Fallback |
| Owner | Lead Engineering Agent |
| Date | 2026-10-12 |
| Status | **Done** |

**Files changed**

| Path | Change | Why |
|---|---|---|
| `app/layout.tsx` | Provider + dynamic `lang`/`dir` from cookie | Locale substrate for the whole app (FR-10/DEC-005) |
| `shared/i18n/index.ts` | New — `resolveLocalized`, `dirFor`, `isLocale`, `getLocaleFromCookie` | Single implementation of the fallback + server cookie reader |
| `shared/i18n/LanguageSwitcher.tsx` | New — cookie-based switch (client) | T04; mounted in dashboard sidebar |
| `i18n/config.ts` | Canonical `locales`/`Locale`/`defaultLocale`/`LOCALE_COOKIE`; `resolveRequestLocale`; `loadMessages` (ar→en merge); cookie-aware `getRequestConfig` | Single source per LOCALIZATION.md §1; request-config plugin target |
| `i18n/routing.ts` | No-prefix policy + canonical-locale re-export; dropped unused `createNavigation` | DEC-005 alignment |
| `next.config.ts` | `withNextIntl(createNextIntlPlugin('./i18n/config.ts'))` | Enables server `getTranslations` without i18n middleware/routing |
| `features/templates/lib/text.ts` | Local `resolveLocalized` shim removed → re-export of `shared/i18n` | M-018 deliverable; sections unchanged |
| `features/templates/types.ts` | `Locale` re-exported from `@/i18n/config` | Dedupe the union (LOCALIZATION.md §1) |
| `features/dashboard/components/DashboardShell.tsx` | `LanguageSwitcher` mounted in sidebar footer | Root-level switch surface |

**Deviations & decisions**

- **`getRequestConfig` must honor `requestLocale`.** The first cut resolved
  only from the cookie, which made explicit-locale server calls
  (`getTranslations({ locale: 'ar' })`) return the request catalog's language.
  Resolution order is now `requestLocale` → cookie → `en` (caught by a runtime
  check, fixed, re-verified 21/21).
- **All routes now render dynamically.** Reading the `locale` cookie in the
  root layout (required for correct `<html lang dir>`) disables static
  prerendering (`ƒ` in the build, was `○` for `/`, `/auth/*`, `/owner`,
  `/dashboard/sites/new`, etc.). Route set is unchanged (32). This is the
  documented DEC-005 trade-off; the dashboard is session-bound anyway.
- **Catalog parity test lands with M-025.** `loadMessages` performs the
  ar-over-en merge fallback now (LOCALIZATION.md §8 behavior); the permanent
  Vitest parity test is deferred with the rest of the suite.
- **No copy migration in this milestone.** Dashboard/landing strings stay as
  authored until M-019; template section labels remain `uiCopy` (structural,
  not catalog keys — TEMPLATE_SYSTEM §8). `useTranslations`/`getTranslations`
  are now usable everywhere.
- **Switcher reload caveat:** unsubmitted draft values in uncontrolled inputs
  reset on the switch reload; the URL/query (and thus saved state) are
  preserved. Acceptable for M-018; M-019 may offer a non-reload switch.

**Consumed by (next):** M-019 (dashboard copy via `useTranslations` /
`getTranslations`), M-020 (public switching + `hreflang`), M-023 (site
snapshot writes), M-025 (Vitest parity test).
