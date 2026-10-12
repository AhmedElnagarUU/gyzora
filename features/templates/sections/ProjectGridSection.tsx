import { uiCopy } from '../lib/text'
import { ImageWithFallback } from '../components/ImageWithFallback'
import type { SectionProps } from './types'

/**
 * Project grid — every project as a card. Empty projects → section omitted.
 */
export function ProjectGridSection({ projects, locale, type }: SectionProps) {
  if (!projects.length) return null

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
        {uiCopy(locale, 'projectsHeading')}
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <a
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group overflow-hidden rounded-xl border transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--tp-card)',
              borderColor: 'var(--tp-border)',
            }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src={project.coverImage}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              {project.category ? (
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--tp-primary)' }}
                >
                  {project.category}
                </p>
              ) : null}
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: 'var(--tp-foreground)' }}
              >
                {project.title}
              </h3>
              <p
                className="mb-3 text-sm leading-relaxed line-clamp-2"
                style={{ color: 'var(--tp-secondary)' }}
              >
                {project.description}
              </p>
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--tp-primary)' }}
              >
                {uiCopy(locale, 'viewDetails')} →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}