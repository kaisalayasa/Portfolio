import { lazy, Suspense, useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useI18n } from '@/lib/i18n'
import { asset } from '@/lib/media'
import { lifePhotos, type LifeItem } from '@/lib/content'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { Emph, Section } from '@/components/ui/Primitives'
import { Reveal, RevealItem } from '@/components/ui/Motion'
import { Media } from '@/components/ui/Media'
import { IconPlay } from '@/components/ui/Icons'

const Lightbox = lazy(() => import('@/components/Lightbox'))

function Tile({ item, onOpen }: { item: LifeItem; onOpen: () => void }) {
  const { t } = useI18n()
  const touch = useIsTouch()
  const video = item.kind === 'video'
  return (
    <RevealItem as="li" className="mb-3 break-inside-avoid md:mb-4">
      <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full overflow-hidden rounded-[18px] border border-line text-left"
        aria-label={t('life.open', { caption: t('life.photo') })}
        data-cursor={video ? 'play' : 'view'}
      >
        {video ? (
          <video
            src={asset(item.src)}
            muted
            loop
            playsInline
            preload="metadata"
            className="block aspect-[3/4] w-full object-cover"
            onPointerEnter={(e) => !touch && e.currentTarget.play().catch(() => {})}
            onPointerLeave={(e) => e.currentTarget.pause()}
            aria-hidden
          />
        ) : (
          <Media src={item.src} alt={t('life.photo')} sizes="(min-width: 768px) 33vw, 50vw" imgClassName="transition-transform duration-700 group-hover:scale-[1.04]" />
        )}
        {video && (
          <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur">
            <IconPlay size={14} />
          </span>
        )}
      </button>
    </RevealItem>
  )
}

export default function Life() {
  const { t } = useI18n()
  const items = useMemo(lifePhotos, [])
  const [open, setOpen] = useState<number | null>(null)

  return (
    <Section id="life" jp="写真" kicker={t('life.kicker')} title={<Emph text={t('life.title')} />}>
      <Reveal as="ul" className="columns-2 gap-3 md:columns-3 md:gap-4" stagger={0.05} amount={0.05}>
        {items.map((item, i) => (
          <Tile key={item.src} item={item} onOpen={() => setOpen(i)} />
        ))}
      </Reveal>

      <Suspense fallback={null}>
        <AnimatePresence>{open != null && items[open] && <Lightbox key="lb" items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}</AnimatePresence>
      </Suspense>
    </Section>
  )
}
