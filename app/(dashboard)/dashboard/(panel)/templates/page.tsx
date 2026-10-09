'use client'

import { TEMPLATES, getTemplate } from '@/features/templates'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function TemplateSelectionPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Template & Theme</h1>
        <p className="mt-1 text-sm text-gray-600">
          Choose a template for your site and customize the theme.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {TEMPLATES.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </>
  )
}

function TemplateCard({ template }: { template: any }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
          {template.slug}
        </span>
      </div>

      <p className="mb-4 text-sm text-gray-600">{template.description}</p>

      <div className="mb-4 rounded-lg bg-gray-100 h-40 flex items-center justify-center">
        <span className="text-xs text-gray-400">Template preview: {template.name}</span>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Image Slots
        </h3>
        <div className="space-y-1">
          {template.imageSlots.map((slot: any) => (
            <div key={slot.key} className="text-sm text-gray-600">
              <span className="font-medium">{slot.label}</span>
              {slot.required && <span className="text-red-500">*</span>}
              <span className="text-gray-400"> — {slot.description}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={`/dashboard/templates/${template.id}/configure`}
        className="block w-full text-center rounded-lg bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        Configure Template
      </Link>
    </div>
  )
}
