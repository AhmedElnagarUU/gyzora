import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/shared/lib/auth/session'
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from '@/features/projects/service'
import {
  createProjectSchema,
  updateProjectSchema,
} from '@/features/projects/schema'

/**
 * Project operations are tenant-scoped, so a session without a bound tenant
 * cannot be served (mirrors `features/sites/handlers.ts`).
 */
async function requireTenantContext(req: NextRequest) {
  const ctx = await requireSession(req.headers)
  if (!ctx.tenantId) {
    throw new Error('FORBIDDEN')
  }
  return ctx
}

function errorStatus(message: string): number {
  if (message === 'UNAUTHORIZED') return 401
  if (message === 'FORBIDDEN') return 403
  return 500
}

export async function GET(req: NextRequest) {
  try {
    const ctx = await requireTenantContext(req)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const project = await getProjectById(id, ctx.tenantId)
      if (!project) {
        return NextResponse.json(
          { success: false, error: 'Project not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: project })
    }

    const projects = await getAllProjects(ctx.tenantId)
    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await requireTenantContext(req)
    const body: unknown = await req.json().catch(() => ({}))
    const result = createProjectSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const project = await createProject({ tenantId: ctx.tenantId, ...result.data })
    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const ctx = await requireTenantContext(req)
    const body: unknown = await req.json().catch(() => ({}))
    const result = updateProjectSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { id, ...rest } = result.data
    const project = await updateProject(id, ctx.tenantId, rest)

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ctx = await requireTenantContext(req)
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      )
    }

    await deleteProject(id, ctx.tenantId)
    return NextResponse.json({ success: true, data: { deleted: true } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { success: false, error: message },
      { status: errorStatus(message) }
    )
  }
}
