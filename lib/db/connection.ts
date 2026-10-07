import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'gyzora'

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set')
}

/**
 * Global is used to cache the MongoDB connection across hot reloads in development.
 * This prevents creating a new connection on every request.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
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
    cached.promise = mongoose.connect(MONGODB_URI!, {
      dbName: MONGODB_DB_NAME,
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
