import { useEffect, useRef, useState } from 'react'
import { favoriteBand } from '@/content/favorites'
import { performances } from '@/content/music'
import type { Performance } from '@/content/types'
import { useI18n } from '@/lib/i18n'
import { Emph, Section } from '@/components/ui/Primitives'
import { Reveal, RevealItem } from '@/components/ui/Motion'
import { Media } from '@/components/ui/Media'
import { Txt } from '@/components/ui/Txt'
import { VideoFacade } from '@/components/ui/VideoFacade'

const BAR = 6
const GAP = 3

/** Full-width equalizer behind the stage, ending where the stage fades into the page. As many bars as fit. */
function Equalizer() {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setCount(Math.ceil(el.clientWidth / (BAR + GAP))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-24 flex h-48 items-end justify-center overflow-hidden opacity-[0.16] mask-intersect mask-[linear-gradient(to_top,#000,transparent),linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      style={{ gap: GAP }}
    >
      {Array.from({ length: count }, (_, i) => (
        // Deterministic timings so the pattern never reshuffles on resize.
        <span
          key={i}
          className="eq-bar shrink-0 rounded-t-sm bg-accent"
          style={{ width: BAR, height: `${30 + ((i * 29) % 70)}%`, ['--d' as string]: `${0.9 + ((i * 37) % 11) / 10}s`, ['--delay' as string]: `${-((i * 53) % 17) / 10}s` }}
        />
      ))}
    </div>
  )
}

function Meta({ p }: { p: Performance }) {
  const { r } = useI18n()
  return <p className="kicker leading-relaxed">{[p.role, p.date, p.venue].filter((v) => v != null).map(r).join(' · ')}</p>
}

function Featured({ p }: { p: Performance }) {
  const { t, r } = useI18n()
  return (
    <RevealItem className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-end">
      <VideoFacade src={p.video} poster={p.thumbnail} title={r(p.title)} className="rounded-card border border-line shadow-2xl" id={p.id} />
      <div>
        <p className="kicker mb-3 text-accent">★ {t('music.featured')}</p>
        <h3 className="font-display text-4xl leading-none md:text-5xl">{r(p.title)}</h3>
        <div className="mt-3">
          <Meta p={p} />
        </div>
      </div>
    </RevealItem>
  )
}

function BandCard() {
  const { t } = useI18n()
  return (
    <RevealItem className="card flex flex-col gap-4 p-5">
      <div className="flex items-center gap-4">
        <Media src={favoriteBand.image} alt={favoriteBand.name} aspect="1/1" className="size-16 shrink-0 rounded-2xl" sizes="64px" />
        <div className="min-w-0">
          <p className="kicker">{t('music.band')}</p>
          <p className="mt-1 truncate font-display text-3xl leading-none">{favoriteBand.name}</p>
        </div>
      </div>
      <Txt v={favoriteBand.why} as="p" className="text-muted" />
      {/* Spotify's full player needs 352px (anything shorter becomes a bar with no track list),
          so it's shown through a 260px window: the header and one song; the rest scrolls inside. */}
      <div className="h-65 overflow-hidden rounded-xl">
        <iframe
          title={t('music.spotify', { name: favoriteBand.name })}
          src={favoriteBand.spotifyEmbed}
          className="block h-88 w-full border-0"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      </div>
    </RevealItem>
  )
}

export default function Music() {
  const { t, r } = useI18n()
  const featured = performances.find((p) => p.featured) ?? performances[0]
  const rest = performances.filter((p) => p !== featured)

  return (
    <div data-theme="dark" className="relative overflow-hidden bg-bg text-ink">
      {/* Stage lighting fades in below the section edge instead of starting at it. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mask-[linear-gradient(to_bottom,transparent,#000_22%,#000_80%,transparent)]">
        <div className="absolute -top-1/3 left-1/2 h-[120%] w-[70%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_42%,rgb(220_235_255/0.08)_50%,transparent_58%)]" />
        <div className="absolute top-0 left-1/2 h-[70%] w-[90%] -translate-x-1/2 bg-[radial-gradient(50%_55%_at_50%_30%,rgb(79_209_197/0.14),transparent_72%)]" />
      </div>
      {/* The stage is always dark; in light mode these blend it into the paper page above and below. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-(--page-bg) to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-(--page-bg) to-transparent" />
      <Equalizer />
      <Section id="music" jp="音楽" kicker={t('music.kicker')} title={<Emph text={t('music.title')} />} className="relative">
        <Reveal className="space-y-12" stagger={0.1}>
          <Featured p={featured} />

          <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
            <RevealItem className="lg:col-span-2">
              <p className="kicker mb-4">{t('music.more')}</p>
              <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0" data-lenis-prevent>
                {rest.map((p) => (
                  <li key={p.id} className="w-[82%] shrink-0 snap-start sm:w-[46%]">
                    <VideoFacade src={p.video} poster={p.thumbnail} title={r(p.title)} className="rounded-2xl border border-line" id={p.id} />
                    <p className="mt-3 font-medium">{r(p.title)}</p>
                    <div className="mt-1">
                      <Meta p={p} />
                    </div>
                  </li>
                ))}
              </ul>
            </RevealItem>
            <BandCard />
          </div>
        </Reveal>
      </Section>
    </div>
  )
}
