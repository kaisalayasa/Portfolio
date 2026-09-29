import { lazy, Suspense, useMemo, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { journey } from '@/content/journey'
import { useI18n } from '@/lib/i18n'
import { useIsDesktop, useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { Section } from '@/components/ui/Primitives'
import { Media } from '@/components/ui/Media'
import { StaticMap } from '@/features/globe/StaticMap'

const Globe = lazy(() => import('@/features/globe/Globe'))

const webgl = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function Journey() {
  const { t, r } = useI18n()
  const desktop = useIsDesktop()
  const reduced = useReducedMotion()
  const canGlobe = useMemo(webgl, [])
  const useGlobe = desktop && !reduced && canGlobe
  const [active, setActive] = useState(journey.at(-1)!.id)
  const [rotateTo, setRotateTo] = useState({ id: active, n: 0 })
  const stop = journey.find((s) => s.id === active)!

  const select = (id: string, rotate: boolean) => {
    setActive(id)
    if (rotate) setRotateTo((p) => ({ id, n: p.n + 1 }))
  }

  return (
    <Section id="journey" jp="旅路" kicker={t('journey.kicker')} title={t('journey.title')} intro={t('journey.intro')}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative">
          {useGlobe ? (
            <Suspense fallback={<div className="aspect-square w-full animate-pulse rounded-full bg-elevated/50" />}>
              <div className="relative mx-auto max-w-[580px]">
                <div aria-hidden className="absolute inset-[12%] -z-10 rounded-full bg-accent/10 blur-3xl" />
                <Globe active={active} rotateTo={rotateTo} onSelect={select} />
              </div>
              <p className="kicker mt-2 text-center">{t('journey.hint')}</p>
            </Suspense>
          ) : (
            <StaticMap active={active} onSelect={select} />
          )}
        </div>

        <div>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2" aria-label={t('journey.stops')}>
            {journey.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => select(s.id, true)}
                  aria-pressed={active === s.id}
                  className={cn(
                    'flex min-h-14 w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors',
                    active === s.id ? 'border-accent/50 bg-accent-soft' : 'border-line hover:border-line-strong',
                  )}
                >
                  <span className={cn('grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs', active === s.id ? 'bg-accent text-on-accent' : 'bg-elevated')}>{i + 1}</span>
                  <span className="min-w-0 text-sm leading-tight">{r(s.place)}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="relative mt-4 min-h-[300px]">
            <AnimatePresence mode="wait" initial={false}>
              <m.article
                key={stop.id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                aria-live="polite"
              >
                {stop.photo && <Media src={stop.photo.src} alt={r(stop.photo.alt)} aspect="16/8" focus={stop.photo.focus} sizes="(min-width: 1024px) 480px, 100vw" />}
                <div className="p-6">
                  <p className="kicker">{r(stop.when)}</p>
                  <h3 className="mt-2 font-display text-4xl leading-none">{r(stop.place)}</h3>
                  <p className="mt-3 text-muted">{r(stop.text)}</p>
                </div>
              </m.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  )
}
