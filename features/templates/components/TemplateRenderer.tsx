'use client'

import Image from 'next/image'
import type { TemplateDefinition, ImageSlotKey } from '@/features/templates/types'

interface TemplateRendererProps {
  template: TemplateDefinition
  images: Partial<Record<ImageSlotKey, { url: string; alt?: string }>>
  siteName: string
  headline?: string
  subheading?: string
  ctaText?: string
  ctaHref?: string
}

export function TemplateRenderer({
  template,
  images,
  siteName,
  headline = 'Your Professional Website',
  subheading = 'Build beautiful, responsive websites for your business.',
  ctaText = 'Get Started',
  ctaHref = '#contact',
}: TemplateRendererProps) {
  const logo = images.logo
  const hero = images.hero
  const favicon = images.favicon

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Favicon */}
      {favicon && favicon.url && (
        <Image
          src={favicon.url}
          alt={siteName}
          width={32}
          height={32}
          className="hidden"
          unoptimized
        />
      )}

      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {logo ? (
                <Image
                  src={logo.url}
                  alt={siteName}
                  width={160}
                  height={48}
                  className="h-10 w-auto"
                  unoptimized
                />
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {siteName}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex items-center justify-center py-20">
        {hero ? (
          <Image
            src={hero.url}
            alt={headline}
            fill
            className="object-cover brightness-50"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        <div className="relative z-10 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {headline}
          </h1>
          <p className="mb-8 max-w-2xl text-lg">{subheading}</p>
          <a
            href={ctaHref}
            className="inline-block rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700 transition-colors"
          >
            {ctaText}
          </a>
        </div>
      </section>

      {/* Template-specific sections */}
      {template.id === 'real-estate' && (
        <RealEstateSections images={images} />
      )}

      {template.id === 'construction' && (
        <ConstructionSections images={images} />
      )}

      {/* Default footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function RealEstateSections({
  images,
}: {
  images: Partial<Record<ImageSlotKey, { url: string; alt?: string }>>
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="mb-8 text-3xl font-bold text-center">
        Featured Properties
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
          <div className="mb-4 h-48 w-full rounded bg-gray-200" />
          <h3 className="mb-2 font-bold">Property Name</h3>
          <p className="text-sm text-gray-600">
            Description of the featured property listing.
          </p>
        </div>
        <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
          <div className="mb-4 h-48 w-full rounded bg-gray-200" />
          <h3 className="mb-2 font-bold">Property Name</h3>
          <p className="text-sm text-gray-600">
            Description of the featured property listing.
          </p>
        </div>
        <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
          <div className="mb-4 h-48 w-full rounded bg-gray-200" />
          <h3 className="mb-2 font-bold">Property Name</h3>
          <p className="text-sm text-gray-600">
            Description of the featured property listing.
          </p>
        </div>
      </div>
    </section>
  )
}

function ConstructionSections({
  images,
}: {
  images: Partial<Record<ImageSlotKey, { url: string; alt?: string }>>
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="mb-8 text-3xl font-bold text-center">
        Recent Projects
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
          <div className="mb-4 h-48 w-full rounded bg-gray-200" />
          <h3 className="mb-2 font-bold">Project Name</h3>
          <p className="text-sm text-gray-600">
            Project description and highlights.
          </p>
        </div>
        <div className="rounded-lg bg-gray-100 p-6 shadow-sm">
          <div className="mb-4 h-48 w-full rounded bg-gray-200" />
          <h3 className="mb-2 font-bold">Project Name</h3>
          <p className="text-sm text-gray-600">
            Project description and highlights.
          </p>
        </div>
      </div>
    </section>
  )
}
