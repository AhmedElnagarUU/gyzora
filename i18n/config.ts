import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { LOCALE_COOKIE, defaultLocale, isLocale } from './locales'
import type { Locale } from './locales'
import { loadMessages } from './messages'

/**
 * Server-side next-intl request config (LOCALIZATION.md §5) — wired via
 * `createNextIntlPlugin('./i18n/config.ts')` in `next.config.ts`. No i18n
 * middleware/routing is added (DEC-005 — no `[locale]` segment).
 *
 * The canonical locale constants live in `i18n/locales.ts` (client-safe) and
 * are re-exported here for server callers.
 */
export { locales, defaultLocale, LOCALE_COOKIE, isLocale } from './locales'
export type { Locale } from './locales'

/** Locale for the current request: `locale` cookie, else the default. */
export async function resolveRequestLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : defaultLocale
}

/**
 * Resolution order:
 *   1. explicit `requestLocale` — e.g. `getTranslations({ locale: 'ar' })`;
 *   2. the `locale` cookie — so request-scoped calls follow the saved language;
 *   3. `defaultLocale` (`en`).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const explicit = await requestLocale
  const locale = isLocale(explicit) ? explicit : await resolveRequestLocale()
  return { locale, messages: loadMessages(locale) }
})