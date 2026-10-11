import type { z } from 'zod'

/**
 * Template contract — the single data model shared by every template, editor,
 * and renderer (EPIC-006, `docs/project/TEMPLATE_SYSTEM.md`, DEC-002/DEC-006).
 *
 * Templates are immutable code-resident definitions. Customer data lives only
 * in `Site.content` / `Site.published`, never in a definition. All customer
 * editable text is `LocalizedText` (bilingual `en`/`ar`, DEC-005).
 */

export type Locale = 'en' | 'ar'

/** Bilingual text. `en` is the default locale; `ar` may be empty in drafts. */
export interface LocalizedText {
  en: string
  ar: string
}

/** A referenced image. `alt` is required and localized (FR-08). */
export interface ImageRef {
  url: string
  alt: LocalizedText
  source: 'upload' | 'pexels' | 'bundled'
}

/** Named image slots a template exposes; filled per-customer from media. */
export type ImageSlotKey =
  | 'logo'
  | 'hero'
  | 'gallery'
  | 'favicon'
  | 'hero-mobile'

export interface ImageSlotDefinition {
  key: ImageSlotKey
  label: string
  description: string
  aspectRatio: string
  width?: number
  height?: number
  required: boolean
}

/**
 * Closed union of section types. Each type maps to exactly one section
 * component (M-014). Unknown types are skipped, never crashed on.
 */
export type SectionType =
  | 'hero'
  | 'intro'
  | 'services'
  | 'features'
  | 'featured-projects'
  | 'stats'
  | 'process'
  | 'cta'
  | 'contact'
  | 'about-body'
  | 'project-grid'
  | 'project-detail'

export type TemplateCategory = 'real-estate' | 'construction'

/**
 * Page composition: which sections render, in which order, on each page.
 * Both MVP templates declare Home, About, Services, Projects, Project Details,
 * and Contact (FR-05); the composition differs to give each a distinct
 * identity (TEMPLATE_SYSTEM §5, §9).
 */
export interface TemplatePage {
  /** Stable page id, e.g. `home`, `about`, `project-detail`. */
  id: string
  /** Public path. `project-detail` is a template route (`/projects/[slug]`). */
  slug: string
  name: LocalizedText
  sections: SectionType[]
}

/** Per-template color/typography tokens applied by the renderer (M-014). */
export interface TemplateTheme {
  /** Theme id — mirrors the legacy `defaultTheme` string used by tooling. */
  id: string
  mode: 'light' | 'dark'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    card: string
    border: string
  }
  fonts: {
    sans: string
    heading: string
  }
}

// ─── SiteContent — the customer-owned data contract ─────────────────────────

export interface CompanyContent {
  name: string
  tagline: LocalizedText
  description: LocalizedText
  logo?: ImageRef
  favicon?: ImageRef
}

export interface AboutContent {
  title: LocalizedText
  body: LocalizedText
  mission?: LocalizedText
  vision?: LocalizedText
  image?: ImageRef
}

export interface ServiceItem {
  id: string
  title: LocalizedText
  description: LocalizedText
  /** lucide-react icon name (DEC-006: lucide only). */
  icon: string
  image?: ImageRef
}

export interface FeatureItem {
  id: string
  title: LocalizedText
  description: LocalizedText
  icon: string
}

/** Only populated with real customer data — never fabricated (FR-05). */
export interface StatItem {
  id: string
  label: LocalizedText
  value: string
}

export interface ProcessStep {
  id: string
  step: number
  title: LocalizedText
  description: LocalizedText
}

export interface ContactContent {
  phone?: string
  email?: string
  address?: LocalizedText
  mapUrl?: string
  social?: Record<string, string>
}

/**
 * The content shape shared by all templates. Templates differ by which
 * sections they compose and their theme — never by a divergent data model.
 *
 * `projects` are NOT part of `SiteContent`; they live in their own collection
 * and are passed to the renderer separately (TEMPLATE_SYSTEM §2).
 */
export interface SiteContent {
  company: CompanyContent
  about: AboutContent
  services: ServiceItem[]
  features: FeatureItem[]
  /** Optional; renderers omit when absent. Never populated with fake numbers. */
  stats?: StatItem[]
  process?: ProcessStep[]
  contact: ContactContent
  images: Partial<Record<ImageSlotKey, ImageRef>>
  isSampleContent?: boolean
}

/** The immutable, code-resident template definition (DEC-002). */
export interface TemplateDefinition {
  id: string
  slug: string
  name: string
  description: string
  category: TemplateCategory
  supportedLocales: Locale[]
  previewImage: string
  /** Legacy theme id (configure tooling); mirrors `theme.id`. */
  defaultTheme: string
  theme: TemplateTheme
  imageSlots: ImageSlotDefinition[]
  pages: TemplatePage[]
  /** Per-section content contract shared by all templates. */
  sectionSchemas: Record<SectionType, z.ZodType>
  /** Bilingual seed content — deep-cloned per site, never mutated. */
  defaultContent: SiteContent
}