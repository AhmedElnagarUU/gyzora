/**
 * DEC-005: no `[locale]` URL segment — the locale is carried by a cookie
 * (`locale`, see `i18n/config.ts`) and, on public sites, `?lang` +
 * `Site.defaultLocale` (wired in M-020). This module documents the routing
 * policy and re-exports the canonical locale list from `i18n/config.ts`
 * (LOCALIZATION.md §1 — never duplicate the union).
 */
import { defaultLocale, locales } from './config'
import type { Locale } from './config'

export { defaultLocale, locales }
export type { Locale }

/** Static prefix policy — kept for reference; no prefix routing is active. */
export const localePrefix = 'as-needed' as const