import { Link } from '@/lib/router'
import { m } from 'motion/react'
import { languages } from '@/content/languages'
import { useI18n } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { Emph, Section } from '@/components/ui/Primitives'
import { Reveal, TiltCard } from '@/components/ui/Motion'
import { Seal } from '@/components/ui/Seal'
import { Media } from '@/components/ui/Media'
import { IconArrowRight } from '@/components/ui/Icons'
import { Heatmap } from '@/features/anki/Heatmap'
import { KanjiPanel } from '@/features/kanji/KanjiPanel'

function Story() {
  const { t, r } = useI18n()
  return (
    <TiltCard max={2} className="flex flex-col p-6 md:col-span-2 md:p-9">
      <p className="kicker">{t('languages.arcTitle')}</p>
      <ol className="relative mt-6 grid gap-6 md:grid-cols-3 md:gap-5">
        <span aria-hidden className="absolute top-3 right-6 left-3 hidden h-px bg-linear-to-r from-accent via-accent/50 to-indigo md:block" />
        {languages.arc.map((beat, i) => (
          <li key={i} className="relative">
            <span className={cn('relative grid size-6 place-items-center rounded-full font-mono text-[10px]', i === 2 ? 'bg-accent text-on-accent' : 'border border-line-strong bg-surface')}>{i + 1}</span>
            <h3 className="mt-3 font-display text-2xl leading-tight">{r(beat.place)}</h3>
            <p className="mt-1.5 text-[0.93rem] text-muted">{r(beat.text)}</p>
          </li>
        ))}
      </ol>
      <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
        {[
          { v: languages.stats.selfStudyYears, l: t('languages.selfStudy') },
          { v: `~${languages.stats.peakNewWordsPerDay}`, l: t('languages.perDay') },
          { v: languages.stats.dailyReviews, l: t('languages.reviews') },
        ].map((s) => (
          <div key={s.l} className="flex flex-col">
            <dt className="order-2 mt-1 text-xs leading-snug text-muted">{s.l}</dt>
            <dd className="font-display text-4xl leading-none md:text-5xl">{s.v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-auto pt-6 font-display text-2xl leading-snug italic md:text-[1.7rem]">{t('languages.message')}</p>
    </TiltCard>
  )
}

function SenseiSeal() {
  const { t } = useI18n()
  return (
    <TiltCard className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden p-8 text-center">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_45%,var(--accent-soft),transparent_70%)]" />
      <m.div
        initial={{ scale: 1.8, rotate: -24, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
      >
        <Seal text="カイス先生" size={176} rotate={-7} label={t('languages.senseiLabel')} />
      </m.div>
      <p className="mt-7 font-display text-3xl">“Qais-sensei”</p>
      <p className="mt-1 text-sm text-muted">{t('languages.senseiTitle')} · 黒石野中学校</p>
    </TiltCard>
  )
}

function LanguageCards() {
  const { r } = useI18n()
  return (
    <>
      {languages.spoken.map((l) => (
        <TiltCard key={l.code} className="flex flex-col justify-between gap-8 p-6">
          <p
            lang={l.code}
            dir={l.dir}
            className={cn('text-5xl leading-none md:text-6xl', l.code === 'ja' ? 'font-mincho' : l.code === 'ar' ? '' : 'font-display')}
            style={l.code === 'ar' ? { fontFamily: 'var(--font-arabic)' } : undefined}
          >
            {l.native}
          </p>
          <div>
            {r(l.name) !== l.native && <p className="font-medium">{r(l.name)}</p>}
            <p className="text-sm text-muted">{r(l.level)}</p>
            {l.note && <p className="mt-1 text-xs text-muted/80">{r(l.note)}</p>}
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
              <m.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                whileInView={{ width: `${l.meter * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </TiltCard>
      ))}
    </>
  )
}

function DuolingoCard() {
  const { t, r } = useI18n()
  const card = languages.duolingoCard
  return (
    <TiltCard className="relative flex flex-col overflow-hidden p-6">
      <div aria-hidden className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-duo/20 blur-3xl" />
      <p className="kicker text-duo">{t('languages.duoTitle')}</p>
      <div className="my-auto grid place-items-center py-6">
        <Media src={card.src} alt={r(card.alt)} className="w-full max-w-[320px] rounded-xl border border-line bg-white shadow-lg" imgClassName="object-contain!" sizes="320px" />
      </div>
    </TiltCard>
  )
}

function AnkiCard() {
  const { t, r } = useI18n()
  const a = languages.anki
  return (
    <TiltCard className="flex flex-col p-6">
      <p className="kicker">{t('languages.ankiTitle')}</p>
      <p className="mt-5 font-display text-6xl leading-none">{a.totalCards}</p>
      <p className="mt-1 text-xs text-muted">{t('languages.cards')}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">{t('languages.totalReviews')}</dt>
          <dd className="font-medium">{a.totalReviews}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">{t('languages.daily')}</dt>
          <dd className="font-medium">{a.dailyReviews}</dd>
        </div>
      </dl>
      <div className="mt-auto pt-5">
        <p className="kicker mb-2 text-[0.6rem]">{t('languages.decks')}</p>
        <ul className="flex flex-wrap gap-1.5 text-sm">
          {a.decks.map((d) => (
            <li key={r(d)} className="rounded-full border border-line px-2.5 py-1 text-xs">
              {r(d)}
            </li>
          ))}
        </ul>
      </div>
    </TiltCard>
  )
}

function BuiltFrom() {
  const { t } = useI18n()
  return (
    <TiltCard className="group flex flex-col justify-between bg-linear-to-br from-accent-soft to-transparent p-6">
      <div>
        <p className="kicker">{t('languages.builtTitle')}</p>
        <p className="mt-4 font-display text-4xl leading-none">Language Switch</p>
        <p className="mt-3 text-sm text-muted">{t('languages.built')}</p>
      </div>
      <Link
        to="/projects/language-switch"
        viewTransition
        onClick={() => track('case_study_open', { slug: 'language-switch', from: 'languages' })}
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent"
      >
        <span className="link-draw">{t('languages.builtCta')}</span>
        <IconArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </TiltCard>
  )
}

export default function Languages() {
  const { t } = useI18n()

  return (
    <Section id="languages" jp="言語" kicker={t('languages.kicker')} title={<Emph text={t('languages.title')} />}>
      <Reveal className="grid gap-4 md:grid-cols-3" stagger={0.07}>
        <Story />
        <SenseiSeal />
        <LanguageCards />
        <DuolingoCard />
        <AnkiCard />
        <BuiltFrom />
        <Heatmap className="card p-6 md:col-span-3 md:p-8" />
        <KanjiPanel className="card p-6 md:col-span-3 md:p-8" />
      </Reveal>
    </Section>
  )
}
