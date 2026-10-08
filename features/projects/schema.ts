import { z } from 'zod'
import { ProjectStatus } from './model'

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().optional().default('General'),
  order: z.number().optional().default(0),
  status: z
    .enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
    .optional()
    .default('DRAFT'),
  seoMetadata: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
  images: z
    .array(
      z.object({
        key: z.string(),
        url: z.string().url(),
        alt: z.string().optional(),
        mimeType: z.string().optional(),
      })
    )
    .optional(),
})

export const updateProjectSchema = createProjectSchema
  .partial()
  .extend({
    id: z.string(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  })
  .transform((data) => {
    const { id, ...rest } = data
    return { id, ...rest }
  })

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type { ProjectStatus }
