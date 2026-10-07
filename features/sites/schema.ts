import { z } from 'zod'

export const createSiteSchema = z.object({
  name: z.string().min(1, 'Site name is required'),
  slug: z.string().min(1, 'Slug is required'),
  template: z.string().optional().default('real-estate'),
  theme: z.string().optional().default('light'),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional().default('DRAFT'),
})

export const updateSiteSchema = createSiteSchema.partial().extend({
  id: z.string(),
})

export type CreateSiteInput = z.infer<typeof createSiteSchema>
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>
