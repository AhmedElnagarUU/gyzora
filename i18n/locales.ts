/**
 * Canonical locale configuration (DEC-005, LOCALIZATION.md §1/§5).
 *
 * Client-safe by design (no `next/headers`) so both server and client code can
 * import the union. The server-side next-intl request config lives in
 * `i18n/config.ts`; the pure localization helpers live in `shared/i18n/pure`.
 *
 * - Locale is carried by a cookie (`LOCALE_COOKIE`, default `en`) — there is
 *   **no** `[locale]` URL segment (FR-11). Public sites additionally honor
 *   `?lang` and `Site.defaultLocale` (wired in M-020).
 */
export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const LOCALE_COOKIE = 'locale'

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' &&
    value !== '' &&
    (locales as readonly string[]).includes(value)
  )
}