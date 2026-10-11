import { z } from 'zod'
import type { SectionType } from './types'

/**
 * Zod content contract for `SiteContent` and its slices. Shared with M-004
 * (persistence) and the editors; `siteContentSchema` validates a full site
 * content object at publish/update boundaries.
 */

export const localizedTextSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  ar: z.string(),
})

export const imageRefSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  alt: localizedTextSchema,
  source: z.enum(['upload', 'pexels', 'bundled']),
})

export const imageSlotKeys = [
  'logo',
  'hero',
  'gallery',
  'favicon',
  'hero-mobile',
] as const

/**
 * `Partial<Record<ImageSlotKey, ImageRef>>` — any subset of slots is valid.
 * (Zod 4's two-arg `z.record(z.enum(...), ...)` demands every key.)
 */
export const imageRefsSchema = z.object({
  logo: imageRefSchema.optional(),
  hero: imageRefSchema.optional(),
  gallery: imageRefSchema.optional(),
  favicon: imageRefSchema.optional(),
  'hero-mobile': imageRefSchema.optional(),
})

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  tagline: localizedTextSchema,
  description: localizedTextSchema,
  logo: imageRefSchema.optional(),
  favicon: imageRefSchema.optional(),
})

export const aboutSchema = z.object({
  title: localizedTextSchema,
  body: localizedTextSchema,
  mission: localizedTextSchema.optional(),
  vision: localizedTextSchema.optional(),
  image: imageRefSchema.optional(),
})

export const serviceItemSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  description: localizedTextSchema,
  icon: z.string().min(1, 'A lucide icon name is required'),
  image: imageRefSchema.optional(),
})

export const featureItemSchema = z.object({
  id: z.string().min(1),
  title: localizedTextSchema,
  description: localizedTextSchema,
  icon: z.string().min(1, 'A lucide icon name is required'),
})

export const statItemSchema = z.object({
  id: z.string().min(1),
  label: localizedTextSchema,
  value: z.string().min(1),
})

export const processStepSchema = z.object({
  id: z.string().min(1),
  step: z.number().int().min(1),
  title: localizedTextSchema,
  description: localizedTextSchema,
})

export const contactSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email('A valid email is required').optional(),
  address: localizedTextSchema.optional(),
  mapUrl: z.string().url('A valid URL is required').optional(),
  social: z.record(z.string(), z.string()).optional(),
})

/** The full customer-owned content contract (TEMPLATE_SYSTEM §2). */
export const siteContentSchema = z.object({
  company: companySchema,
  about: aboutSchema,
  services: z.array(serviceItemSchema),
  features: z.array(featureItemSchema),
  stats: z.array(statItemSchema).optional(),
  process: z.array(processStepSchema).optional(),
  contact: contactSchema,
  images: imageRefsSchema,
  isSampleContent: z.boolean().optional(),
})

/** Per-section content schemas — one entry per `SectionType`. */
export const SECTION_SCHEMAS = {
  hero: z.object({
    headline: localizedTextSchema,
    subheading: localizedTextSchema.optional(),
    cta: z
      .object({ label: localizedTextSchema, href: z.string() })
      .optional(),
    backgroundImage: imageRefSchema.optional(),
  }),
  intro: z.object({
    title: localizedTextSchema,
    body: localizedTextSchema,
  }),
  services: z.object({ items: z.array(serviceItemSchema) }),
  features: z.object({ items: z.array(featureItemSchema) }),
  'featured-projects': z.object({
    title: localizedTextSchema,
  }),
  stats: z.object({ items: z.array(statItemSchema) }),
  process: z.object({ steps: z.array(processStepSchema) }),
  cta: z.object({
    title: localizedTextSchema,
    body: localizedTextSchema.optional(),
    buttonLabel: localizedTextSchema,
  }),
  contact: contactSchema,
  'about-body': aboutSchema,
  'project-grid': z.object({
    title: localizedTextSchema,
  }),
  'project-detail': z.object({
    title: localizedTextSchema,
  }),
} as const satisfies Record<SectionType, z.ZodTypeAny>

export type SiteContentInput = z.infer<typeof siteContentSchema>
export type SectionContentInput = z.infer<
  (typeof SECTION_SCHEMAS)[SectionType]
>