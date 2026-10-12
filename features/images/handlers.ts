import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireSession } from '@/shared/lib/auth/session'
import { searchImages } from '@/shared/lib/images/pexels'

/**
 * GET /api/images/search?q=&orientation=
 *
 * Tenant-session image search for the editor image picker. Returns the shared
 * `{ success, data: { images } }` envelope and never errors on provider
 * failure — no key or a failed upstream call yields `images: []`.
 */

const searchParamsSchema = z.object({
  q: z.string().trim().min(1, 'q is required').max(80),
  orientation: z.enum(['landscape', 'portrait', 'square']).optional(),
})

export async function GET(req: NextRequest) {
  try {
    // Editor tooling — like the media endpoints, requires a tenant session.
    await requireSession(req.headers)

    const params = Object.fromEntries(req.nextUrl.searchParams.entries())
    const parsed = searchParamsSchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.message },
        { status: 400 }
      )
    }

    const images = await searchImages(parsed.data.q, parsed.data.orientation)
    return NextResponse.json({ success: true, data: { images } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}