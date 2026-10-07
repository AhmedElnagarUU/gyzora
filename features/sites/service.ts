import { Site } from '@/features/sites/model'
import { createSiteSchema, type CreateSiteInput } from '@/features/sites/schema'
import {
  findSiteById,
  findSitesByTenantId,
  findSiteByTenantAndSlug,
} from '@/features/sites/repository'

export async function createSite(
  input: CreateSiteInput & { tenantId: string }
) {
  const { tenantId, ...body } = input
  const result = createSiteSchema.safeParse(body)
  if (!result.success) {
    throw new Error(`Invalid site input: ${result.error.message}`)
  }

  const site = await Site.create({
    tenantId,
    ...result.data,
  })

  return site
}

export async function getSiteById(id: string) {
  return findSiteById(id)
}

export async function getSitesByTenant(tenantId: string) {
  return findSitesByTenantId(tenantId)
}

export async function getSiteByTenantAndSlug(tenantId: string, slug: string) {
  return findSiteByTenantAndSlug(tenantId, slug)
}
