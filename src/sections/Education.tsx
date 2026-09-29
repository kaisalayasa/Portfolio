import { education } from '@/content/education'
import type { Education as Edu } from '@/content/types'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/cn'
import { Emph, Section } from '@/components/ui/Primitives'
import { Reveal, RevealItem } from '@/components/ui/Motion'
import { OrgLogo } from '@/components/ui/OrgLogo'
import { Seal } from '@/components/ui/Seal'
import { Txt } from '@/components/ui/Txt'

function School({ e }: { e: Edu }) {
  const { t, r } = useI18n()
  return (
    <RevealItem as="article" className="card spotlight flex h-full flex-col p-6 md:p-8">
      <div className="flex items-start gap-4">
        <OrgLogo name={r(e.school)} logo={e.logo} />
        <div className="min-w-0 flex-1">
          <p className="kicker flex flex-wrap items-center gap-x-2 gap-y-1">
            {[e.dates, e.location].map((v, i) => (
                <span key={i} className="flex items-center gap-x-2">
                  {i > 0 && <span aria-hidden>·</span>}
                  <Txt v={v} />
                </span>
              ))}
            {e.current && (
              <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-accent px-2 py-0.5 text-[0.62rem] text-on-accent">
                <span className="size-1.5 animate-pulse-dot rounded-full bg-on-accent text-on-accent" />
                {t('education.now')}
              </span>
            )}
          </p>
          <h3 className="mt-2 font-display text-3xl leading-none md:text-4xl">{r(e.school)}</h3>
          <p className="mt-2 text-muted">{r(e.program)}</p>
        </div>
        {e.gpa && (
          <div className="shrink-0 text-right">
            <p className="font-display text-4xl leading-none text-accent md:text-5xl">{e.gpa}</p>
            <p className="kicker mt-1.5">{t('education.gpa')}</p>
          </div>
        )}
      </div>

      {e.bullets && (
        <ul className="mt-6 space-y-2.5">
          {e.bullets.map((b, i) => (
            <li key={i} className="relative pl-5 text-[0.97rem] leading-relaxed text-ink/90">
              <span aria-hidden className="absolute top-[0.72em] left-0 h-px w-2.5 bg-accent" />
              <Txt v={b} />
            </li>
          ))}
        </ul>
      )}

      {e.courses && (
        <div className="mt-7">
          <h4 className="kicker mb-3">{t('education.coursework')}</h4>
          <ul className="flex flex-wrap gap-2">
            {e.courses.map((c) => (
              <li
                key={r(c.name)}
                className={cn('rounded-full border px-3 py-1.5 text-sm leading-tight', c.note ? 'border-dashed border-line-strong text-muted' : 'border-line bg-ink/3')}
              >
                {r(c.name)}
                {c.note && <span className="ml-1.5 font-mono text-[0.68rem] text-accent">{r(c.note)}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {e.roles && (
        <div className="mt-auto space-y-4 pt-7">
          {e.roles.map((role) => (
            <div key={r(role.title)} className="flex gap-4 rounded-2xl border border-line bg-bg/40 p-5">
              <Seal text="先生" size={44} className="mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold tracking-tight">{r(role.title)}</p>
                <p className="text-sm text-muted">{r(role.org)}</p>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink/90">{r(role.description)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </RevealItem>
  )
}

export default function Education() {
  const { t } = useI18n()
  return (
    <Section id="education" jp="学歴" kicker={t('education.kicker')} title={<Emph text={t('education.title')} />}>
      <Reveal className="grid gap-5 lg:grid-cols-2" stagger={0.1}>
        {education.map((e) => (
          <School key={e.id} e={e} />
        ))}
      </Reveal>
    </Section>
  )
}
