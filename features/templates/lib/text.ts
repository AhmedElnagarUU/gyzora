import type { Locale, LocalizedText } from '../types'

/**
 * Localized-text + UI-copy helpers shared by the section components.
 *
 * `resolveLocalized` is a temporary local shim for the shared
 * `shared/i18n` helper (M-018 replaces it — LOCALIZATION.md §M-018):
 * `ar` → `en` → empty string.
 *
 * `uiCopy` returns structural UI labels (buttons, headings, footer) in the
 * active locale. These are static interface labels — never customer content —
 * so they are not placeholder text (M-014 AC-03, TEMPLATE_SYSTEM §8).
 */

export function resolveLocalized(
  value: LocalizedText | undefined,
  locale: Locale
): string {
  if (!value) return ''
  if (locale === 'ar' && value.ar) return value.ar
  return value.en
}

const UI_COPY = {
  en: {
    servicesHeading: 'What we do',
    featuresHeading: 'Why choose us',
    processHeading: 'How we work',
    statsHeading: 'At a glance',
    projectsHeading: 'Projects',
    featuredProjectsHeading: 'Selected projects',
    contactHeading: 'Contact us',
    contactUsButton: 'Contact us',
    viewDetails: 'View details',
    backToProjects: 'Back to projects',
    allRightsReserved: 'All rights reserved.',
  },
  ar: {
    servicesHeading: 'ماذا نقدم',
    featuresHeading: 'لماذا تختارنا',
    processHeading: 'كيف نعمل',
    statsHeading: 'باختصار',
    projectsHeading: 'المشاريع',
    featuredProjectsHeading: 'مشاريع مختارة',
    contactHeading: 'تواصل معنا',
    contactUsButton: 'تواصل معنا',
    viewDetails: 'عرض التفاصيل',
    backToProjects: 'العودة إلى المشاريع',
    allRightsReserved: 'جميع الحقوق محفوظة.',
  },
} as const

export type UiCopyKey = keyof typeof UI_COPY['en']

export function uiCopy(locale: Locale, key: UiCopyKey): string {
  return UI_COPY[locale][key]
}