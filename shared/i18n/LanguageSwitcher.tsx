'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from './LocaleProvider'
import { LOCALE_COOKIE } from '@/i18n/locales'

/**
 * Cookie-based language switch (DEC-005, LOCALIZATION.md §5).
 *
 * Writes the `locale` cookie, updates the client locale (via the
 * `LocaleProvider` context → `<html lang dir>` follows imperatively), then
 * `router.refresh()` re-renders the server components with the new cookie.
 *
 * No full page reload is used, so unsaved dashboard/editor form input is
 * preserved (T04). `router.refresh` keeps all client component state while
 * re-fetching the RSC tree.
 */

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const router = useRouter()

  const target: 'en' | 'ar' = locale === 'en' ? 'ar' : 'en'
  const label = locale === 'en' ? 'العربية' : 'English'

  function switchLocale() {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`
    setLocale(target)
    router.refresh()
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