import { NextResponse } from 'next/server'
import { getAuth } from '@/shared/lib/auth/auth-client'
import type { NextRequest } from 'next/server'

/**
 * Thin handler that delegates to the Better Auth route handler.
 * The Better Auth handler manages session creation, cookie setting, etc.
 *
 * This endpoint intentionally uses Better Auth's own protocol (not the
 * feature envelope) because it is a pass-through to the auth framework.
 */
export async function handleAuth(req: NextRequest) {
  const auth = await getAuth()
  return auth.handler(req)
}

/**
 * `GET /api/auth/session` — return the current session in the standard
 * feature envelope (`DEC-003`). `401` when there is no valid session.
 */
export async function getSession(req: NextRequest) {
  try {
    const auth = await getAuth()
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Preserve the original `{ user }` payload (id, email, name, role, tenantId),
    // now wrapped in the feature envelope (`DEC-003`).
    return NextResponse.json({ success: true, data: { user: session.user } })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
