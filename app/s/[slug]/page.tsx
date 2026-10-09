import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPublishedSiteBySlug, getSiteImageSlots } from '@/features/sites/public-service'
import { TemplateRenderer } from '@/features/templates/components/TemplateRenderer'
import { getThemeClass } from '@/features/templates/theme'
import { TEMPLATES } from '@/features/templates/types'

export const revalidate = 3600 // 1 hour ISR

interface PageProps {
  params: Promise<{
    slug: string
  }>
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
    <html
      lang="en"
      dir={siteData.tenant.slug.includes('ar') || siteData.site.template === 'real-estate' ? 'ltr' : 'ltr'}
      className={themeClasses}
    >
      <head>
        <title>{siteData.site.name} — Professional Website</title>
        <meta
          name="description"
          content={`${siteData.tenant.name} - Professional website for real estate, construction, and design`}
        />
        {images.favicon && (
          <link rel="icon" href={images.favicon.url} sizes="32x32" />
        )}
      </head>
      <body>
        <TemplateRenderer
          template={templateDef}
          images={images}
          siteName={siteData.site.name}
          headline={siteData.tenant.name}
          subheading={`Professional services in ${siteData.tenant.name}`}
        />
      </body>
    </html>
  )
}
