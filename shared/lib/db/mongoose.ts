import mongoose from 'mongoose'

/**
 * NOTE: Environment variables are read lazily inside `connectToDatabase()`
 * instead of at module load. Reading them at import time caused `next build`
 * to throw or hang while collecting page data (models are imported by routes).
 */

/**
 * Global is used to cache the MongoDB connection across hot reloads in development.
 * This prevents creating a new connection on every request.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var _mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global._mongooseCache || { conn: null, promise: null }

if (!global._mongooseCache) {
  global._mongooseCache = cached
}

/**
 * Connect to MongoDB using Mongoose.
 * Uses a cached connection to avoid creating multiple connections.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    const dbName = process.env.MONGODB_DB_NAME || 'gyzora'

    cached.promise = mongoose.connect(uri, {
      dbName,
      bufferCommands: false,
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

/**
 * Disconnect from MongoDB.
 * Useful for testing and graceful shutdown.
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await cached.conn.disconnect()
    cached.conn = null
    cached.promise = null
  }
}