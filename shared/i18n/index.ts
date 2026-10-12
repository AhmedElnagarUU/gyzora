import { cookies } from 'next/headers'
import { LOCALE_COOKIE, defaultLocale, isLocale } from '@/i18n/locales'
import type { Locale } from '@/i18n/locales'

/**
 * Shared localization surface (M-018/M-019, LOCALIZATION.md §4/§5/§7).
 *
 * - Pure helpers (`resolveLocalized`, `dirFor`, `isLocale`, `Locale`) are
 *   re-exported from `shared/i18n/pure` — client-safe.
 * - `getLocaleFromCookie` is **server-only** (imports `next/headers`) and
 *   drives the root `<html lang dir>` + the locale handed to the provider.
 *
 * Client components should import from `@/shared/i18n/pure` (or use the
 * `useLocale` hook from `@/shared/i18n/LocaleProvider`) to avoid pulling
 * `next/headers` into the client bundle.
 */

export * from './pure'
export { LOCALE_COOKIE, defaultLocale, locales } from '@/i18n/locales'

/** Locale for the current request from the `locale` cookie (default `en`). */
export async function getLocaleFromCookie(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : defaultLocale
}