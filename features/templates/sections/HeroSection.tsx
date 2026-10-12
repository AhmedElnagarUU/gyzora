import { resolveLocalized, uiCopy } from '../lib/text'
import { ImageWithFallback } from '../components/ImageWithFallback'
import type { SectionProps } from './types'

/**
 * Hero — full-width banner with the company tagline/description over the
 * hero slot image (or a clean token-colored panel when no image is set).
 * Never renders placeholder copy: no headline/body → section omitted.
 */
export function HeroSection({ content, locale, type }: SectionProps) {
  const { company, images } = content
  const headline = resolveLocalized(company.tagline, locale) || company.name
  const body = resolveLocalized(company.description, locale)
  if (!headline && !body) return null

  const bg = images.hero ?? images['hero-mobile']
  const hasBg = Boolean(bg)
  const foreground = hasBg ? '#ffffff' : 'var(--tp-foreground)'

  return (
    <section
      data-section={type}
      className="relative flex min-h-[70vh] items-center overflow-hidden"
      style={{ backgroundColor: 'var(--tp-background)' }}
    >
      {hasBg && bg ? (
        <ImageWithFallback
          src={bg.url}
          alt={resolveLocalized(bg.alt, locale) || headline}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      {hasBg ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundColor:
              'color-mix(in srgb, var(--tp-foreground) 55%, transparent)',
          }}
        />
      ) : null}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 text-center">
        <h1
          className="mx-auto mb-4 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl"
          style={{
            color: foreground,
            fontFamily: 'var(--tp-font-heading)',
          }}
        >
          {headline}
        </h1>
        {body ? (
          <p
            className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed"
            style={{ color: foreground }}
          >
            {body}
          </p>
        ) : null}
        <a
          href="#contact"
          className="inline-block rounded-lg px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--tp-primary)', color: '#ffffff' }}
        >
          {uiCopy(locale, 'contactUsButton')}
        </a>
      </div>
    </section>
  )
}