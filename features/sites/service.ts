import {
  createSiteRecord,
  findSiteById,
  findSitesByTenantId,
  findSiteByTenantAndSlug,
  updateSiteByIdAndTenant,
} from '@/features/sites/repository'
import {
  createSiteSchema,
  updateSiteSchema,
  type CreateSiteInput,
} from '@/features/sites/schema'

/** True when the error is a MongoDB duplicate-key error (code 11000). */
function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  )
}

export async function createSite(input: CreateSiteInput & { tenantId: string }) {
  const { tenantId, ...body } = input
  const result = createSiteSchema.safeParse(body)
  if (!result.success) {
    throw new Error(`Invalid site input: ${result.error.message}`)
  }

  try {
    return await createSiteRecord({ tenantId, ...result.data })
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new Error('SLUG_TAKEN', { cause: error })
    }
    throw error
  }
}

export async function updateSite(
  id: string,
  tenantId: string,
  input: Record<string, unknown>
) {
  const result = updateSiteSchema.safeParse({ ...input, id })
  if (!result.success) {
    throw new Error(`Invalid site input: ${result.error.message}`)
  }

  const { id: _id, ...data } = result.data

  try {
    return await updateSiteByIdAndTenant(id, tenantId, data)
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new Error('SLUG_TAKEN', { cause: error })
    }
    throw error
  }
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
