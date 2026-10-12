import type {
  LocalizedText,
  SiteContent,
  TemplateDefinition,
} from './types'

/**
 * Bilingual generic default content for both MVP templates plus
 * `cloneTemplateContent`.
 *
 * Defaults are **sample content** (`isSampleContent: true`): generic and
 * category-appropriate, with no invented achievements, counts, certifications,
 * or years of experience (FR-05, DEC-006). Creating a site deep-clones the
 * template's `defaultContent` and overlays company input — a definition is
 * never mutated (DEC-002, PRD invariant 8).
 */

/** Input the site-creation flow overlays onto a template's default content. */
export interface CompanyInput {
  name?: string
  tagline?: Partial<LocalizedText>
  description?: Partial<LocalizedText>
  about?: {
    title?: Partial<LocalizedText>
    body?: Partial<LocalizedText>
  }
  contact?: {
    phone?: string
    email?: string
    address?: Partial<LocalizedText>
    mapUrl?: string
  }
}

export const defaultRealEstateContent = {
  isSampleContent: true,
  company: {
    name: 'Your Company',
    tagline: {
      en: 'Find the right property, the right way',
      ar: 'اعثر على العقار المناسب بالطريقة الصحيحة',
    },
    description: {
      en: 'A property agency that helps families and investors explore residential and commercial listings and make confident decisions.',
      ar: 'وكالة عقارية تساعد العائلات والمستثمرين على استكشاف القوائم السكنية والتجارية واتخاذ قرارات واثقة.',
    },
  },
  about: {
    title: { en: 'About our agency', ar: 'عن وكالتنا' },
    body: {
      en: 'We guide clients through every step of finding a property — from understanding their needs to shortlisting suitable options and completing the transaction.',
      ar: 'نرافق عملاءنا في كل خطوة من خطوات البحث عن عقار — من فهم احتياجاتهم إلى اختيار الخيارات المناسبة وإنهاء الصفقة.',
    },
    mission: {
      en: 'Make searching for a property simple, transparent, and stress-free.',
      ar: 'نجعل البحث عن العقار بسيطاً وواضحاً وخالياً من التعقيد.',
    },
    vision: {
      en: 'A property journey where every client feels informed and supported.',
      ar: 'رحلة عقارية يشعر فيها كل عميل بأنه على اطلاع كامل ويتلقى الدعم في كل خطوة.',
    },
    image: {
      url: '/templates/real-estate/about.jpg',
      alt: {
        en: 'Spacious modern living room',
        ar: 'غرفة معيشة عصرية واسعة',
      },
      source: 'bundled',
    },
  },
  services: [
    {
      id: 'residential-sales',
      icon: 'Home',
      title: { en: 'Residential Sales', ar: 'المبيعات السكنية' },
      description: {
        en: 'Assistance finding apartments, villas, and houses that match your budget and lifestyle.',
        ar: 'مساعدة في إيجاد الشقق والفلل والمنازل التي تناسب ميزانيتك وأسلوب حياتك.',
      },
      image: {
        url: '/templates/real-estate/service-residential.jpg',
        alt: { en: 'Modern family home for sale', ar: 'منزل عائلي عصري للبيع' },
        source: 'bundled',
      },
    },
    {
      id: 'rentals',
      icon: 'KeyRound',
      title: { en: 'Rentals & Leasing', ar: 'الإيجار والتأجير' },
      description: {
        en: 'Support for leasing residential and commercial properties with clear terms.',
        ar: 'دعم لتأجير العقارات السكنية والتجارية بشروط واضحة.',
      },
      image: {
        url: '/templates/real-estate/service-rentals.jpg',
        alt: { en: 'Suburban home available for rent', ar: 'منزل في الضواحي متاح للإيجار' },
        source: 'bundled',
      },
    },
    {
      id: 'commercial',
      icon: 'Building2',
      title: { en: 'Commercial Spaces', ar: 'المساحات التجارية' },
      description: {
        en: 'Guidance for offices, shops, and other commercial premises.',
        ar: 'إرشاد للمكاتب والمحلات والمساحات التجارية الأخرى.',
      },
      image: {
        url: '/templates/real-estate/service-commercial.jpg',
        alt: { en: 'Modern glass office tower', ar: 'برج مكاتب زجاجي حديث' },
        source: 'bundled',
      },
    },
    {
      id: 'valuation',
      icon: 'ClipboardCheck',
      title: { en: 'Property Evaluation', ar: 'تقييم العقارات' },
      description: {
        en: 'Assessments that help you understand a property’s value before you decide.',
        ar: 'تقييمات تساعدك على فهم قيمة العقار قبل اتخاذ القرار.',
      },
      image: {
        url: '/templates/real-estate/service-valuation.jpg',
        alt: { en: 'Documents and charts used for property evaluation', ar: 'مستندات ورسوم بيانية لتقييم العقار' },
        source: 'bundled',
      },
    },
  ],
  features: [
    {
      id: 'curated-listings',
      icon: 'MapPin',
      title: { en: 'Curated listings', ar: 'قوائم مختارة' },
      description: {
        en: 'Properties matched to your requirements rather than a list of everything.',
        ar: 'عقارات مطابقة لاحتياجاتك بدلاً من قائمة بكل شيء.',
      },
    },
    {
      id: 'local-knowledge',
      icon: 'Compass',
      title: { en: 'Local market knowledge', ar: 'معرفة بالسوق المحلي' },
      description: {
        en: 'Practical understanding of neighborhoods, pricing, and availability.',
        ar: 'فهم عملي للأحياء والأسعار والتوفر في السوق.',
      },
    },
    {
      id: 'clear-guidance',
      icon: 'CheckCircle2',
      title: { en: 'Clear guidance', ar: 'إرشاد واضح' },
      description: {
        en: 'Straightforward advice at each stage of your search.',
        ar: 'نصائح مباشرة وواضحة في كل مرحلة من مراحل البحث.',
      },
    },
    {
      id: 'post-sale-support',
      icon: 'Headset',
      title: { en: 'Support after you choose', ar: 'دعم بعد الاختيار' },
      description: {
        en: 'Help with the steps that follow once you have selected a property.',
        ar: 'مساعدة في الخطوات التي تلي اختيارك للعقار.',
      },
    },
  ],
  process: [
    {
      id: 'process-tell-us',
      step: 1,
      title: { en: 'Tell us what you need', ar: 'أخبرنا بما تحتاجه' },
      description: {
        en: 'Share your budget, preferred area, and type of property.',
        ar: 'شاركنا ميزانيتك والمنطقة المفضلة ونوع العقار المطلوب.',
      },
    },
    {
      id: 'process-shortlist',
      step: 2,
      title: { en: 'Review suitable options', ar: 'مراجعة الخيارات المناسبة' },
      description: {
        en: 'We shortlist listings that match your requirements and arrange viewings.',
        ar: 'نختار القوائم المطابقة لاحتياجاتك ونرتب مواعيد المعاينة.',
      },
    },
    {
      id: 'process-choose',
      step: 3,
      title: { en: 'Compare and decide', ar: 'المقارنة واتخاذ القرار' },
      description: {
        en: 'Compare the options side by side and decide with clear information.',
        ar: 'قارن الخيارات بجانب بعضها واتخذ قرارك بمعلومات واضحة.',
      },
    },
    {
      id: 'process-complete',
      step: 4,
      title: { en: 'Complete the process', ar: 'إنهاء الإجراءات' },
      description: {
        en: 'We guide you through the paperwork and handover steps.',
        ar: 'نرافقك في إجراءات الأوراق والتسليم النهائي.',
      },
    },
  ],
  contact: {},
  images: {
    hero: {
      url: '/templates/real-estate/hero.jpg',
      alt: {
        en: 'Two-story house with illuminated windows at dusk',
        ar: 'منزل من طابقين بنوافذ مضاءة عند الغسق',
      },
      source: 'bundled',
    },
    'hero-mobile': {
      url: '/templates/real-estate/hero.jpg',
      alt: {
        en: 'Two-story house with illuminated windows at dusk',
        ar: 'منزل من طابقين بنوافذ مضاءة عند الغسق',
      },
      source: 'bundled',
    },
    gallery: {
      url: '/templates/real-estate/gallery.jpg',
      alt: { en: 'Elegant kitchen with white cabinetry', ar: 'مطبخ أنيق بخزائن بيضاء' },
      source: 'bundled',
    },
  },
} satisfies SiteContent

