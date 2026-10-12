'use client'

import { useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'

/**
 * `next/image` wrapper with graceful degradation (M-014 AC-04, FR-08):
 * - no `src` → styled placeholder, never an empty `<img>`;
 * - error while loading → same styled placeholder (swaps via `onError`);
 * - `unoptimized` so arbitrary media URLs (S3 presigned, Pexels, uploads)
 *   render without remote-pattern config (TEMPLATE_SYSTEM §7);
 * - placeholder carries the localized `alt` as its accessible label.
 */
interface ImageWithFallbackProps {
  src?: string
  alt: string
  width?: number
  height?: number
  /** Fill the nearest `position: relative` parent (hero backgrounds). */
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false)

  const showImage = Boolean(src) && !failed

  if (!showImage) {
    const style: CSSProperties | undefined = fill
      ? { position: 'absolute', inset: 0 }
      : width && height
        ? { width, height }
        : undefined

    return (
      <span
        role="img"
        aria-label={alt}
        data-image-fallback
        className={[
          'flex items-center justify-center',
          'bg-[var(--tp-card)] text-[var(--tp-secondary)]',
          className,
        ].join(' ')}
        style={style}
      >
        <ImageOff className="h-8 w-8" aria-hidden />
      </span>
    )
  }

  return (
    <Image
      src={src as string}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      priority={priority}
      unoptimized
      className={className}
      onError={() => setFailed(true)}
    />
  )
}