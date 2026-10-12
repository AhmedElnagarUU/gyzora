import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import type { AbstractIntlMessages } from 'next-intl'
import en from './messages/en.json'
import ar from './messages/ar.json'

/**
 * Canonical locale configuration (DEC-005, LOCALIZATION.md §1/§5).
 *
 * - Locale is carried by a cookie (`LOCALE_COOKIE`, default `en`) — there is
 *   **no** `[locale]` URL segment (FR-11). Public sites additionally honor
 *   `?lang` and `Site.defaultLocale` (wired in M-020).
 * - `en.json` is the source of truth for catalog keys; `ar.json` missing keys
 *   fall back to English at runtime via `loadMessages` (LOCALIZATION.md §8;
 *   permanent parity test lands with the M-025 Vitest suite).
 */

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'
export const LOCALE_COOKIE = 'locale'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && value !== '' && locales.includes(value as Locale)
}

/** Locale for the current request: `locale` cookie, else the default. */
export async function resolveRequestLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : defaultLocale
}

/** Recursively fill `ar` gaps with `en` values (runtime fallback, §8). */
function mergeMessages(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(base)) {
    const b = base[key]
    const o = override[key]
    if (b && typeof b === 'object' && !Array.isArray(b)) {
      out[key] = mergeMessages(
        b as Record<string, unknown>,
        (o && typeof o === 'object' && !Array.isArray(o)
          ? o
          : {}) as Record<string, unknown>
      )
    } else {
      out[key] = typeof o === 'string' ? o : b
    }
  }
  return out
}

/** Catalog for a locale with the `ar`→`en` missing-key fallback applied. */
export function loadMessages(locale: Locale): AbstractIntlMessages {
  const enTree = en as unknown as Record<string, unknown>
  if (locale === 'en') return enTree as unknown as AbstractIntlMessages
  const arTree = ar as unknown as Record<string, unknown>
  return mergeMessages(enTree, arTree) as unknown as AbstractIntlMessages
}

/**
 * Server-side request config for next-intl (`getTranslations`/`getLocale` on
 * the server). Resolution order (DEC-005):
 *   1. explicit `requestLocale` — e.g. `getTranslations({ locale: 'ar' })`;
 *   2. the `locale` cookie — so request-scoped calls follow the saved language;
 *   3. `defaultLocale` (`en`).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const explicit = await requestLocale
  const locale = isLocale(explicit) ? explicit : await resolveRequestLocale()
  return { locale, messages: loadMessages(locale) }
})