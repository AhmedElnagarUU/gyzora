'use client'

import { useRouter } from 'next/navigation'
import { signOut } from '@/features/auth/api-client'

export default function SignOutButton() {
  const router = useRouter()

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
      Sign out
    </button>
  )
}
