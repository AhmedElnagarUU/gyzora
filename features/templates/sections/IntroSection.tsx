import { resolveLocalized } from '../lib/text'
import type { SectionProps } from './types'

/**
 * Intro — a welcoming two-column block of the company/about description.
 * Degrades to `null` when there is no body text (no placeholder copy).
 */
export function IntroSection({ content, locale, type }: SectionProps) {
  const { about, company } = content
  const title = resolveLocalized(about.title, locale) || company.name
  const body = resolveLocalized(about.body, locale)
  const tagline = resolveLocalized(company.tagline, locale)

  if (!title && !body) return null

  return (
    <section
      data-section={type}
      className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20"
      style={{ backgroundColor: 'var(--tp-background)' }}
    >
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{
              color: 'var(--tp-foreground)',
              fontFamily: 'var(--tp-font-heading)',
            }}
          >
            {title}
          </h2>
          {tagline ? (
            <p
              className="mb-3 text-sm font-semibold uppercase tracking-wide"
              style={{ color: 'var(--tp-primary)' }}
            >
              {tagline}
            </p>
          ) : null}
        </div>
        {body ? (
          <p
            className="text-lg leading-relaxed"
            style={{ color: 'var(--tp-secondary)' }}
          >
            {body}
          </p>
        ) : null}
      </div>
    </section>
  )
}