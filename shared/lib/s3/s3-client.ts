import AWS, { S3 } from 'aws-sdk'

const S3_BUCKET = process.env.S3_BUCKET
const S3_REGION = process.env.S3_REGION
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY
const S3_PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL

if (!S3_BUCKET || !S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
  throw new Error('S3 environment variables are not configured')
}

const s3Instance = new S3({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
})

export { s3Instance, S3_BUCKET, S3_PUBLIC_BASE_URL }

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

  return s3Instance.getSignedUrl('putObject', {
    Bucket: S3_BUCKET,
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
  if (S3_PUBLIC_BASE_URL) {
    return `${S3_PUBLIC_BASE_URL}/${key}`
  }
  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`
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
