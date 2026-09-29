import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import type { LifeItem } from '@/lib/content'
import { useI18n } from '@/lib/i18n'
import { asset, getAsset, srcSet } from '@/lib/media'
import { getLenis } from '@/lib/scroll'
import { track } from '@/lib/analytics'
import { IconArrowLeft, IconArrowRight, IconClose } from './ui/Icons'

/** Full-screen photo/video viewer: arrows, swipe, Esc. */
export default function Lightbox({ items, index, onClose, onIndex }: { items: LifeItem[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const { t } = useI18n()
  const item = items[index]
  const label = t('life.photo')
  const [dir, setDir] = useState(0)
  const start = useRef<number | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const cb = useRef({ onClose, onIndex, index })
  cb.current = { onClose, onIndex, index }

  const go = (d: number) => {
    setDir(d)
    onIndex((index + d + items.length) % items.length)
  }

  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null
    closeBtn.current?.focus()
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      const { onClose, onIndex, index } = cb.current
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') {
        setDir(1)
        onIndex((index + 1) % items.length)
      }
      if (e.key === 'ArrowLeft') {
        setDir(-1)
        onIndex((index - 1 + items.length) % items.length)
      }
    }
    addEventListener('keydown', onKey)
    return () => {
      removeEventListener('keydown', onKey)
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      returnTo?.focus?.({ preventScroll: true })
    }
  }, [items.length])

  const entry = getAsset(item.src)

  return (
    <m.div
      className="fixed inset-0 z-80 flex flex-col bg-black/92 text-white backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onPointerDown={(e) => (start.current = e.clientX)}
      onPointerUp={(e) => {
        if (start.current == null) return
        const dx = e.clientX - start.current
        start.current = null
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
      }}
      data-lenis-prevent
    >
      <div className="flex items-center justify-between p-4">
        <span className="font-mono text-xs text-white/60">
          {index + 1} / {items.length}
        </span>
        <button ref={closeBtn} type="button" onClick={onClose} className="grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label={t('life.close')}>
          <IconClose />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <m.div
            key={item.src}
            custom={dir}
            className="flex h-full max-h-full w-full items-center justify-center"
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {item.kind === 'video' ? (
              <video
                src={asset(item.src)}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full rounded-xl"
                aria-label={label}
                onPlay={() => track('video_play', { id: item.src })}
              />
            ) : (
              <picture>
                {entry && srcSet(entry, 'avif') && <source type="image/avif" srcSet={srcSet(entry, 'avif')} sizes="100vw" />}
                {entry && srcSet(entry, 'webp') && <source type="image/webp" srcSet={srcSet(entry, 'webp')} sizes="100vw" />}
                <img src={asset(item.src)} alt={label} className="max-h-[calc(100dvh-220px)] max-w-full rounded-xl object-contain" draggable={false} />
              </picture>
            )}
          </m.div>
        </AnimatePresence>

        {items.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute left-3 hidden size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:grid" aria-label={t('life.prev')}>
              <IconArrowLeft />
            </button>
            <button type="button" onClick={() => go(1)} className="absolute right-3 hidden size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 md:grid" aria-label={t('life.next')}>
              <IconArrowRight />
            </button>
          </>
        )}
      </div>

      <div className="h-16" />
    </m.div>
  )
}
