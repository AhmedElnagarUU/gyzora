import type { CreateSiteInput, UpdateSiteInput } from '@/features/sites/schema'

/**
 * Client-side wrapper around the sites API.
 * These functions are for use in client components only — server components
 * should call `@/features/sites/service` directly (see CODE_RULES.md).
 */
export async function getSites() {
  const res = await fetch('/api/sites', {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch sites')
  }
  return data.data
}

export async function createSite(site: CreateSiteInput) {
  const res = await fetch('/api/sites', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(site),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create site')
  }
  return data.data
}

export async function updateSite(
  id: string,
  updates: Omit<UpdateSiteInput, 'id'>
) {
  const res = await fetch('/api/sites', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ id, ...updates }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update site')
  }
  return data.data
}
