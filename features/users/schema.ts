import { z } from 'zod'

export const updateUserSchema = z.object({
  userId: z.string(),
  role: z.enum(['CUSTOMER', 'OWNER']).optional(),
  tenantId: z.string().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
