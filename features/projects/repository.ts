import { connectToDatabase } from '@/shared/lib/db/mongoose'
import { Project } from '@/features/projects/model'

export async function findProjectsByTenant(tenantId: string) {
  await connectToDatabase()
  return Project.find({ tenantId }).sort({ order: -1, createdAt: -1 }).lean()
}

export async function findProjectByIdAndTenant(
  id: string,
  tenantId: string
) {
  await connectToDatabase()
  return Project.findOne({ _id: id, tenantId: tenantId as any }).lean()
}

export async function createProjectRecord(data: {
  tenantId: string
  title: string
  description: string
  slug: string
  category: string
  order: number
  status: string
  seoMetadata?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
  images?: Array<{
    key: string
    url: string
    alt?: string
    mimeType?: string
  }>
}) {
  await connectToDatabase()
  return Project.create(data)
}

export async function updateProjectRecord(
  id: string,
  tenantId: string,
  data: Partial<{
    title: string
    description: string
    slug: string
    category: string
    order: number
    status: string
    seoMetadata: {
      title?: string
      description?: string
      keywords?: string[]
      ogImage?: string
    }
    images: Array<{
      key: string
      url: string
      alt?: string
      mimeType?: string
    }>
  }>
) {
  await connectToDatabase()
  return Project.findOneAndUpdate(
    { _id: id, tenantId: tenantId as any },
    { $set: data },
    { new: true }
  ).lean()
}

export async function deleteProject(id: string, tenantId: string) {
  await connectToDatabase()
  return Project.deleteOne({ _id: id, tenantId: tenantId as any })
}
