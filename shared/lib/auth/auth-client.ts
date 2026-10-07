import { betterAuth } from 'better-auth'
import { mongodbAdapter } from '@better-auth/mongo-adapter'
import mongoose from 'mongoose'

/**
 * Better Auth instance.
 *
 * NOTE: better-auth requires the mongodb adapter, which in turn needs
 * `mongoose.connection.db` to be available. Call `connectToDatabase()`
 * in shared/lib/db/mongoose before importing this module (e.g. from
 * a route handler or middleware that is guaranteed to run after the
 * DB connection is established).
 */
export const auth = betterAuth({
  database: mongodbAdapter(
    mongoose.connection.db as never,
    {
      client: (mongoose.connection as any).getClient(),
    }
  ),

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
