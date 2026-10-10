import { getTemplate } from '@/features/templates'
import { TemplateConfigContent } from '@/features/templates/components/TemplateConfigContent'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TemplateConfigPage({ params }: Props) {
  const { id } = await params
  const template = getTemplate(id)

  if (!template) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Template not found.</p>
        <Link href="/dashboard/templates" className="text-primary-600">
          ← Back to templates
        </Link>
      </div>
    )
  }

  return <TemplateConfigContent templateId={id} />
}
