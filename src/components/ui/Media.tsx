import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { asset, getAsset, srcSet } from '@/lib/media'
import { cn } from '@/lib/cn'

type MediaProps = {
  src: string
  alt: string
  className?: string
  /** CSS aspect-ratio reserved before load, e.g. '16/9'. Defaults to the file's own ratio. */
  aspect?: string
  sizes?: string
  priority?: boolean
  imgClassName?: string
  /** CSS object-position */
  focus?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Optimized image (AVIF/WebP srcsets + blur-up placeholder from the media manifest). Renders nothing if the file is missing. */
export function Media({ src, alt, className, aspect, sizes = '(min-width: 1024px) 50vw, 100vw', priority, imgClassName, focus, style, children }: MediaProps) {
  const [loaded, setLoaded] = useState(false)
  const img = useRef<HTMLImageElement>(null)
  // A prerendered <img> can finish loading before React hydrates and attaches onLoad.
  useEffect(() => {
    if (img.current?.complete) setLoaded(true)
  }, [])
  const entry = getAsset(src)
  if (!entry) return null

  const wrapStyle: CSSProperties = { aspectRatio: aspect ?? (entry.w && entry.h ? `${entry.w}/${entry.h}` : undefined), ...style }

  if (entry.kind === 'video') {
    return (
      <div className={cn('relative overflow-hidden', className)} style={wrapStyle}>
        <video className={cn('h-full w-full object-cover', imgClassName)} src={asset(src)} muted loop playsInline autoPlay aria-label={alt} />
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ ...wrapStyle, backgroundImage: entry.blur && !loaded ? `url(${entry.blur})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <picture>
        {srcSet(entry, 'avif') && <source type="image/avif" srcSet={srcSet(entry, 'avif')} sizes={sizes} />}
        {srcSet(entry, 'webp') && <source type="image/webp" srcSet={srcSet(entry, 'webp')} sizes={sizes} />}
        <img
          ref={img}
          src={asset(src)}
          alt={alt}
          width={entry.w}
          height={entry.h}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // React 18 only passes the lowercase attribute through.
          {...{ fetchpriority: priority ? 'high' : 'auto' }}
          onLoad={() => setLoaded(true)}
          style={focus ? { objectPosition: focus } : undefined}
          className={cn('h-full w-full object-cover transition-opacity duration-500', loaded || priority ? 'opacity-100' : 'opacity-0', imgClassName)}
        />
      </picture>
      {children}
    </div>
  )
}
