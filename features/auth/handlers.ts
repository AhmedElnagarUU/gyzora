import { auth } from '@/shared/lib/auth/auth-client'
import type { NextRequest } from 'next/server'

/**
 * Thin handler that delegates to the Better Auth route handler.
 * The Better Auth middleware handles session creation, cookie setting, etc.
 */
export async function handleAuth(req: NextRequest) {
  return auth.handler(req)
}

export { auth }
