export async function getMedia() {
  const res = await fetch('/api/media', {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch media')
  }
  return data.data
}

export async function getUploadUrl(
  filename: string,
  contentType: string,
  size: number
) {
  const res = await fetch('/api/media', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ filename, contentType, size }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to get upload URL')
  }
  return data.data
}

export async function confirmUpload(data: {
  key: string
  url: string
  size: number
  mimeType: string
}) {
  const res = await fetch('/api/media', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.error || 'Failed to save media metadata')
  }
  return json.data
}

export async function deleteMedia(id: string) {
  const res = await fetch(`/api/media?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete media')
  }
  return data.data
}
