import { betterAuth } from 'better-auth'
import { mongodbAdapter } from '@better-auth/mongo-adapter'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/shared/lib/db/mongoose'

function buildAuth(db: Parameters<typeof mongodbAdapter>[0]) {
  return betterAuth({
    // No MongoClient is passed so transactions stay disabled — this keeps
    // signup working on standalone (non-replica-set) MongoDB deployments.
    database: mongodbAdapter(db),

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'CUSTOMER',
          input: false,
        },
        tenantId: {
          type: 'string',
          required: false,
          input: false,
        },
      },
    },

    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            try {
              const { createTenantWithSite } = await import(
                '@/features/tenants/service'
              )
              const { tenant } = await createTenantWithSite({
                name: `${user.name}'s Workspace`,
                slug: `tenant-${user.id}`,
              })
              const { updateUser } = await import('@/features/auth/service')
              await updateUser(user.id, { tenantId: String(tenant._id) })
            } catch (error) {
              console.error('Failed to create tenant for new user:', error)
            }
          },
        },
      },
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },

    appName: 'Gzora',
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  })
}

type AuthInstance = ReturnType<typeof buildAuth>

let cachedAuth: AuthInstance | null = null

/**
 * Better Auth instance (lazy singleton).
 *
 * The MongoDB adapter needs a live `Db` instance, so we await the
 * Mongoose connection before constructing Better Auth. Route handlers,
 * the proxy, and services must call `getAuth()` instead of importing
 * a pre-built instance.
 */
export async function getAuth(): Promise<AuthInstance> {
  if (cachedAuth) {
    return cachedAuth
  }

  await connectToDatabase()

  const db = mongoose.connection.db
  if (!db) {
    throw new Error('MongoDB connection is not established')
  }

  cachedAuth = buildAuth(db)

  return cachedAuth
}
