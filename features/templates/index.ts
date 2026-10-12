import { constructionTemplate } from './definitions/construction/definition'
import { realEstateTemplate } from './definitions/real-estate/definition'
import type { TemplateDefinition } from './types'

/**
 * Template registry (DEC-002). Holds no customer data and performs no DB
 * access; definitions are immutable code-resident modules.
 */
export const TEMPLATES: TemplateDefinition[] = [
  realEstateTemplate,
  constructionTemplate,
]

/** Resolve a template by id or slug. */
export function getTemplate(id: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.id === id || t.slug === id)
}

/** All templates, for selection UIs and metadata. */
export function listTemplates(): TemplateDefinition[] {
  return TEMPLATES
}

export {
  cloneTemplateContent,
  defaultConstructionContent,
  defaultRealEstateContent,
  type CompanyInput,
} from './content'

export {
  SECTION_SCHEMAS,
  siteContentSchema,
  localizedTextSchema,
  imageRefSchema,
  imageRefsSchema,
  companySchema,
  aboutSchema,
  serviceItemSchema,
  featureItemSchema,
  statItemSchema,
  processStepSchema,
  contactSchema,
  type SiteContentInput,
} from './schema'

export {
  THEMES,
  getTheme,
  getThemeClass,
  themeCssVars,
  type ThemeDefinition,
  type ThemeColorMode,
} from './theme'

export type {
  Locale,
  LocalizedText,
  ImageRef,
  ImageSlotKey,
  ImageSlotDefinition,
  SectionType,
  TemplateCategory,
  TemplatePage,
  TemplateTheme,
  TemplateDefinition,
  SiteContent,
  CompanyContent,
  AboutContent,
  ServiceItem,
  FeatureItem,
  StatItem,
  ProcessStep,
  ContactContent,
  ProjectView,
} from './types'