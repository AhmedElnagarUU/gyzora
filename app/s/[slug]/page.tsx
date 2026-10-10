import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPublishedSiteBySlug,
  getSiteImageSlots,
} from '@/features/sites/public-service'
import { TemplateRenderer } from '@/features/templates/components/TemplateRenderer'
import { getThemeClass } from '@/features/templates/theme'
import { TEMPLATES } from '@/features/templates/types'

export const revalidate = 3600 // 1 hour ISR

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const siteData = await getPublishedSiteBySlug(slug)

  if (!siteData) {
    return { title: 'Site not found' }
  }

  return {
    title: `${siteData.site.name} — Professional Website`,
    description: `${siteData.tenant.name} - Professional website for real estate, construction, and design`,
  }
}

export default async function PublicSitePage({ params }: PageProps) {
  const { slug } = await params

  const siteData = await getPublishedSiteBySlug(slug)
  if (!siteData) {
    notFound()
  }

  // Fallback to first template if the configured one isn't found
  const templateDef = siteData.templateDef || TEMPLATES[0]

  const images = await getSiteImageSlots(
    siteData.site._id,
    siteData.tenant._id
  )

  const themeClasses = siteData.themeDef
    ? getThemeClass(siteData.themeDef.mode)
    : ''

  return (
    <div className={themeClasses}>
      <TemplateRenderer
        template={templateDef}
        images={images}
        siteName={siteData.site.name}
        headline={siteData.tenant.name}
        subheading={`Professional services in ${siteData.tenant.name}`}
      />
    </div>
  )
}
