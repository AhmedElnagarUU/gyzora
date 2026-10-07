import { auth } from '@/shared/lib/auth/auth-client'

export interface TenantContext {
  userId: string
  role: 'CUSTOMER' | 'OWNER'
  tenantId: string
  sessionId: string
}

/**
 * Resolve the session + tenant context from a request.
 * Returns `null` when there is no valid session.
 */
export async function getTenantContext(
  headers: Headers
): Promise<TenantContext | null> {
  const session = await auth.api.getSession({ headers })
  if (!session?.user) return null

  const user = session.user as {
    role?: string
    tenantId?: string
  }

  return {
    userId: session.user.id,
    role: (user.role as TenantContext['role']) || 'CUSTOMER',
    tenantId: user.tenantId || '',
    sessionId: session.session.id,
  }
}

/**
 * Require an authenticated session. Throws 401-equivalent error when absent.
 */
export async function requireSession(headers: Headers): Promise<TenantContext> {
  const ctx = await getTenantContext(headers)
  if (!ctx) {
    throw new Error('UNAUTHORIZED')
  }
  return ctx
}

/**
 * Require a specific role. Throws 403-equivalent error when the role doesn't match.
 */
export async function requireRole(
  headers: Headers,
  role: 'OWNER'
): Promise<TenantContext> {
  const ctx = await requireSession(headers)
  if (ctx.role !== role) {
    throw new Error('FORBIDDEN')
  }
  return ctx
}

export type SessionResult = Awaited<ReturnType<typeof auth.api.getSession>>
export type User = NonNullable<NonNullable<SessionResult>['user']>
