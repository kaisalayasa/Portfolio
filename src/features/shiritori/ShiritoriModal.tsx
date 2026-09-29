import { useEffect } from 'react'
import { m } from 'motion/react'
import { useI18n } from '@/lib/i18n'
import { ui } from '@/lib/store'
import { getLenis } from '@/lib/scroll'
import { Seal } from '@/components/ui/Seal'
import { IconClose } from '@/components/ui/Icons'
import { ShiritoriGame } from './ShiritoriGame'

/** Opened by typing "shiritori" anywhere, or from the ⌘K palette. */
export default function ShiritoriModal() {
  const { t } = useI18n()
  const close = () => ui.set((s) => ({ ...s, shiritori: false }))

  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null
    getLenis()?.stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    addEventListener('keydown', onKey)
    return () => {
      getLenis()?.start()
      removeEventListener('keydown', onKey)
      returnTo?.focus?.({ preventScroll: true })
    }
  }, [])

  return (
    <m.div
      className="fixed inset-0 z-70 grid place-items-center bg-black/55 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={close}
    >
      <m.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shiritori-title"
        className="card w-full max-w-lg p-6 md:p-8"
        initial={{ y: 24, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start gap-4">
          <Seal text="しり" size={44} />
          <div className="flex-1">
            <h2 id="shiritori-title" className="font-display text-3xl leading-none">
              {t('shiritori.title')} <span className="font-mincho text-xl text-muted">しりとり</span>
            </h2>
            <p className="mt-2 text-sm text-muted">{t('shiritori.rules')}</p>
          </div>
          <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full hover:bg-ink/5" aria-label={t('shiritori.close')}>
            <IconClose />
          </button>
        </div>
        <ShiritoriGame autoFocus />
      </m.div>
    </m.div>
  )
}
