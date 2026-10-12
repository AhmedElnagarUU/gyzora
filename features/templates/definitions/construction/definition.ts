import { defaultConstructionContent } from '../../content'
import { SECTION_SCHEMAS } from '../../schema'
import type { TemplateDefinition } from '../../types'

/**
 * `construction` template definition — immutable, code-resident (DEC-002).
 * Identity (M-016): sturdy, industrial, capability-forward — dark charcoal
 * base with a burnt-orange primary (`#ea580c`) and high-vis yellow accent
 * (`#facc15`), bold heavy heading stack (Impact/Arial Black). Clearly
 * distinct from the real-estate template's light teal+serif
 * (TEMPLATE_SYSTEM §9).
 */
export const constructionTemplate: TemplateDefinition = {
  id: 'construction',
  slug: 'construction',
  name: 'Construction',
  category: 'construction',
  supportedLocales: ['en', 'ar'],
  description:
    'Bold template built for construction and contracting businesses. Highlights projects with large hero images and portfolio grids.',
  previewImage: '/templates/construction-preview.jpg',
  defaultTheme: 'dark',
  theme: {
    id: 'dark',
    mode: 'dark',
    colors: {
      primary: '#ea580c',
      secondary: '#9ca3af',
      accent: '#facc15',
      background: '#0f1117',
      foreground: '#f3f4f6',
      card: '#181d27',
      border: '#374151',
    },
    fonts: {
      sans: 'Inter, system-ui, sans-serif',
      heading: 'Impact, "Arial Black", sans-serif',
    },
  },
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
  pages: [
    {
      id: 'home',
      slug: '/',
      name: { en: 'Home', ar: 'الرئيسية' },
      sections: [
        'hero',
        'intro',
        'process',
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
  defaultContent: defaultConstructionContent,
}