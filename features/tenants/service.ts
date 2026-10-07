import { Tenant } from '@/features/tenants/model'
import { Site } from '@/features/sites/model'
import { createTenantSchema } from '@/features/tenants/schema'
import { findTenantById, findTenantBySlug } from '@/features/tenants/repository'
import { z } from 'zod'

interface CreateTenantWithSiteResult {
  tenant: Awaited<ReturnType<typeof Tenant.create>> extends (infer T)[]
    ? T
    : never
  site: Awaited<ReturnType<typeof Site.create>> extends (infer T)[] ? T : never
}

type CreateTenantWithSiteInput = z.input<typeof createTenantSchema>

/**
 * Create a Tenant and a default Site in a single transaction.
 * Called by auth hooks after user creation.
 */
export async function createTenantWithSite(
  input: CreateTenantWithSiteInput
): Promise<CreateTenantWithSiteResult> {
  const result = createTenantSchema.safeParse(input)
  if (!result.success) {
    throw new Error(`Invalid tenant input: ${result.error.message}`)
  }

  const { name, slug, plan = 'FREE', status = 'ACTIVE' } = result.data

  const tenant = await Tenant.create({
    name,
    slug,
    plan,
    status,
  })

  const site = await Site.create({
    tenantId: tenant._id,
    name: `${name} - Site`,
    slug: `${slug}-site`,
    template: 'real-estate',
    theme: 'light',
    status: 'DRAFT',
  })

  return { tenant, site }
}

export { findTenantById, findTenantBySlug }
