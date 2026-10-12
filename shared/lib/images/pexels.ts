/**
 * Optional, server-only Pexels image search provider (M-017, DEC-006).
 *
 * Returns `[]` — never throws — when the optional `PEXELS_API_KEY` is not
 * configured, when the query is empty, on HTTP errors, timeouts, or malformed
 * responses. Bundled template imagery keeps the app fully functional without
 * this integration.
 *
 * Only URL + alt text ever leave this module; the API key is read server-side
 * (via the validated `env` proxy) and never reaches the client (M-017 AC-04).
 */

import { env } from '@/shared/lib/env'

export type PexelsImage = { url: string; alt: string }
export type PexelsOrientation = 'landscape' | 'portrait' | 'square'

/** Results per request — large enough for the editor image picker. */
const PAGE_SIZE = 12
/** Abort the upstream call after this long; slow/broken providers must not
 * hold up an endpoint. */
const TIMEOUT_MS = 6_000

interface PexelsPhoto {
  src?: { large?: string; original?: string }
  alt?: string
}

interface PexelsResponse {
  photos?: PexelsPhoto[]
}

/** Map one Pexels photo onto the shared lightweight shape. */
function toImage(photo: PexelsPhoto): PexelsImage | null {
  const url = photo.src?.large ?? photo.src?.original ?? ''
  const alt = photo.alt?.trim()
  if (!url || !alt) return null
  return { url, alt }
}

/**
 * Search Pexels for illustrative images. `orientation` is optional; the API
 * also accepts e.g. `size`/`locale` — kept minimal per the M-017 contract.
 */
export async function searchImages(
  query: string,
  orientation?: PexelsOrientation
): Promise<PexelsImage[]> {
  const key = env.PEXELS_API_KEY
  const q = query.trim()
  if (!key || !q) return []

  const url = new URL('https://api.pexels.com/v1/search')
  url.searchParams.set('query', q)
  url.searchParams.set('per_page', String(PAGE_SIZE))
  if (orientation) url.searchParams.set('orientation', orientation)

  try {
    const res = await fetch(url, {
      headers: { Authorization: key },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!res.ok) return []

    const data = (await res.json()) as PexelsResponse
    return (data.photos ?? []).map(toImage).filter((img): img is PexelsImage => img !== null)
  } catch {
    // Network failure, timeout, or invalid JSON — the integration is optional.
    return []
  }
}