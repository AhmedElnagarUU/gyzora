import type { AbstractIntlMessages } from 'next-intl'
import en from './messages/en.json'
import ar from './messages/ar.json'
import type { Locale } from './locales'

/**
 * Message-catalog loading with the `ar`→`en` missing-key fallback
 * (LOCALIZATION.md §8). Client-safe (imports only JSON), so both the server
 * request config (`i18n/config.ts`) and the client `LocaleProvider` use it.
 *
 * `en.json` is the source of truth for keys; every key in `en` is guaranteed
 * present after loading any locale. The permanent parity test lands with M-025.
 */

type Tree = Record<string, unknown>

/** Recursively fill `ar` gaps with `en` values. */
function mergeMessages(base: Tree, override: Tree): Tree {
  const out: Tree = {}
  for (const key of Object.keys(base)) {
    const b = base[key]
    const o = override[key]
    if (b && typeof b === 'object' && !Array.isArray(b)) {
      out[key] = mergeMessages(
        b as Tree,
        (o && typeof o === 'object' && !Array.isArray(o) ? o : {}) as Tree
      )
    } else {
      out[key] = typeof o === 'string' ? o : b
    }
  }
  return out
}

export function loadMessages(locale: Locale): AbstractIntlMessages {
  const enTree = en as unknown as Tree
  if (locale === 'en') return enTree as unknown as AbstractIntlMessages
  return mergeMessages(
    enTree,
    ar as unknown as Tree
  ) as unknown as AbstractIntlMessages
}