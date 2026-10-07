import { z } from 'zod'

export const createTenantSchema = z.object({
  name: z.string().min(1, 'Tenant name is required'),
  slug: z.string().min(1, 'Slug is required'),
  plan: z.enum(['FREE', 'PRO', 'ENTERPRISE']).optional().default('FREE'),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'DELETED']).optional().default('ACTIVE'),
})

export const updateTenantSchema = createTenantSchema.partial().extend({
  id: z.string(),
})

export type CreateTenantInput = z.infer<typeof createTenantSchema>
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>
