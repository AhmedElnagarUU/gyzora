import { createProjectSchema } from '@/features/projects/schema'
import {
  createProjectRecord,
  findProjectsByTenant,
  findProjectByIdAndTenant,
  updateProjectRecord,
} from '@/features/projects/repository'

export async function getAllProjects(tenantId: string) {
  return findProjectsByTenant(tenantId)
}

export async function getProjectById(id: string, tenantId: string) {
  return findProjectByIdAndTenant(id, tenantId)
}

export async function createProject(input: {
  tenantId: string
  title: string
  description: string
  slug: string
  category: string
  order: number
  status: string
  seoMetadata?: Record<string, unknown>
  images?: Array<{ key: string; url: string; alt?: string; mimeType?: string }>
}) {
  const { tenantId, ...body } = input
  const result = createProjectSchema.safeParse(body)
  if (!result.success) {
    throw new Error(`Invalid project input: ${result.error.message}`)
  }

  return createProjectRecord({ tenantId, ...result.data })
}

export async function updateProject(
  id: string,
  tenantId: string,
  input: Record<string, unknown>
) {
  const { id: _id, ...rest } = input
  return updateProjectRecord(id, tenantId, rest)
}
