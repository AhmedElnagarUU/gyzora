import { auth } from '@/lib/auth'

/**
 * Update a Better Auth user's custom fields (role, tenantId).
 * Used by databaseHooks to link the user to their tenant.
 */
export async function updateUser(
  userId: string,
  data: { role?: string; tenantId?: string }
) {
  const session = await auth.api.getSession({
    headers: {
      'content-type': 'application/json',
    },
    body: {
      userId,
    },
  } as any)

  if (!session) {
    throw new Error('User not found')
  }

  // Better Auth v1.7+: update user via internal API
  const result = await fetch(
    `${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/api/auth/user`,
    {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${session.session.token}`,
      },
      body: JSON.stringify(data),
    }
  )

  if (!result.ok) {
    throw new Error(`Failed to update user: ${result.statusText}`)
  }

  return result.json()
}
