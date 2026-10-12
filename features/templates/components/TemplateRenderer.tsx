import type { ComponentType } from 'react'
import Link from 'next/link'
import type {
  Locale,
  ProjectView,
  SectionType,
  SiteContent,
  TemplateDefinition,
  TemplateTheme,
} from '../types'
import { themeCssVars } from '../theme'
import { resolveLocalized, uiCopy } from '../lib/text'
import { ImageWithFallback } from './ImageWithFallback'
import { AboutBodySection } from '../sections/AboutBodySection'
import { ContactSection } from '../sections/ContactSection'
import { CtaSection } from '../sections/CtaSection'
import { FeaturedProjectsSection } from '../sections/FeaturedProjectsSection'
import { FeaturesSection } from '../sections/FeaturesSection'
import { HeroSection } from '../sections/HeroSection'
import { IntroSection } from '../sections/IntroSection'
import { ProcessSection } from '../sections/ProcessSection'
import { ProjectDetailSection } from '../sections/ProjectDetailSection'
import { ProjectGridSection } from '../sections/ProjectGridSection'
import { ServicesSection } from '../sections/ServicesSection'
import { StatsSection } from '../sections/StatsSection'
import type { SectionProps } from '../sections/types'

/**
 * The single template-agnostic renderer (DEC-002, TEMPLATE_SYSTEM §4).
 *
 * Renders exactly one page of a template (selected by `pageId`, defaulting to
 * the home page): its sections in declaration order. Unknown section types are
 * skipped, never crashed on. Theme tokens are applied to the root wrapper as
 * CSS custom properties and consumed throughout (M-014 AC-05). Projects enter
 * as a separate argument (they are not part of `SiteContent`).
 */
export interface TemplateRendererProps {
  template: TemplateDefinition
  content: SiteContent
  projects?: ProjectView[]
  locale?: Locale
  theme?: TemplateTheme
  /** Template page id to render; defaults to the home page (`/`). */
  pageId?: string
  /** For `project-detail` sections: which project to show (default: first). */
  activeProjectSlug?: string
}

/** One component per `SectionType` (TEMPLATE_SYSTEM §3). */
const SECTION_COMPONENTS: Record<SectionType, ComponentType<SectionProps>> = {
  hero: HeroSection,
  intro: IntroSection,
  services: ServicesSection,
  features: FeaturesSection,
  'featured-projects': FeaturedProjectsSection,
  stats: StatsSection,
  process: ProcessSection,
  cta: CtaSection,
  contact: ContactSection,
  'about-body': AboutBodySection,
  'project-grid': ProjectGridSection,
  'project-detail': ProjectDetailSection,
}

export function TemplateRenderer({
  template,
  content,
  projects = [],
  locale = 'en',
  theme,
  pageId,
  activeProjectSlug,
}: TemplateRendererProps) {
  const resolvedTheme = theme ?? template.theme
  const pages = template.pages
  const page =
    pages.find((p) => p.id === pageId) ??
    pages.find((p) => p.slug === '/') ??
    pages[0]

  if (!page) return null

  const sectionProps: Omit<SectionProps, 'type'> = {
    content,
    projects,
    locale,
    theme: resolvedTheme,
    page,
    activeProjectSlug,
  }

  // Template route pages (e.g. `/projects/[slug]`) are not nav destinations.
  const navPages = pages.filter((p) => !p.slug.includes('[slug]'))
  const companyName = content.company.name

  return (
    <div
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      lang={locale}
      style={{
        ...themeCssVars(resolvedTheme),
        fontFamily: resolvedTheme.fonts.sans,
        backgroundColor: 'var(--tp-background)',
        color: 'var(--tp-foreground)',
      }}
      className="min-h-screen"
    >
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'var(--tp-background)',
          borderColor: 'var(--tp-border)',
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            {content.company.logo?.url ? (
              <ImageWithFallback
                src={content.company.logo.url}
                alt={
                  resolveLocalized(content.company.logo.alt, locale) ||
                  companyName
                }
                width={160}
                height={48}
                className="h-10 w-auto"
              />
            ) : (
              <span
                className="text-xl font-bold"
                style={{
                  color: 'var(--tp-foreground)',
                  fontFamily: 'var(--tp-font-heading)',
                }}
              >
                {companyName}
              </span>
            )}
          </Link>

          <nav aria-label="Main">
            <ul className="flex flex-wrap items-center gap-1">
              {navPages.map((p) => {
                const isActive = p.id === page.id
                return (
                  <li key={p.id}>
                    <a
                      href={`/${p.id}`}
                      aria-current={isActive ? 'page' : undefined}
                      className="rounded-lg px-3 py-2 text-sm font-medium"
                      style={
                        isActive
                          ? { color: 'var(--tp-primary)' }
                          : { color: 'var(--tp-secondary)' }
                      }
                    >
                      {resolveLocalized(p.name, locale)}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {page.sections.map((type) => {
          const SectionComponent = SECTION_COMPONENTS[type]
          // Unknown or not-yet-supported section types are skipped (AC-02).
          if (!SectionComponent) return null
          return (
            <div key={type}>
              {/* Sections mark themselves with data-section on their own root,
                  so a degraded (empty) section leaves no marker at all. */}
              <SectionComponent {...sectionProps} type={type} />
            </div>
          )
        })}
      </main>

      <footer
        className="border-t py-8"
        style={{
          borderColor: 'var(--tp-border)',
          backgroundColor: 'var(--tp-card)',
        }}
      >
        <div
          className="mx-auto w-full max-w-7xl px-4 text-center text-sm"
          style={{ color: 'var(--tp-secondary)' }}
        >
          © {new Date().getFullYear()} {companyName}.{' '}
          {uiCopy(locale, 'allRightsReserved')}
        </div>
      </footer>
    </div>
  )
}