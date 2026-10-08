/**
 * Client-side API wrapper for auth operations.
 * Used by client components to interact with auth endpoints.
 *
 * NOTE: This module must NOT import any server-only code (mongoose, models, etc).
 * All auth state is fetched via API routes only.
 */

export async function signIn(email: string, password: string) {
  const res = await fetch('/api/auth/sign-in/email', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to sign in')
  }
  return data
}

export async function signUp(email: string, password: string, name: string) {
  const res = await fetch('/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to create account')
  }
  return data
}

export async function signOut() {
  await fetch('/api/auth/sign-out', { method: 'POST' })
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}
