import type { Locale } from '../types'
import { resolveLocalized } from '@/shared/i18n'
export { resolveLocalized }

/**
 * Localized-text + UI-copy helpers shared by the section components.
 *
 * `resolveLocalized` is the single shared implementation in `shared/i18n`
 * (fixed in M-018 — LOCALIZATION.md §4): `ar` → `en` → empty string.
 * Re-exported here so sections keep importing from `../lib/text`.
 *
 * `uiCopy` returns structural UI labels (buttons, headings, footer) in the
 * active locale. These are static interface labels — never customer content —
 * so they are not placeholder text (M-014 AC-03, TEMPLATE_SYSTEM §8).
 */

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