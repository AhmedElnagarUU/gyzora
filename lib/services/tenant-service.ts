import { Tenant } from '@/models/Tenant'
import { Site } from '@/models/Site'

interface CreateTenantWithSiteInput {
  name: string
  slug: string
}

interface CreateTenantWithSiteResult {
  tenant: Awaited<ReturnType<typeof Tenant.create>> extends (infer T)[] ? T : never
  site: Awaited<ReturnType<typeof Site.create>> extends (infer T)[] ? T : never
}

/**
 * Create a Tenant and a default Site in a single transaction.
 * Called by Better Auth databaseHooks after user creation.
 */
export async function createTenantWithSite(
  input: CreateTenantWithSiteInput
): Promise<CreateTenantWithSiteResult> {
  const tenant = await Tenant.create({
    name: input.name,
    slug: input.slug,
    plan: 'FREE',
    status: 'ACTIVE',
  })

  const site = await Site.create({
    tenantId: tenant._id,
    name: `${input.name} - Site`,
    slug: `${input.slug}-site`,
    template: 'real-estate',
    theme: 'light',
    status: 'DRAFT',
  })

  return { tenant, site }
}