export const defaultConstructionContent = {
  isSampleContent: true,
  company: {
    name: 'Your Company',
    tagline: {
      en: 'Building with a clear plan and a steady hand',
      ar: 'نبني بخطة واضحة وعمل مدروس',
    },
    description: {
      en: 'A construction and contracting company that helps clients plan and deliver residential and commercial projects.',
      ar: 'شركة مقاولات تساعد العملاء على تخطيط وتنفيذ المشاريع السكنية والتجارية.',
    },
  },
  about: {
    title: { en: 'About our company', ar: 'عن شركتنا' },
    body: {
      en: 'We take projects from planning to handover, coordinating the trades, materials, and schedules needed to deliver the result you expect.',
      ar: 'نتولى المشاريع من التخطيط إلى التسليم، وننسق المقاولين والمواد والجداول الزمنية لتحقيق النتيجة التي تتوقعها.',
    },
    mission: {
      en: 'Deliver each project on a clear schedule with honest communication.',
      ar: 'نسلم كل مشروع وفق جدول واضح مع تواصل صادق.',
    },
    vision: {
      en: 'Be the contractor clients trust to turn plans into finished spaces.',
      ar: 'أن نكون المقاول الذي يثق به العملاء لتحويل المخططات إلى مساحات مكتملة.',
    },
    image: {
      url: '/templates/construction/about.jpg',
      alt: {
        en: 'Construction blueprint with tools on a workbench',
        ar: 'مخطط بناء مع أدوات على طاولة العمل',
      },
      source: 'bundled',
    },
  },
  services: [
    {
      id: 'general-contracting',
      icon: 'HardHat',
      title: { en: 'General Contracting', ar: 'المقاولات العامة' },
      description: {
        en: 'End-to-end construction for residential and commercial projects.',
        ar: 'بناء شامل للمشاريع السكنية والتجارية.',
      },
      image: {
        url: '/templates/construction/service-contracting.jpg',
        alt: { en: 'Industrial plant under a clear sky', ar: 'منشأة صناعية تحت سماء صافية' },
        source: 'bundled',
      },
    },
    {
      id: 'fit-outs',
      icon: 'Paintbrush',
      title: { en: 'Interior Fit-outs', ar: 'التشطيبات الداخلية' },
      description: {
        en: 'Interior finishes that bring a space to completion.',
        ar: 'تشطيبات داخلية تمنح المكان لمسة نهائية متكاملة.',
      },
      image: {
        url: '/templates/construction/service-fitouts.jpg',
        alt: { en: 'Modern interior fit-out with white cabinetry', ar: 'تشطيب داخلي عصري بخزائن بيضاء' },
        source: 'bundled',
      },
    },
    {
      id: 'project-management',
      icon: 'ClipboardList',
      title: { en: 'Project Management', ar: 'إدارة المشاريع' },
      description: {
        en: 'Planning, scheduling, and coordination from start to handover.',
        ar: 'تخطيط وجدولة وتنسيق من البداية حتى التسليم.',
      },
      image: {
        url: '/templates/construction/service-management.jpg',
        alt: { en: 'Hand drawing technical designs on a blueprint', ar: 'يد ترسم تصاميم فنية على مخطط' },
        source: 'bundled',
      },
    },
    {
      id: 'maintenance',
      icon: 'Wrench',
      title: { en: 'Maintenance & Aftercare', ar: 'الصيانة والمتابعة' },
      description: {
        en: 'Ongoing upkeep services to protect the work after handover.',
        ar: 'خدمات صيانة مستمرة للحفاظ على جودة العمل بعد التسليم.',
      },
      image: {
        url: '/templates/construction/service-maintenance.jpg',
        alt: { en: 'Workers leveling fresh cement on site', ar: 'عمال يسوّون الإسمنت الطازج في الموقع' },
        source: 'bundled',
      },
    },
  ],
  features: [
    {
      id: 'safety-first',
      icon: 'ShieldCheck',
      title: { en: 'Safety-first practices', ar: 'ممارسات السلامة أولاً' },
      description: {
        en: 'Site safety procedures applied on every project.',
        ar: 'إجراءات سلامة تُطبق في كل مشروع.',
      },
    },
    {
      id: 'clear-communication',
      icon: 'MessageSquare',
      title: { en: 'Clear communication', ar: 'تواصل واضح' },
      description: {
        en: 'Regular updates so you always know how the project is progressing.',
        ar: 'تحديثات منتظمة لتعرف دائماً سير المشروع.',
      },
    },
    {
      id: 'quality-control',
      icon: 'BadgeCheck',
      title: { en: 'Quality at every stage', ar: 'الجودة في كل مرحلة' },
      description: {
        en: 'Checks and reviews built into the construction process.',
        ar: 'فحوصات ومراجعات مدمجة في عملية البناء.',
      },
    },
    {
      id: 'on-time-planning',
      icon: 'CalendarCheck',
      title: { en: 'Careful scheduling', ar: 'جدولة دقيقة' },
      description: {
        en: 'Realistic timelines planned and communicated up front.',
        ar: 'جداول زمنية واقعية تُخطط وتُعلن مسبقاً.',
      },
    },
  ],
  process: [
    {
      id: 'process-consult',
      step: 1,
      title: { en: 'Consult', ar: 'استشارة' },
      description: {
        en: 'We discuss your goals, site, and budget before anything begins.',
        ar: 'نناقش أهدافك وموقعك وميزانيتك قبل البدء.',
      },
    },
    {
      id: 'process-plan',
      step: 2,
      title: { en: 'Plan', ar: 'تخطيط' },
      description: {
        en: 'We prepare a scope, schedule, and clear cost estimate.',
        ar: 'نعد نطاق العمل والجدول الزمني وتقدير التكلفة.',
      },
    },
    {
      id: 'process-build',
      step: 3,
      title: { en: 'Build', ar: 'تنفيذ' },
      description: {
        en: 'Construction is carried out and coordinated on site.',
        ar: 'يُنفذ البناء ويُنسق العمل في الموقع.',
      },
    },
    {
      id: 'process-handover',
      step: 4,
      title: { en: 'Handover', ar: 'تسليم' },
      description: {
        en: 'Final review, finishing touches, and handover of the completed space.',
        ar: 'مراجعة نهائية ولمسات أخيرة وتسليم المساحة المكتملة.',
      },
    },
  ],
  contact: {},
  images: {
    hero: {
      url: '/templates/construction/hero.jpg',
      alt: {
        en: 'Engineers in safety helmets reviewing construction plans on site',
        ar: 'مهندسان بخوذات السلامة يراجعان مخططات البناء في الموقع',
      },
      source: 'bundled',
    },
  },
} satisfies SiteContent

