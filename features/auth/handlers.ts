import { getAuth } from '@/shared/lib/auth/auth-client'
import type { NextRequest } from 'next/server'

/**
 * Thin handler that delegates to the Better Auth route handler.
 * The Better Auth handler manages session creation, cookie setting, etc.
 */
export async function handleAuth(req: NextRequest) {
  const auth = await getAuth()
  return auth.handler(req)
}
