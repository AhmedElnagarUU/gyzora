import { z } from 'zod'

/**
 * Server environment configuration (DEC-008, `CODE_RULES.md` §10/§16).
 *
 * Validation is **lazy**: `getEnv()` parses `process.env` on first use and
 * caches the token. This is deliberate — Next.js imports route/handler modules
 * during `next build`, and validating at import time made the build require
 * secrets. Nothing here runs until a runtime code path asks for a value.
 *
 * Only `NEXT_PUBLIC_*` values may reach client code; everything else is a
 * server secret and must never be read in a component or client bundle.
 */

/** `.env` files commonly declare optional keys as `KEY=` (empty). Treat empty
 * strings as "not set" so optional vars validate cleanly. */
const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value)

const optionalString = z.preprocess(emptyToUndefined, z.string().min(1).optional())
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional())

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // ── Required ────────────────────────────────────────────────
  MONGODB_URI: z.preprocess(
    emptyToUndefined,
    z.string().min(1, 'MONGODB_URI is required')
  ),
  BETTER_AUTH_SECRET: z.preprocess(
    emptyToUndefined,
    z.string().min(1, 'BETTER_AUTH_SECRET is required')
  ),

  // ── Optional / defaulted ────────────────────────────────────
  MONGODB_DB_NAME: optionalString,
  BETTER_AUTH_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default('http://localhost:3000')
  ),

  // S3 is required only when media uploads are used; the S3 client validates it.
  S3_BUCKET: optionalString,
  S3_REGION: optionalString,
  S3_ACCESS_KEY_ID: optionalString,
  S3_SECRET_ACCESS_KEY: optionalString,
  S3_PUBLIC_BASE_URL: optionalUrl,

  // Optional integrations — the app must run without them (DEC-006, §16).
  PEXELS_API_KEY: optionalString,
  POLAR_ACCESS_TOKEN: optionalString,
  POLAR_ORGANIZATION_ID: optionalString,
  POLAR_WEBHOOK_SECRET: optionalString,
  POLAR_PRODUCT_ID_PRO: optionalString,
  POLAR_SERVER: optionalString,
  AI_API_BASE_URL: optionalUrl,
  AI_API_KEY: optionalString,
  AI_MODEL: optionalString,
  GEMINI_KEY: optionalString,

  // Public var mirrored server-side; client code reads `process.env.NEXT_PUBLIC_*`.
  NEXT_PUBLIC_APP_URL: optionalUrl,
})

export type Env = z.infer<typeof serverSchema>

let cachedEnv: Env | null = null

/**
 * Validate a source of environment variables. Exported so tests (M-025) can
 * exercise missing/invalid cases without touching the real process env.
 */
export function validateEnv(source: NodeJS.ProcessEnv = process.env): Env {
  if (typeof window !== 'undefined') {
    throw new Error('shared/lib/env.ts is server-only and cannot run in the browser')
  }

  const parsed = serverSchema.safeParse(source)

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n')
    throw new Error(
      `Invalid environment configuration. Fix the variables below (see .env.example):\n${details}`
    )
  }

  return parsed.data
}

/** Validated server env, parsed once on first access. */
export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = validateEnv()
  }
  return cachedEnv
}

/**
 * Ergonomic accessor: `env.MONGODB_URI`. Backed by the lazy `getEnv()` so that
 * merely importing this module never triggers validation (keeps `next build`
 * independent of secrets).
 */
export const env = new Proxy({} as Env, {
  get(_target, property: string | symbol) {
    return getEnv()[property as keyof Env]
  },
})

/** Client-safe values. Never put secrets here. */
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const
