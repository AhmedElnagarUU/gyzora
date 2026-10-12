import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPublishedSiteBySlug,
  getSiteImageSlots,
} from '@/features/sites/public-service'
import { TemplateRenderer } from '@/features/templates/components/TemplateRenderer'
import { TEMPLATES, cloneTemplateContent } from '@/features/templates'
import type { ImageSlotKey, ImageRef } from '@/features/templates'

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
  const theme = templateDef.theme

  // Until snapshot publishing (M-023) wires `Site.published.content` in, the
  // public site renders the template's bilingual default content (sample-only,
  // `isSampleContent: true`). Slot images resolved from published projects are
  // merged in so the hero stays real when projects exist.
  const content = cloneTemplateContent(templateDef)
  const images = await getSiteImageSlots(siteData.site._id, siteData.tenant._id)
  for (const [key, img] of Object.entries(images)) {
    if (img?.url) {
      content.images[key as ImageSlotKey] = {
        url: img.url,
        alt: { en: img.alt || content.company.name, ar: '' },
        source: 'upload',
      } satisfies ImageRef
    }
  }

  return (
    <div className={theme.mode === 'dark' ? 'dark' : ''}>
      <TemplateRenderer
        template={templateDef}
        content={content}
        locale="en"
        theme={theme}
      />
    </div>
  )
}