import { useState } from 'react'
import { profile } from '@/content/profile'
import { experience } from '@/content/experience'
import { education } from '@/content/education'
import { activities } from '@/content/activities'
import { languages } from '@/content/languages'
import { useI18n } from '@/lib/i18n'
import { asset } from '@/lib/media'
import { cn } from '@/lib/cn'
import { track } from '@/lib/analytics'
import { formatMonth } from '@/lib/time'
import { Emph, Section, Tag, btn } from '@/components/ui/Primitives'
import { Reveal, RevealItem } from '@/components/ui/Motion'
import { Media } from '@/components/ui/Media'
import { IconDownload } from '@/components/ui/Icons'

type Variant = 'pm' | 'swe'

/** Both previews are mounted and cross-fade, so switching is instant and the second image is already loaded. */
function Preview({ active }: { active: Variant }) {
  const { t } = useI18n()
  const { pdf, swe } = profile.resume
  const items: { id: Variant; pdf: string; preview: string }[] = [
    { id: 'pm', pdf, preview: profile.resume.preview },
    { id: 'swe', ...swe },
  ]
  const current = items.find((i) => i.id === active)!
  return (
    <div className="relative mx-auto w-full max-w-[520px] pr-4 pb-4">
      <div aria-hidden className="absolute inset-0 top-4 left-4 rotate-2 rounded-lg border border-line bg-surface" />
      <a
        href={asset(current.pdf)}
        target="_blank"
        rel="noreferrer"
        onClick={() => track('resume_download', { from: 'preview', id: active })}
        className="relative grid aspect-[8.5/11] overflow-hidden rounded-lg border border-line bg-white shadow-2xl transition-transform duration-500 hover:-translate-y-1"
        data-cursor="view"
        aria-label={t('resume.preview')}
      >
        {items.map((i) => (
          <div key={i.id} aria-hidden={i.id !== active} className={cn('col-start-1 row-start-1 transition-opacity duration-300', i.id === active ? 'opacity-100' : 'opacity-0')}>
            <Media src={i.preview} alt={i.id === active ? t('resume.preview') : ''} aspect="8.5/11" imgClassName="object-top" sizes="(min-width: 1024px) 520px, 100vw" />
          </div>
        ))}
      </a>
    </div>
  )
}

