import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Sign Up — Gzora',
  description: 'Create your Gzora account',
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
