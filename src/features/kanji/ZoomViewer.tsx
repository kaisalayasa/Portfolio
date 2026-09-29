import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { m } from 'motion/react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { useI18n } from '@/lib/i18n'
import { getLenis } from '@/lib/scroll'
import { IconClose } from '@/components/ui/Icons'

/** Full-screen deep-zoom viewer (scroll / pinch to zoom, drag to pan). */
export default function ZoomViewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const { t } = useI18n()
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close.current()
    addEventListener('keydown', onKey)
    return () => {
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      removeEventListener('keydown', onKey)
      returnTo?.focus?.({ preventScroll: true })
    }
  }, [])

  // Portaled to <body> so no card's stacking context or transform can clip it or draw over it.
  return createPortal(
    <m.div
      className="fixed inset-0 z-80 bg-[#05070c]"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-lenis-prevent
    >
      <TransformWrapper minScale={0.5} maxScale={12} initialScale={1} centerOnInit wheel={{ step: 0.15 }} doubleClick={{ mode: 'zoomIn', step: 0.8 }}>
        <TransformComponent wrapperStyle={{ width: '100vw', height: '100dvh' }} contentStyle={{ width: '100vw', height: '100dvh', display: 'grid', placeItems: 'center' }}>
          <img src={src} alt={alt} className="max-h-[92dvh] max-w-[96vw] object-contain" draggable={false} />
        </TransformComponent>
      </TransformWrapper>
      <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 font-mono text-xs text-white/80">{t('languages.kanjiHint')}</p>
      <button
        type="button"
        onClick={onClose}
        autoFocus
        className="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
        aria-label={t('common.close')}
      >
        <IconClose />
      </button>
    </m.div>,
    document.body,
  )
}
