import { randomUUID } from 'crypto'
import {
  getPresignedUploadUrl,
  getPublicUrl,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from '@/shared/lib/s3/s3-client'
import { createMediaSchema } from '@/features/media/schema'
import { createMediaRecord, findMediaByTenant } from '@/features/media/repository'
import type { IMedia } from '@/features/media/model'

export async function generateUploadUrl(
  tenantId: string,
  filename: string,
  contentType: string,
  size: number
): Promise<{ uploadUrl: string; key: string; url: string }> {
  const result = createMediaSchema.safeParse({ filename, contentType, size })
  if (!result.success) {
    throw new Error(result.error.message)
  }

  if (!ALLOWED_MIME_TYPES.includes(contentType)) {
    throw new Error('File type not allowed')
  }

  if (size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds limit')
  }

  const extension = filename.split('.').pop()
  const key = `${randomUUID()}.${extension}`
  const fullKey = `tenants/${tenantId}/${key}`

  const uploadUrl = await getPresignedUploadUrl(
    tenantId,
    key,
    contentType
  )

  const url = getPublicUrl(fullKey)

  return { uploadUrl, key: fullKey, url }
}

export async function saveMediaMetadata(
  tenantId: string,
  key: string,
  url: string,
  size: number,
  mimeType: string
): Promise<IMedia> {
  return createMediaRecord({ tenantId, key, url, size, mimeType })
}

export async function getTenantMedia(tenantId: string): Promise<IMedia[]> {
  return findMediaByTenant(tenantId)
}
