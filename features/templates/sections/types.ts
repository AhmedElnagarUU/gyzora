import type {
  Locale,
  ProjectView,
  SectionType,
  SiteContent,
  TemplatePage,
  TemplateTheme,
} from '../types'

/**
 * The uniform props every section component receives (TEMPLATE_SYSTEM §3):
 * the full `SiteContent`, the projects view-model, locale, theme, and the
 * current template page (for names/navigation). Sections read only the slices
 * they need and handle their own degradation — they never fetch or write.
 */
export interface SectionProps {
  /** Which section type this component renders (for its own `data-section`). */
  type: SectionType
  content: SiteContent
  projects: ProjectView[]
  locale: Locale
  theme: TemplateTheme
  page: TemplatePage
  /**
   * Which project a `project-detail` section should show (passed by the
   * calling route). Falls back to the first project when omitted.
   */
  activeProjectSlug?: string
}