'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { dirFor } from './pure'
import { loadMessages } from '@/i18n/messages'
import type { Locale } from '@/i18n/locales'

/**
 * Client locale provider (M-019). Holds the active locale in state so the
 * language switch can change locale **without a full reload** — preserving
 * unsaved dashboard form state (router.refresh re-renders server components
 * while client state survives).
 *
 * - The root layout (server) decides the initial locale from the `locale`
 *   cookie and passes it here as `initialLocale`.
 * - `<html lang dir>` is kept in sync imperatively (the `<html>` element lives
 *   outside React); `dirFor` is client-safe (`shared/i18n/pure`).
 * - `NextIntlClientProvider` gets `locale` + `loadMessages(locale)` so client
 *   `useTranslations` follow the switch immediately.
 */

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
})

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext)
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale
  children: React.ReactNode
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dirFor(locale)
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={loadMessages(locale)}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}