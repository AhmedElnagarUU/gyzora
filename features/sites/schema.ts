import { z } from 'zod'

/**
 * A URL-safe slug. Normalized to lowercase and validated so it can be used
 * directly in the public `/s/{slug}` route.
 */
const slugField = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .transform((value) => value.toLowerCase())
  .refine(
    (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
    'Slug may only contain lowercase letters, numbers, and hyphens'
  )

export const createSiteSchema = z.object({
  name: z.string().trim().min(1, 'Site name is required'),
  slug: slugField,
  template: z.string().optional().default('real-estate'),
  theme: z.string().optional().default('light'),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional().default('DRAFT'),
})

export const updateSiteSchema = z.object({
  id: z.string().min(1, 'Site id is required'),
  name: z.string().trim().min(1).optional(),
  slug: slugField.optional(),
  template: z.string().optional(),
  theme: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
})

export type CreateSiteInput = z.infer<typeof createSiteSchema>
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>
