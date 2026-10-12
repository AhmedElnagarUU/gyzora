import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { dirFor, getLocaleFromCookie } from '@/shared/i18n'
import { loadMessages } from '@/i18n/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Gzora — Professional Websites for Real Estate & Construction',
  description:
    'Create and manage professional websites for your real estate, construction, contracting, or design business. Choose a template, add your content, and publish in minutes.',
  keywords: [
    'website builder',
    'real estate',
    'construction',
    'contracting',
    'interior design',
    'architecture',
  ],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // M-018: `<html lang dir>` + the next-intl provider follow the `locale`
  // cookie (DEC-005 — no `[locale]` URL segment). `resolveLocalized` fallback
  // and message catalogs are wired via `i18n/config.ts` / `shared/i18n`.
  const locale = await getLocaleFromCookie()

  return (
    <html lang={locale} dir={dirFor(locale)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={loadMessages(locale)}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}