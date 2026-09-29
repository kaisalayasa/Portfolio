import { useId, useState } from 'react'
import { recommendations, type Recommendation } from '@/content/recommendations'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/cn'
import { Emph, Section } from '@/components/ui/Primitives'
import { Reveal, RevealItem } from '@/components/ui/Motion'
import { IconLinkedIn } from '@/components/ui/Icons'

const initials = (name: string) =>
  name
    .replace(/,.*$/, '')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

function Card({ rec }: { rec: Recommendation }) {
  const { t, r } = useI18n()
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <RevealItem as="article" className="card spotlight flex h-full flex-col p-6 md:p-7">
      <span aria-hidden className="font-display text-6xl leading-[0.6] text-accent">
        “
      </span>
      <p className="mt-3 font-display text-2xl leading-snug md:text-[1.7rem]" lang="en">
        {rec.pull}
      </p>

      <div id={id} className={cn('relative mt-5 space-y-3 text-[0.95rem] leading-relaxed text-muted', !open && 'line-clamp-4')} lang="en">
        {(open ? rec.text : [rec.text.join(' ')]).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="mt-2 inline-flex min-h-11 items-center self-start text-sm text-accent"
      >
        <span className="link-draw">{open ? t('recommendations.less') : t('recommendations.more')}</span>
      </button>

      <footer className="mt-auto flex items-center gap-3 border-t border-line pt-5">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft font-display text-lg text-accent">
          {initials(rec.name)}
        </span>
        <div className="min-w-0">
          <p className="font-semibold tracking-tight">{rec.name}</p>
          <p className="text-sm text-muted">{r(rec.title)}</p>
          <p className="mt-0.5 font-mono text-[0.68rem] tracking-wide text-muted/80">
            {r(rec.relation)} · {r(rec.date)}
          </p>
        </div>
      </footer>
    </RevealItem>
  )
}

export default function Recommendations() {
  const { t } = useI18n()
  return (
    <Section id="recommendations" jp="推薦" kicker={t('recommendations.kicker')} title={<Emph text={t('recommendations.title')} />}>
      <Reveal className="grid gap-4 lg:grid-cols-3" stagger={0.08}>
        {recommendations.map((rec) => (
          <Card key={rec.id} rec={rec} />
        ))}
      </Reveal>
      <p className="mt-6 flex items-center gap-2 font-mono text-xs text-muted">
        <IconLinkedIn size={13} /> {t('recommendations.source')}
      </p>
    </Section>
  )
}
