import { cookies } from 'next/headers'
import {
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  locales,
} from '@/i18n/config'
import type { Locale } from '@/i18n/config'

/**
 * Shared localization substrate (M-018, LOCALIZATION.md §4/§5/§7).
 *
 * - `resolveLocalized` — the single bilingual-text resolution used by
 *   template content everywhere: `ar` → `en` → empty string.
 * - `dirFor` / `getLocaleFromCookie` — drive the root `<html lang dir>` and
 *   `NextIntlClientProvider` from the `locale` cookie (DEC-005; no `[locale]`
 *   URL segment).
 *
 * This module is server-only (imports `next/headers`). Client components that
 * need the locale use `document.documentElement.lang` (see
 * `shared/i18n/LanguageSwitcher.tsx`) or the next-intl provider.
 */

export { LOCALE_COOKIE, defaultLocale, locales }
export type { Locale }

/** Direction for a locale — `ar` is RTL, everything else LTR (§7). */
export function dirFor(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

/** Structural shape of bilingual customer content (en default, ar optional). */
export interface LocalizedValue {
  en?: string
  ar?: string
}

/** `ar` → `en` → empty string (never `null`/`undefined`). */
export function resolveLocalized(
  value: LocalizedValue | null | undefined,
  locale: Locale
): string {
  if (!value) return ''
  if (locale === 'ar' && value.ar) return value.ar
  return value.en ?? ''
}

/** Locale for the current request from the `locale` cookie (default `en`). */
export async function getLocaleFromCookie(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : defaultLocale
}