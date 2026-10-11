import type { z } from 'zod'
import {
  findTrackingByTenant,
  upsertTrackingConfig,
} from '@/features/tracking/repository'
import type { upsertTrackingConfigSchema } from '@/features/tracking/schema'

export async function getTrackingConfigForTenant(tenantId: string) {
  return findTrackingByTenant(tenantId)
}

export async function saveTrackingConfigForTenant(
  tenantId: string,
  input: z.infer<typeof upsertTrackingConfigSchema>
) {
  return upsertTrackingConfig(tenantId, input)
}
