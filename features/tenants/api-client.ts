import type { ITenant } from '@/features/tenants/model'

export async function getTenant(slug: string): Promise<ITenant | null> {
  const res = await fetch(`/api/tenants?slug=${encodeURIComponent(slug)}`)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch tenant')
  }
  return data.data
}
