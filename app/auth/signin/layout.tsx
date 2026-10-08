import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Gzora',
  description: 'Sign in to your Gzora account',
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
