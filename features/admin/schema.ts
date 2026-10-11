import { z } from 'zod'

/** Body for `POST /api/admin/tenants` (owner-only tenant lifecycle change). */
export const tenantStatusActionSchema = z.object({
  id: z.string().min(1, 'Tenant id is required'),
  action: z.enum(['activate', 'suspend']),
})

/** Query for `GET /api/admin/users`. */
export const listUsersQuerySchema = z.object({
  role: z.enum(['CUSTOMER', 'OWNER']).optional(),
})

export type TenantStatusAction = z.infer<typeof tenantStatusActionSchema>
