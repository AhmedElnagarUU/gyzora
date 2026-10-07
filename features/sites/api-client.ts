export async function getSites() {
  const res = await fetch('/api/sites', {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch sites')
  }
  return data.data
}

export async function getSiteBySlug(slug: string) {
  const res = await fetch(`/api/sites?slug=${encodeURIComponent(slug)}`)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch site')
  }
  return data.data
}

export async function createSite(
  site: import('@/features/sites/schema').CreateSiteInput
) {
  const res = await fetch('/api/sites', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(site),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create site')
  }
  return data.data
}
