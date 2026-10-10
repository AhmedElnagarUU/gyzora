import { Tenant } from '@/features/tenants/model'
import { findPublishedSiteBySlug } from '@/features/sites/repository'
import { getTemplate } from '@/features/templates'
import { getTheme } from '@/features/templates/theme'

export interface PublicSiteData {
  site: {
    _id: string
    name: string
    slug: string
    template: string
    theme: string
    status: string
    tenantId: string
  }
  tenant: {
    _id: string
    name: string
    slug: string
  }
  templateDef: ReturnType<typeof getTemplate>
  themeDef: ReturnType<typeof getTheme> | null
}

export async function getPublishedSiteBySlug(
  slug: string
): Promise<PublicSiteData | null> {
  const site = await findPublishedSiteBySlug(slug)
  if (!site) return null

  const tenant = await Tenant.findById(site.tenantId).lean()
  if (!tenant || tenant.status !== 'ACTIVE') return null

  const templateDef = getTemplate(site.template)
  const themeDef = getTheme(site.theme)

  return {
    site: {
      _id: site._id.toString(),
      name: site.name,
      slug: site.slug,
      template: site.template,
      theme: site.theme,
      status: site.status,
      tenantId: site.tenantId.toString(),
    },
    tenant: {
      _id: tenant._id.toString(),
      name: tenant.name,
      slug: tenant.slug,
    },
    templateDef,
    themeDef,
  }
}

export async function getSiteImageSlots(
  siteId: string,
  tenantId: string
): Promise<
  Partial<
    Record<
      'logo' | 'hero' | 'hero-mobile' | 'gallery' | 'favicon',
      { url: string; alt?: string }
    >
  >
> {
  const { Project } = await import('@/features/projects/model')

  const projects = await Project.find({
    tenantId,
    siteId,
    status: 'PUBLISHED',
    images: { $exists: true, $ne: [] },
  }).lean()

  const slots: Record<string, { url: string; alt?: string }> = {}

  // Map project images to template slots.
  if (projects.length > 0) {
    const firstProject = projects[0]
    if (firstProject.images && firstProject.images.length > 0) {
      slots.hero = {
        url: firstProject.images[0].url,
        alt: firstProject.images[0].alt || firstProject.title,
      }
      if (firstProject.images[1]) {
        slots['hero-mobile'] = {
          url: firstProject.images[1].url,
          alt: firstProject.images[1].alt || firstProject.title,
        }
      }
    }
  }

  // NOTE: explicit site↔image-slot assignments are not persisted yet (see
  // docs/KNOWN_ISSUES.md). Slots currently derive from published project images.

  return slots
}
