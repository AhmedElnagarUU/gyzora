import { resolveLocalized } from '../lib/text'
import { ImageWithFallback } from '../components/ImageWithFallback'
import type { SectionProps } from './types'

/**
 * About body — the about story with optional mission/vision and image.
 * No body text → section omitted.
 */
export function AboutBodySection({ content, locale, type }: SectionProps) {
  const { about } = content
  const title = resolveLocalized(about.title, locale)
  const body = resolveLocalized(about.body, locale)
  const mission = resolveLocalized(about.mission, locale)
  const vision = resolveLocalized(about.vision, locale)

  if (!body && !mission && !vision) return null

  return (
    <section
      data-section={type}
      className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20"
      style={{ backgroundColor: 'var(--tp-background)' }}
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        {about.image?.url ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border" style={{ borderColor: 'var(--tp-border)' }}>
            <ImageWithFallback
              src={about.image.url}
              alt={resolveLocalized(about.image.alt, locale) || title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div>
          {title ? (
            <h2
              className="mb-4 text-3xl font-bold tracking-tight"
              style={{
                color: 'var(--tp-foreground)',
                fontFamily: 'var(--tp-font-heading)',
              }}
            >
              {title}
            </h2>
          ) : null}
          {body ? (
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--tp-secondary)' }}
            >
              {body}
            </p>
          ) : null}

          {(mission || vision) && (body ? <div className="mt-6" /> : null)}

          {mission ? (
            <div className="mb-4 rounded-xl border p-5" style={{ borderColor: 'var(--tp-border)', backgroundColor: 'var(--tp-card)' }}>
              <h3
                className="mb-1 text-sm font-semibold uppercase tracking-wide"
                style={{ color: 'var(--tp-primary)' }}
              >
                {locale === 'ar' ? 'مهمتنا' : 'Our mission'}
              </h3>
              <p style={{ color: 'var(--tp-foreground)' }}>{mission}</p>
            </div>
          ) : null}

          {vision ? (
            <div className="rounded-xl border p-5" style={{ borderColor: 'var(--tp-border)', backgroundColor: 'var(--tp-card)' }}>
              <h3
                className="mb-1 text-sm font-semibold uppercase tracking-wide"
                style={{ color: 'var(--tp-primary)' }}
              >
                {locale === 'ar' ? 'رؤيتنا' : 'Our vision'}
              </h3>
              <p style={{ color: 'var(--tp-foreground)' }}>{vision}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}