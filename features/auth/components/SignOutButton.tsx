'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { signOut } from '@/features/auth/api-client'

export default function SignOutButton() {
  const router = useRouter()
  const t = useTranslations('auth.signOut')

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
    >
      {t('submit')}
    </button>
  )
}
