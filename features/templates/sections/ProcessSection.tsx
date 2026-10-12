import { resolveLocalized, uiCopy } from '../lib/text'
import type { SectionProps } from './types'

/**
 * Process — numbered steps of how the company works (`content.process`).
 * Absent or empty steps → section omitted.
 */
export function ProcessSection({ content, locale, type }: SectionProps) {
  const steps = content.process
  if (!steps?.length) return null

  return (
    <section
      data-section={type}
      className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20"
      style={{ backgroundColor: 'var(--tp-background)' }}
    >
      <h2
        className="mb-10 text-center text-3xl font-bold tracking-tight"
        style={{
          color: 'var(--tp-foreground)',
          fontFamily: 'var(--tp-font-heading)',
        }}
      >
        {uiCopy(locale, 'processHeading')}
      </h2>
      <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li
            key={step.id}
            className="relative rounded-xl border p-6"
            style={{
              backgroundColor: 'var(--tp-card)',
              borderColor: 'var(--tp-border)',
            }}
          >
            <span
              className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: 'var(--tp-primary)', color: '#ffffff' }}
            >
              {step.step}
            </span>
            <h3
              className="mb-2 text-lg font-semibold"
              style={{ color: 'var(--tp-foreground)' }}
            >
              {resolveLocalized(step.title, locale)}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--tp-secondary)' }}
            >
              {resolveLocalized(step.description, locale)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}