import { z } from 'zod'
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '@/shared/lib/s3/s3-client'

export const createMediaSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  contentType: z
    .string()
    .refine(
      (val) => ALLOWED_MIME_TYPES.includes(val),
      'File type not allowed. Allowed: PNG, JPEG, GIF, WebP'
    ),
  size: z
    .number()
    .max(MAX_FILE_SIZE, `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`),
})