function Switch({ active, onChange }: { active: Variant; onChange: (v: Variant) => void }) {
  const { t } = useI18n()
  const options: { id: Variant; label: string }[] = [
    { id: 'pm', label: t('resume.pm') },
    { id: 'swe', label: t('resume.swe') },
  ]
  return (
    <div role="group" aria-label={t('resume.choose')} className="inline-flex rounded-full border border-line p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={active === o.id}
          onClick={() => onChange(o.id)}
          className={cn('h-10 rounded-full px-5 text-sm font-medium transition-colors', active === o.id ? 'bg-accent text-on-accent' : 'text-muted hover:text-ink')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Glance() {
  const { t, r } = useI18n()
  const { skills } = profile
  return (
    <div className="card space-y-7 p-6 md:p-8">
      <p className="kicker">{t('resume.glance')}</p>
      <div>
        <h3 className="kicker mb-3 text-accent">{t('resume.education')}</h3>
        <ul className="space-y-3">
          {education.map((e) => (
            <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span>
                <span className="font-medium">{r(e.school)}</span> <span className="text-muted">· {r(e.program)}</span>
                {e.gpa && <span className="text-muted"> · GPA {e.gpa}</span>}
              </span>
              <span className="font-mono text-xs text-muted">{r(e.dates)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="kicker mb-3 text-accent">{t('resume.experience')}</h3>
        <ul className="space-y-3">
          {experience.map((e) => (
            <li key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span>
                <span className="font-medium">{r(e.role)}</span> <span className="text-muted">· {r(e.org)}</span>
              </span>
              <span className="font-mono text-xs text-muted">{r(e.dates)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="kicker mb-3 text-accent">{t('resume.skills')}</h3>
        <div className="flex flex-wrap gap-1.5">
          {[...skills.strongest, ...skills.ai.slice(0, 4)].map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </div>
      <div>
        <h3 className="kicker mb-2 text-accent">{t('resume.leadership')}</h3>
        <p className="text-sm">{activities.map((a) => r(a.title)).join(' · ')}</p>
      </div>
      <div>
        <h3 className="kicker mb-2 text-accent">{t('resume.languages')}</h3>
        <p className="text-sm">{languages.spoken.map((l) => `${r(l.name)} (${r(l.level)})`).join(' · ')}</p>
      </div>
    </div>
  )
}

/** Hidden on screen; this is what prints (⌘P): a one-page résumé built from the content files. */
function PrintResume() {
  const { r } = useI18n()
  const { email } = profile
  const { github, linkedin } = profile.links
  return (
    <div data-print="only" className="text-[10pt] leading-snug text-black">
      <h1 className="font-display text-[26pt] leading-none">{profile.name}</h1>
      <p className="mt-1">{[email, github.replace('https://', ''), linkedin.replace('https://www.', '')].join(' · ')}</p>
      <p className="mt-2 italic">{r(profile.headline).replace(/\*/g, '')}</p>
      <h2 className="mt-5 border-b border-black/30 pb-1 text-[9pt] font-semibold tracking-widest uppercase">Experience</h2>
      {experience.map((e) => (
        <div key={e.id} className="mt-3 break-inside-avoid">
          <p className="flex justify-between gap-4">
            <strong>
              {r(e.role)} — {r(e.org)}
            </strong>
            <span>{r(e.dates)}</span>
          </p>
          <ul className="mt-1 list-disc pl-5">
            {e.bullets.map((b, i) => (
              <li key={i}>{r(b)}</li>
            ))}
          </ul>
        </div>
      ))}
      <h2 className="mt-5 border-b border-black/30 pb-1 text-[9pt] font-semibold tracking-widest uppercase">Education</h2>
      {education.map((e) => (
        <div key={e.id} className="mt-3 break-inside-avoid">
          <p className="flex justify-between gap-4">
            <strong>
              {r(e.school)} — {r(e.program)}
              {e.gpa ? ` · GPA ${e.gpa}` : ''}
            </strong>
            <span>{r(e.dates)}</span>
          </p>
          {e.courses && <p className="mt-1">Coursework: {e.courses.map((c) => (c.note ? `${r(c.name)} (${r(c.note)})` : r(c.name))).join(', ')}</p>}
          {e.roles?.map((role) => (
            <p key={r(role.title)} className="mt-1">
              {r(role.title)}, {r(role.org)}
            </p>
          ))}
        </div>
      ))}
      <h2 className="mt-5 border-b border-black/30 pb-1 text-[9pt] font-semibold tracking-widest uppercase">Skills</h2>
      <p className="mt-2">{[...profile.skills.strongest, ...profile.skills.also].join(', ')}</p>
      <p className="mt-1">AI: {profile.skills.ai.join(', ')}</p>
      <h2 className="mt-5 border-b border-black/30 pb-1 text-[9pt] font-semibold tracking-widest uppercase">Languages</h2>
      <p className="mt-2">{languages.spoken.map((l) => `${r(l.name)} (${r(l.level)})`).join(' · ')}</p>
    </div>
  )
}

export default function Resume() {
  const { t, lang } = useI18n()
  const [active, setActive] = useState<Variant>('pm')
  const { lastUpdated } = profile.resume
  const pdf = active === 'pm' ? profile.resume.pdf : profile.resume.swe.pdf

  return (
    <Section id="resume" jp="履歴書" kicker={t('resume.kicker')} title={<Emph text={t('resume.title')} />} className="print-keep">
      <PrintResume />
      <Reveal className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]" stagger={0.1}>
        <RevealItem className="order-2 lg:order-1">
          <div data-print="hide">
            <Preview active={active} />
          </div>
        </RevealItem>
        <RevealItem className="order-1 space-y-5 lg:order-2">
          <div data-print="hide">
            <Switch active={active} onChange={setActive} />
          </div>
          <div className="flex flex-wrap items-center gap-3" data-print="hide">
            <a href={asset(pdf)} download onClick={() => track('resume_download', { from: 'button', id: active })} className={btn('primary', 'h-12 px-6')}>
              <IconDownload size={17} /> {t('resume.download')}
            </a>
            <span className="font-mono text-xs text-muted">{t('resume.updated', { date: formatMonth(lastUpdated, lang) })}</span>
          </div>
          <div data-print="hide">
            <Glance />
          </div>
        </RevealItem>
      </Reveal>
    </Section>
  )
}
