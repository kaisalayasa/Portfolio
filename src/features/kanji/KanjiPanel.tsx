import { lazy, Suspense, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { languages } from '@/content/languages'
import { useI18n } from '@/lib/i18n'
import { asset } from '@/lib/media'
import { Media } from '@/components/ui/Media'
import { RevealItem } from '@/components/ui/Motion'
import { IconZoom } from '@/components/ui/Icons'

const ZoomViewer = lazy(() => import('./ZoomViewer'))

/** The Kanji Grid add-on export, framed, with a deep-zoom viewer. */
export function KanjiPanel({ className }: { className?: string }) {
  const { t } = useI18n()
  const [zoom, setZoom] = useState(false)
  const { image, known } = languages.kanji

  return (
    <RevealItem className={className}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h3 className="font-display text-3xl">{t('languages.kanjiTitle')}</h3>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-5xl leading-none text-accent md:text-6xl">{known}</span>
          <span className="text-sm text-muted">{t('languages.kanjiUnit')}</span>
        </p>
      </div>
      <button
        type="button"
        className="group relative block w-full overflow-hidden rounded-2xl border-10 border-elevated bg-white shadow-[inset_0_0_0_1px_var(--border)]"
        onClick={() => setZoom(true)}
        data-cursor="view"
        aria-label={t('languages.kanjiZoom')}
      >
        <Media src={image} alt={t('languages.kanjiTitle')} aspect="16/10" sizes="(min-width: 1024px) 760px, 100vw" />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white opacity-90 transition-opacity group-hover:opacity-100">
          <IconZoom size={14} /> {t('languages.kanjiZoom')}
        </span>
      </button>
      <Suspense fallback={null}>
        <AnimatePresence>{zoom && <ZoomViewer key="zoom" src={asset(image)} alt={t('languages.kanjiTitle')} onClose={() => setZoom(false)} />}</AnimatePresence>
      </Suspense>
    </RevealItem>
  )
}
