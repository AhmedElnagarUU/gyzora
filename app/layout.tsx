import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
