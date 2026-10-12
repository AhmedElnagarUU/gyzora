import { isLocale } from '@/i18n/locales'
import type { Locale } from '@/i18n/locales'

/**
 * Pure localization helpers (M-018/M-019) — client-safe: no `next/headers`,
 * no server-only imports. The server-only cookie reader lives in
 * `shared/i18n/index.ts`; client components import from here (or from the
 * provider in `shared/i18n/LocaleProvider.tsx`).
 *
 * - `resolveLocalized` — the single bilingual-text resolution used by
 *   template content: `ar` → `en` → empty string.
 * - `dirFor` — text direction per locale (`ar` is RTL).
 */

export type { Locale }
export { isLocale }

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