import { z } from 'zod'

export type TrackingProvider = 'meta-pixel' | 'google-analytics' | 'custom'

export const trackingSchema = z.object({
  provider: z.enum(['meta-pixel', 'google-analytics', 'custom']),
  name: z.string().min(1, 'Name is required'),
  pixelId: z.string().optional(),
  trackingId: z.string().optional(),
  scriptUrl: z.string().url().optional(),
  enabled: z.boolean().default(true),
})

export const trackingConfigSchema = z.object({
  tenantId: z.string(),
  siteId: z.string().optional(),
  trackers: z.array(trackingSchema).optional().default([]),
})

export const updateTrackingSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  pixelId: z.string().optional(),
  trackingId: z.string().optional(),
  scriptUrl: z.string().url().optional(),
  enabled: z.boolean().optional(),
})

export type TrackingConfigInput = z.infer<typeof trackingConfigSchema>
export type UpdateTrackingInput = z.infer<typeof updateTrackingSchema>
