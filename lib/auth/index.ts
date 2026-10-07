import { betterAuth } from 'better-auth'
import { mongodbAdapter } from '@better-auth/mongo-adapter'
import mongoose from 'mongoose'

export const auth = betterAuth({
  database: mongodbAdapter(
    mongoose.connection.db!,
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
            const { createTenantWithSite } = await import('@/lib/services/tenant-service')
            const { tenant } = await createTenantWithSite({
              name: `${user.name}'s Workspace`,
              slug: `tenant-${user.id}`,
            })

            const { updateUser } = await import('@/lib/auth/user-actions')
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