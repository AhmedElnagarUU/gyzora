import { resolveLocalized, uiCopy } from '../lib/text'
import { getIcon } from '../lib/icons'
import type { SectionProps } from './types'

/**
 * Features — grid of differentiator cards (icon, title, description) from
 * `content.features`. Empty list → section omitted.
 */
export function FeaturesSection({ content, locale, type }: SectionProps) {
  const items = content.features
  if (!items.length) return null

  return (
    <section
      data-section={type}
      className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20"
      style={{ backgroundColor: 'var(--tp-card)' }}
    >
      <h2
        className="mb-10 text-center text-3xl font-bold tracking-tight"
        style={{
          color: 'var(--tp-foreground)',
          fontFamily: 'var(--tp-font-heading)',
        }}
      >
        {uiCopy(locale, 'featuresHeading')}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = getIcon(item.icon)
          return (
            <article
              key={item.id}
              className="rounded-xl border p-6"
              style={{
                backgroundColor: 'var(--tp-background)',
                borderColor: 'var(--tp-border)',
              }}
            >
              <span
                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: 'var(--tp-primary)',
                  color: '#ffffff',
                }}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: 'var(--tp-foreground)' }}
              >
                {resolveLocalized(item.title, locale)}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--tp-secondary)' }}
              >
                {resolveLocalized(item.description, locale)}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}