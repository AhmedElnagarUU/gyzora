import { defaultRealEstateContent } from '../../content'
import { SECTION_SCHEMAS } from '../../schema'
import type { TemplateDefinition } from '../../types'

/**
 * `real-estate` template definition — immutable, code-resident (DEC-002).
 * Identity: premium, spacious, property-forward (TEMPLATE_SYSTEM §9).
 */
export const realEstateTemplate: TemplateDefinition = {
  id: 'real-estate',
  slug: 'real-estate',
  name: 'Real Estate',
  category: 'real-estate',
  supportedLocales: ['en', 'ar'],
  description:
    'Modern template designed for real estate agencies. Showcases property listings with image galleries and contact forms.',
  previewImage: '/templates/real-estate-preview.jpg',
  defaultTheme: 'light',
  theme: {
    id: 'light',
    mode: 'light',
    colors: {
      primary: '#2563eb',
      secondary: '#6b7280',
      accent: '#8b5cf6',
      background: '#ffffff',
      foreground: '#111827',
      card: '#f9fafb',
      border: '#e5e7eb',
    },
    fonts: {
      sans: 'Inter, system-ui, sans-serif',
      heading: 'Inter, system-ui, sans-serif',
    },
  },
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
      key: 'gallery',
      label: 'Gallery',
      description: 'Property gallery images',
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
  pages: [
    {
      id: 'home',
      slug: '/',
      name: { en: 'Home', ar: 'الرئيسية' },
      sections: [
        'hero',
        'intro',
        'services',
        'features',
        'featured-projects',
        'cta',
        'contact',
      ],
    },
    {
      id: 'about',
      slug: '/about',
      name: { en: 'About', ar: 'من نحن' },
      sections: ['about-body', 'features', 'cta'],
    },
    {
      id: 'services',
      slug: '/services',
      name: { en: 'Services', ar: 'خدماتنا' },
      sections: ['intro', 'services', 'process', 'cta'],
    },
    {
      id: 'projects',
      slug: '/projects',
      name: { en: 'Projects', ar: 'مشاريعنا' },
      sections: ['intro', 'project-grid', 'cta'],
    },
    {
      id: 'project-detail',
      slug: '/projects/[slug]',
      name: { en: 'Project Details', ar: 'تفاصيل المشروع' },
      sections: ['project-detail'],
    },
    {
      id: 'contact',
      slug: '/contact',
      name: { en: 'Contact', ar: 'اتصل بنا' },
      sections: ['contact', 'cta'],
    },
  ],
  sectionSchemas: SECTION_SCHEMAS,
  defaultContent: defaultRealEstateContent,
}