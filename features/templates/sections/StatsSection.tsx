import { resolveLocalized, uiCopy } from '../lib/text'
import type { SectionProps } from './types'

/**
 * Stats — only rendered when real customer data exists (`content.stats`).
 * Never fabricated: absent or empty stats → section omitted (FR-05, AC-03).
 */
export function StatsSection({ content, locale, type }: SectionProps) {
  const stats = content.stats
  if (!stats?.length) return null

  return (
    <section
      data-section={type}
      className="w-full py-14"
      style={{ backgroundColor: 'var(--tp-primary)' }}
    >
      <div className="mx-auto w-full max-w-7xl px-4">
        <h2
          className="mb-8 text-center text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: 'var(--tp-font-heading)' }}
        >
          {uiCopy(locale, 'statsHeading')}
        </h2>
        <dl className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id}>
              <dd
                className="text-4xl font-bold text-white"
                style={{ fontFamily: 'var(--tp-font-heading)' }}
              >
                {stat.value}
              </dd>
              <dt
                className="mt-1 text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                {resolveLocalized(stat.label, locale)}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}