import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-sm">
                G
              </div>
              <span className="text-xl font-bold text-gray-900">Gzora</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 max-w-md">
              Professional websites for real estate, construction, contracting, interior design, and architecture
              businesses. Build your online presence in minutes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#features" className="text-sm text-gray-500 hover:text-gray-700">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#templates" className="text-sm text-gray-500 hover:text-gray-700">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-gray-500 hover:text-gray-700">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Gzora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
