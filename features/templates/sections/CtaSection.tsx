import { resolveLocalized, uiCopy } from '../lib/text'
import type { SectionProps } from './types'

/**
 * CTA — a closing call-to-action panel derived from real content
 * (company name/description), linking to the contact section. Omitted when
 * there is no body copy (no placeholder text).
 */
export function CtaSection({ content, locale, type }: SectionProps) {
  const { company } = content
  const title = company.name
  const body = resolveLocalized(company.description, locale)
  if (!title && !body) return null

  return (
    <section
      data-section={type}
      className="w-full py-16 md:py-20"
      style={{ backgroundColor: 'var(--tp-primary)' }}
    >
      <div className="mx-auto w-full max-w-4xl px-4 text-center">
        <h2
          className="mb-3 text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: 'var(--tp-font-heading)' }}
        >
          {title}
        </h2>
        {body ? (
          <p
            className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {body}
          </p>
        ) : null}
        <a
          href="#contact"
          className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ color: 'var(--tp-primary)' }}
        >
          {uiCopy(locale, 'contactUsButton')}
        </a>
      </div>
    </section>
  )
}