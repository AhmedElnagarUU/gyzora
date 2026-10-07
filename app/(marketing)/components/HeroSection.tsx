import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Professional Websites for
            <span className="text-primary-600"> Real Estate & Construction</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Create and manage stunning websites for your business. Choose a template, add your projects and content,
            and publish in minutes — no coding required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="w-full rounded-lg bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 transition-colors sm:w-auto"
            >
              Start Building — It&apos;s Free
            </Link>
            <Link
              href="#templates"
              className="w-full rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors sm:w-auto"
            >
              View Templates
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required</p>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 flex justify-center">
          <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <p className="mt-4 text-sm font-medium text-primary-700">Your website preview will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
