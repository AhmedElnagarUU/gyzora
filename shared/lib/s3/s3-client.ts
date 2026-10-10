import { S3 } from 'aws-sdk'

/**
 * The S3 client is built lazily on first use so that importing this module
 * (e.g. from a schema or route that `next build` evaluates during page-data
 * collection) never throws when S3 env vars are absent.
 */
let s3Instance: S3 | null = null

function getS3(): S3 {
  if (s3Instance) return s3Instance

  const region = process.env.S3_REGION
  const accessKeyId = process.env.S3_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

  if (!process.env.S3_BUCKET || !region || !accessKeyId || !secretAccessKey) {
    throw new Error('S3 environment variables are not configured')
  }

  s3Instance = new S3({
    region,
    credentials: { accessKeyId, secretAccessKey },
  })

  return s3Instance
}

/**
 * Generate a pre-signed URL for uploading a file to S3.
 * The key is automatically scoped to the tenant.
 */
export function getPresignedUploadUrl(
  tenantId: string,
  key: string,
  contentType: string,
  expiresIn = 300
): string {
  const fullKey = `tenants/${tenantId}/${key}`

  return getS3().getSignedUrl('putObject', {
    Bucket: process.env.S3_BUCKET,
    Key: fullKey,
    ContentType: contentType,
    ACL: 'public-read',
    Expires: expiresIn,
  })
}

/**
 * Generate the public URL for a stored S3 object.
 */
export function getPublicUrl(key: string): string {
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL
  if (publicBaseUrl) {
    return `${publicBaseUrl}/${key}`
  }
  return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`
}

/**
 * Allowed MIME types for uploads.
 */
export const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
]

/**
 * Maximum file size (10 MB).
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024
