import { uiCopy } from '../lib/text'
import { ImageWithFallback } from '../components/ImageWithFallback'
import type { SectionProps } from './types'

/**
 * Project detail — one project's full story: cover, gallery, category,
 * description, and a link back to the projects page. Renders the project
 * selected by `activeProjectSlug`, or the first project. No projects →
 * section omitted.
 */
export function ProjectDetailSection({
  projects,
  locale,
  page,
  activeProjectSlug,
  type,
}: SectionProps) {
  if (!projects.length) return null

  const project =
    projects.find((p) => p.slug === activeProjectSlug) ?? projects[0]
  const gallery = project.gallery.length
    ? project.gallery
    : project.coverImage
      ? [project.coverImage]
      : []
  const projectsPath = page.slug.replace('/[slug]', '') || '/projects'

  return (
    <section
      data-section={type}
      className="mx-auto w-full max-w-7xl px-4 py-16 md:py-20"
      style={{ backgroundColor: 'var(--tp-background)' }}
    >
      <a
        href={projectsPath}
        className="mb-6 inline-block text-sm font-semibold"
        style={{ color: 'var(--tp-primary)' }}
      >
        ← {uiCopy(locale, 'backToProjects')}
      </a>

      <div className="mb-8">
        {project.category ? (
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--tp-primary)' }}
          >
            {project.category}
          </p>
        ) : null}
        <h1
          className="text-3xl font-bold tracking-tight md:text-4xl"
          style={{
            color: 'var(--tp-foreground)',
            fontFamily: 'var(--tp-font-heading)',
          }}
        >
          {project.title}
        </h1>
      </div>

      {gallery.length ? (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((url, index) => (
            <div
              key={`${project.id}-${index}`}
              className={`relative overflow-hidden rounded-xl border ${
                index === 0 ? 'sm:col-span-2 lg:col-span-3 aspect-[16/7]' : 'aspect-[4/3]'
              }`}
              style={{ borderColor: 'var(--tp-border)' }}
            >
              <ImageWithFallback
                src={url}
                alt={project.title}
                fill
                priority={index === 0}
                sizes={index === 0 ? '100vw' : '(min-width: 1024px) 33vw, 100vw'}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}

      <p
        className="max-w-3xl text-lg leading-relaxed"
        style={{ color: 'var(--tp-secondary)' }}
      >
        {project.description}
      </p>
    </section>
  )
}