import { activities } from '@/content/activities'
import type { Activity } from '@/content/types'
import { useI18n } from '@/lib/i18n'
import { Emph, Section } from '@/components/ui/Primitives'
import { Reveal, RevealItem } from '@/components/ui/Motion'
import { Media } from '@/components/ui/Media'

function ActivityCard({ a }: { a: Activity }) {
  const { r } = useI18n()
  return (
    <RevealItem as="article" className="card spotlight flex flex-col overflow-hidden">
      {a.photo && <Media src={a.photo.src} alt={r(a.photo.alt)} aspect="16/9" sizes="(min-width: 768px) 50vw, 100vw" />}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <p className="kicker">{r(a.org)}</p>
        <h3 className="mt-2 font-display text-3xl leading-none md:text-4xl">{r(a.title)}</h3>
        <p className="mt-3 max-w-prose leading-relaxed text-muted">{r(a.description)}</p>
        {a.stat && (
          <div className="mt-auto pt-5">
            <p className="flex items-baseline gap-2.5 border-t border-line pt-4">
              <span className="font-display text-3xl leading-none text-accent">{a.stat.value}</span>
              <span className="text-sm text-muted">{r(a.stat.label)}</span>
            </p>
          </div>
        )}
      </div>
    </RevealItem>
  )
}

export default function Activities() {
  const { t } = useI18n()
  return (
    <Section id="activities" jp="課外活動" kicker={t('activities.kicker')} title={<Emph text={t('activities.title')} />} intro={t('activities.intro')}>
      <Reveal className="grid gap-4 md:grid-cols-2" stagger={0.07}>
        {activities.map((a) => (
          <ActivityCard key={a.id} a={a} />
        ))}
      </Reveal>
    </Section>
  )
}
