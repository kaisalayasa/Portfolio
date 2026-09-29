import { useI18n, type TKey } from '@/lib/i18n'
import { Reveal, RevealItem } from '@/components/ui/Motion'
import { Section } from '@/components/ui/Primitives'

const STEPS = [1, 2, 3, 4, 5, 6] as const
const JP = ['見つける', '絞る', '試す', '届ける', '学ぶ', '磨く']

/** A compact, typographic process timeline: reads at a glance and never takes over the scroll. */
export default function HowIBuild() {
  const { t } = useI18n()
  return (
    <Section id="process" jp="作り方" kicker={t('process.kicker')} title={t('process.title')}>
      <Reveal as="ol" className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
        {STEPS.map((n) => (
          <RevealItem as="li" key={n} className="relative border-t border-line pt-5">
            <span aria-hidden className="absolute -top-[5px] left-0 size-[9px] rounded-full bg-accent shadow-[0_0_0_4px_var(--bg)]" />
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-xs text-accent">{String(n).padStart(2, '0')}</span>
              <span className="font-mincho text-xs text-muted" aria-hidden>
                {JP[n - 1]}
              </span>
            </div>
            <h3 className="mt-3 font-display text-[1.7rem] leading-tight">{t(`process.s${n}` as TKey)}</h3>
            <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-relaxed text-muted">{t(`process.s${n}d` as TKey)}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  )
}
