import { TrackingConfig } from '@/features/tracking/model'
import { connectToDatabase } from '@/shared/lib/db/mongoose'
import { trackingConfigSchema } from '@/features/tracking/schema'

export async function findTrackingByTenant(
  tenantId: string
): Promise<any> {
  await connectToDatabase()
  return TrackingConfig.findOne({ tenantId })
    .sort({ createdAt: -1 })
    .lean()
}

export async function upsertTrackingConfig(
  tenantId: string,
  data: {
    siteId?: string
    trackers?: Array<{
      provider: string
      name: string
      pixelId?: string
      trackingId?: string
      scriptUrl?: string
      enabled?: boolean
    }>
  }
): Promise<any> {
  await connectToDatabase()
  const result = trackingConfigSchema.safeParse({ tenantId, ...data })
  if (!result.success) {
    throw new Error(`Invalid tracking config: ${result.error.message}`)
  }

  return TrackingConfig.findOneAndUpdate(
    { tenantId },
    {
      $set: {
        siteId: data.siteId,
        trackers: data.trackers || [],
      },
      $setOnInsert: { tenantId, createdAt: new Date(), updatedAt: new Date() },
    },
    { upsert: true, new: true }
  ).lean()
}
