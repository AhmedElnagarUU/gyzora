import Link from 'next/link'

export function CTASection() {
  return (
    <section className="bg-primary-600 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Build Your Professional Website?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            Join businesses using Gzora to create stunning websites. Start free, upgrade when you&apos;re ready.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="w-full rounded-lg bg-white px-8 py-3 text-base font-medium text-primary-600 hover:bg-primary-50 transition-colors sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/signin"
              className="w-full rounded-lg border border-white/30 px-8 py-3 text-base font-medium text-white hover:bg-white/10 transition-colors sm:w-auto"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
