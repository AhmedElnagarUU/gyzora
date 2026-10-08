/**
 * Template definition interfaces.
 *
 * Templates define the structure and layout of a tenant's site.
 * Each template has named "image slots" that map to uploaded media.
 */

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

export interface SectionDefinition {
  key: string
  label: string
  description: string
  slots: ImageSlotKey[]
  required: boolean
}

export interface TemplateDefinition {
  id: string
  name: string
  slug: string
  description: string
  previewImage: string
  imageSlots: ImageSlotDefinition[]
  sections: SectionDefinition[]
  defaultTheme: string
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    slug: 'real-estate',
    description:
      'Modern template designed for real estate agencies. Showcases property listings with image galleries and contact forms.',
    previewImage: '/templates/real-estate-preview.jpg',
    defaultTheme: 'light',
    imageSlots: [
      {
        key: 'logo',
        label: 'Logo',
        description: 'Site logo (recommended: 200x60)',
        aspectRatio: '3.33:1',
        width: 200,
        height: 60,
        required: true,
      },
      {
        key: 'hero',
        label: 'Hero Image',
        description: 'Main hero banner image (recommended: 1920x800)',
        aspectRatio: '2.4:1',
        width: 1920,
        height: 800,
        required: true,
      },
      {
        key: 'hero-mobile',
        label: 'Hero Mobile',
        description: 'Mobile hero image (recommended: 800x600)',
        aspectRatio: '4:3',
        width: 800,
        height: 600,
        required: false,
      },
      {
        key: 'favicon',
        label: 'Favicon',
        description: 'Site favicon (recommended: 32x32)',
        aspectRatio: '1:1',
        width: 32,
        height: 32,
        required: false,
      },
    ],
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        description: 'Top banner with headline and call-to-action',
        slots: ['hero', 'hero-mobile'],
        required: true,
      },
      {
        key: 'gallery',
        label: 'Property Gallery',
        description: 'Property image gallery section',
        slots: ['gallery'],
        required: false,
      },
    ],
  },
  {
    id: 'construction',
    name: 'Construction',
    slug: 'construction',
    description:
      'Bold template built for construction and contracting businesses. Highlights projects with large hero images and portfolio grids.',
    previewImage: '/templates/construction-preview.jpg',
    defaultTheme: 'dark',
    imageSlots: [
      {
        key: 'logo',
        label: 'Logo',
        description: 'Site logo (recommended: 200x80)',
        aspectRatio: '2.5:1',
        width: 200,
        height: 80,
        required: true,
      },
      {
        key: 'hero',
        label: 'Hero Image',
        description: 'Main hero image (recommended: 1920x1080)',
        aspectRatio: '16:9',
        width: 1920,
        height: 1080,
        required: true,
      },
      {
        key: 'favicon',
        label: 'Favicon',
        description: 'Site favicon (recommended: 32x32)',
        aspectRatio: '1:1',
        width: 32,
        height: 32,
        required: false,
      },
    ],
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        description: 'Header banner with navigation overlay',
        slots: ['hero'],
        required: true,
      },
    ],
  },
]

export const getTemplate = (id: string): TemplateDefinition | undefined =>
  TEMPLATES.find((t) => t.id === id || t.slug === id)
