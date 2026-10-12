'use client'

import { useEffect, useState } from 'react'

/**
 * Cookie-based language switch (DEC-005, LOCALIZATION.md §5).
 *
 * Sets the `locale` cookie (`i18n/config.ts` `LOCALE_COOKIE`) and reloads the
 * page so the root `<html lang dir>` and `NextIntlClientProvider` re-resolve.
 * A full reload is required because the switch must update `<html>` attributes,
 * which live outside the React tree. The reload keeps the current URL/query
 * state, so saved dashboard state is preserved.
 *
 * The current locale is read from `document.documentElement.lang`, which the
 * root layout drives — no server props needed from the client boundary.
 */

const LOCALE_COOKIE = 'locale'

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    setLocale(document.documentElement.lang === 'ar' ? 'ar' : 'en')
  }, [])

  const target: 'en' | 'ar' = locale === 'en' ? 'ar' : 'en'
  const label = locale === 'en' ? 'العربية' : 'English'

  function switchLocale() {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`
    window.location.reload()
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={label}
      className="w-full rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
    >
      {label}
    </button>
  )
}