/** Merge an optional partial localized overlay onto a base value. */
function mergeLocalized(
  base: LocalizedText,
  overlay?: Partial<LocalizedText>
): LocalizedText {
  return { en: overlay?.en ?? base.en, ar: overlay?.ar ?? base.ar }
}

/**
 * Deep-copy a template's `defaultContent` and overlay company input.
 *
 * The returned object is a fresh clone (`structuredClone`) — mutating it never
 * affects the template definition (DEC-002). This is the only place that reads
 * `template.defaultContent`.
 */
export function cloneTemplateContent(
  template: TemplateDefinition,
  companyInput: CompanyInput = {}
): SiteContent {
  const content = structuredClone(template.defaultContent)

  content.company.name = companyInput.name ?? content.company.name
  content.company.tagline = mergeLocalized(
    content.company.tagline,
    companyInput.tagline
  )
  content.company.description = mergeLocalized(
    content.company.description,
    companyInput.description
  )

  if (companyInput.about) {
    if (companyInput.about.title) {
      content.about.title = mergeLocalized(
        content.about.title,
        companyInput.about.title
      )
    }
    if (companyInput.about.body) {
      content.about.body = mergeLocalized(
        content.about.body,
        companyInput.about.body
      )
    }
  }

  if (companyInput.contact) {
    const input = companyInput.contact
    if (input.phone !== undefined) {
      content.contact.phone = input.phone || undefined
    }
    if (input.email !== undefined) {
      content.contact.email = input.email || undefined
    }
    if (input.address) {
      content.contact.address = mergeLocalized(
        content.contact.address ?? { en: '', ar: '' },
        input.address
      )
    }
    if (input.mapUrl) {
      content.contact.mapUrl = input.mapUrl
    }
  }

  return content
}