export async function getCurrentUser() {
  const res = await fetch('/api/users', {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch user')
  }
  return data.data
}
