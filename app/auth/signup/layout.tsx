import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Gzora',
  description: 'Create your Gzora account',
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
