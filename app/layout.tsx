import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { dirFor, getLocaleFromCookie } from '@/shared/i18n'
import { LocaleProvider } from '@/shared/i18n/LocaleProvider'

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
  // M-018/M-019: `<html lang dir>` + the client `LocaleProvider` follow the
  // `locale` cookie (DEC-005 — no `[locale]` URL segment). The provider holds
  // the locale in client state so the switcher can change language without a
  // reload, preserving unsaved form state.
  const locale = await getLocaleFromCookie()

  return (
    <html lang={locale} dir={dirFor(locale)}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  )
}