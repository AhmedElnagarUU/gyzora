import Link from 'next/link'

const templates = [
  {
    name: 'Real Estate Pro',
    description: 'Showcase properties with elegant galleries and detailed listings.',
    category: 'Real Estate',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Construction Plus',
    description: 'Highlight your construction projects with before/after galleries.',
    category: 'Construction',
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: 'Interior Design',
    description: 'Beautiful portfolio-focused template for interior designers.',
    category: 'Interior Design',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Architecture Studio',
    description: 'Minimal, modern template for architecture firms.',
    category: 'Architecture',
    color: 'from-gray-700 to-gray-800',
  },
]

export function TemplatesSection() {
  return (
    <section id="templates" className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Professional Templates for Your Industry
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Start with a template designed for your business type. Customize colors, fonts, and content to match your
            brand.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <div
              key={template.name}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className={`aspect-[4/3] bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                <div className="text-center text-white">
                  <div className="mx-auto h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="mt-2 text-xs font-medium opacity-80">{template.category}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{template.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Browse All Templates
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
