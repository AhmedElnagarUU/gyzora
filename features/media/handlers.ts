import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/shared/lib/auth/session'
import {
  generateUploadUrl,
  saveMediaMetadata,
  getTenantMedia,
} from '@/features/media/service'
import { createMediaSchema } from '@/features/media/schema'
import {
  deleteMediaByIdAndTenant,
} from '@/features/media/repository'
import { z } from 'zod'

const confirmMediaSchema = z.object({
  key: z.string().min(1),
  url: z.string().url(),
  size: z.number().int().positive(),
  mimeType: z.enum([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
  ]),
})

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const media = await getTenantMedia(ctx.tenantId)
    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const body: unknown = await req.json().catch(() => ({}))
    const result = createMediaSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 400 }
      )
    }

    const { filename, contentType, size } = result.data
    const upload = await generateUploadUrl(ctx.tenantId, filename, contentType, size)

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl: upload.uploadUrl,
        key: upload.key,
        url: upload.url,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const body: unknown = await req.json().catch(() => ({}))
    const result = confirmMediaSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 400 }
      )
    }

    const media = await saveMediaMetadata(
      ctx.tenantId,
      result.data.key,
      result.data.url,
      result.data.size,
      result.data.mimeType
    )

    return NextResponse.json({ success: true, data: media })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ctx = await requireSession(req.headers)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Media ID is required' },
        { status: 400 }
      )
    }

    await deleteMediaByIdAndTenant(id, ctx.tenantId)
    return NextResponse.json({ success: true, data: { deleted: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    const status = message === 'UNAUTHORIZED' ? 401 : 500
    return NextResponse.json({ success: false, error: message }, { status })
  }
}
