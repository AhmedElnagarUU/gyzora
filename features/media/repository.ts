import { connectToDatabase } from '@/shared/lib/db/mongoose'
import { Media } from '@/features/media/model'
import type { IMedia } from '@/features/media/model'

export async function findMediaByTenant(tenantId: string): Promise<IMedia[]> {
  await connectToDatabase()
  return Media.find({ tenantId }).sort({ createdAt: -1 }).lean()
}

export async function findMediaById(id: string) {
  await connectToDatabase()
  return Media.findById(id).lean()
}

export async function findMediaByIdAndTenant(id: string, tenantId: string) {
  await connectToDatabase()
  return Media.findOne({ _id: id, tenantId: tenantId as any }).lean()
}

export async function createMediaRecord(data: {
  tenantId: string
  key: string
  url: string
  size: number
  mimeType: string
}): Promise<IMedia> {
  await connectToDatabase()
  return Media.create(data)
}

export async function deleteMediaByIdAndTenant(
  id: string,
  tenantId: string
): Promise<boolean> {
  await connectToDatabase()
  const result = await Media.deleteOne({
    _id: id,
    tenantId: tenantId as any,
  })
  return result.deletedCount > 0
}
