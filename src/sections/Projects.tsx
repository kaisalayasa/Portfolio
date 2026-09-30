import { Link } from '@/lib/router'
import { projects } from '@/content/projects'
import { profile } from '@/content/profile'
import type { Project } from '@/content/types'
import stars from '@/data/github-stars.json'
import { useI18n } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { Emph, Section, Tag, btn } from '@/components/ui/Primitives'
import { Reveal, RevealItem, TiltCard } from '@/components/ui/Motion'
import { Media } from '@/components/ui/Media'
import { Txt } from '@/components/ui/Txt'
import { IconArrowRight, IconArrowUpRight, IconGitHub, IconStar } from '@/components/ui/Icons'

/** 猫 → cat becomes cat → 猫: a mock Anki card, rebuilt (not just flipped). */
function AnkiDemo() {
  const { t } = useI18n()
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-label={t('work.demoCaption')} role="img">
      {[
        { label: t('work.demoOriginal'), front: '猫', back: 'cat', tpl: ['{{Expression}}', '{{Meaning}}'], rebuilt: false },
        { label: t('work.demoRebuilt'), front: 'cat', back: '猫', tpl: ['{{Meaning}} · 🔊', '{{Expression}} · {{Reading}}'], rebuilt: true },
      ].map((c) => (
        <div key={c.label} className="min-w-0">
          <p className={cn('kicker mb-2 text-[0.6rem]', c.rebuilt && 'text-accent')}>{c.label}</p>
          <div className="perspective-[900px]">
            <div className={cn('anki-flip relative h-36 transform-3d', c.rebuilt && '[animation-delay:-2s]')}>
              {[
                { face: t('work.demoFront'), word: c.front, tpl: c.tpl[0], back: false },
                { face: t('work.demoBack'), word: c.back, tpl: c.tpl[1], back: true },
              ].map((f) => (
                <div
                  key={f.face}
                  className={cn(
                    'absolute inset-0 flex flex-col rounded-2xl border bg-bg/80 p-3 backface-hidden',
                    c.rebuilt ? 'border-accent/40' : 'border-line-strong',
                    f.back && 'rotate-y-180',
                  )}
                >
                  <span className="font-mono text-[0.6rem] text-muted">{f.face}</span>
                  <span className={cn('m-auto text-4xl', /[一-龯]/.test(f.word) ? 'font-mincho' : 'font-display')}>
                    {f.word}
                    {c.rebuilt && (f.back ? <span className="mt-1 block text-center font-jp text-xs text-muted">ねこ</span> : <span className="mt-1 block text-center text-xs text-muted">🔊 /kæt/</span>)}
                  </span>
                  <span className="truncate font-mono text-[0.6rem] text-muted/80">{f.tpl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Stars({ repo }: { repo?: string }) {
  const { t } = useI18n()
  const n = repo && (stars as Record<string, number>)[repo]
  if (!n) return null
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs text-muted" title={t('work.stars', { n })}>
      <IconStar className="text-accent" /> {n}
    </span>
  )
}

function CardLinks({ p, className }: { p: Project; className?: string }) {
  const { t } = useI18n()
  // Shiritori's card already has a big "play it" link to the live site.
  const live = p.slug === 'shiritori' ? '' : p.links.live
  const code = p.links.code
  return (
    <div className={cn('mt-auto flex flex-wrap items-center gap-2 pt-5', className)}>
      {p.caseStudy && (
        <Link
          to={`/projects/${p.slug}`}
          viewTransition
          onClick={() => track('case_study_open', { slug: p.slug })}
          className={btn('soft', 'min-h-10 px-4 text-[0.82rem]')}
        >
          {t('work.case')} <IconArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      )}
      {live && (
        <a href={live} target="_blank" rel="noreferrer" onClick={() => track('project_link', { slug: p.slug, label: 'live' })} className={btn('ghost', 'min-h-10 px-4 text-[0.82rem]')}>
          {t('work.live')} <IconArrowUpRight size={14} />
        </a>
      )}
      {code && (
        <a href={code} target="_blank" rel="noreferrer" onClick={() => track('project_link', { slug: p.slug, label: 'code' })} className={btn('ghost', 'min-h-10 px-4 text-[0.82rem]')}>
          <IconGitHub size={15} /> {t('work.code')}
        </a>
      )}
    </div>
  )
}

function Cover({ p, featured }: { p: Project; featured?: boolean }) {
  const { r } = useI18n()
  if (!p.cover) return null
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-line" data-cursor="view">
      <Media
        src={p.cover.src}
        alt={r(p.cover.alt)}
        aspect={featured ? undefined : '16/10'}
        imgClassName="transition-transform duration-700 group-hover/card:scale-[1.04]"
        sizes={featured ? '(min-width: 1024px) 760px, 100vw' : '(min-width: 1024px) 380px, 100vw'}
      />
    </div>
  )
}

function ProjectCard({ p }: { p: Project }) {
  const { t, r } = useI18n()
  const featured = p.featured

  const body = (
    <div className={cn('flex min-w-0 flex-1 flex-col', featured ? 'py-2 lg:py-4 lg:pr-4' : 'px-2 pt-5 pb-1 md:px-3')}>
      <div className="flex items-center justify-between gap-3">
        <p className="kicker truncate">
          {featured && <span className="mr-2 text-accent">★ {t('work.featured')}</span>}
          {r(p.kicker)}
        </p>
        <Stars repo={p.repo} />
      </div>
      <h3 className={cn('mt-2 font-display leading-none tracking-tight', featured ? 'text-5xl md:text-7xl' : 'text-3xl md:text-[2.1rem]')}>{r(p.title)}</h3>
      <Txt v={p.summary} as="p" className={cn('mt-3 text-muted', featured ? 'text-base md:text-lg' : 'text-[0.95rem]')} />
      {p.result && (
        <p className={cn('mt-4 border-l-2 border-accent pl-3 font-medium text-ink', featured ? 'text-base' : 'text-[0.92rem]')}>
          <Txt v={p.result} />
        </p>
      )}
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech">
        {p.tags.map((tag) => (
          <li key={tag}>
            <Tag>{tag}</Tag>
          </li>
        ))}
      </ul>

      {p.slug === 'shiritori' && p.links.live && (
        <a
          href={p.links.live}
          target="_blank"
          rel="noreferrer"
          onClick={() => track('shiritori_play', { from: 'card' })}
          className="mt-5 flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-dashed border-line-strong px-4 text-sm transition-colors hover:border-accent/60"
        >
          <span>
            <span className="mr-2 font-jp text-accent">しりとり</span>
            {t('work.playSite')}
          </span>
          <IconArrowUpRight size={16} />
        </a>
      )}

      <CardLinks p={p} />
    </div>
  )

  return (
    <li className={cn('min-w-0', featured && 'md:col-span-2 lg:col-span-3')}>
      <TiltCard as="article" max={featured ? 2 : 5} className="group/card flex h-full flex-col p-3 md:p-4">
        {featured ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
            <div className="grid min-w-0 content-start gap-3">
              <Cover p={p} featured />
              <div className="rounded-[16px] border border-line bg-elevated/60 p-4">
                <AnkiDemo />
                <p className="mt-3 text-xs text-muted">{t('work.demoCaption')}</p>
              </div>
            </div>
            {body}
          </div>
        ) : (
          <>
            <Cover p={p} />
            {body}
          </>
        )}
      </TiltCard>
    </li>
  )
}

/** The GitHub card: something new is on the way. */
function InDevelopment() {
  const { t } = useI18n()
  return (
    <RevealItem as="li" className="md:col-span-2">
      <div className="card spotlight relative flex h-full min-h-56 flex-col justify-between overflow-hidden p-6 md:p-8">
        <div aria-hidden className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-accent/10 blur-3xl" />
        <p className="kicker flex items-center gap-2">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-accent text-accent" aria-hidden /> <IconGitHub size={14} /> GitHub
        </p>
        <div className="mt-8">
          <p className="max-w-lg font-display text-4xl leading-[1.05] md:text-5xl">
            <Emph text={t('work.inDev')} />
          </p>
          <p className="mt-3 max-w-md text-muted">{t('work.inDevSub')}</p>
        </div>
        <a href={profile.links.github} target="_blank" rel="noreferrer" className={btn('ghost', 'mt-6 min-h-10 self-start px-4 text-[0.82rem]')}>
          <IconGitHub size={15} /> {t('work.followGitHub')} <IconArrowUpRight size={14} />
        </a>
      </div>
    </RevealItem>
  )
}

/** Short card for the small builds in "More work". */
function MentionCard({ p }: { p: Project }) {
  const { t, r } = useI18n()
  return (
    <RevealItem as="li" className="min-w-0">
      <article className="card spotlight flex h-full flex-col overflow-hidden p-5">
        <p className="kicker min-w-0">{r(p.kicker)}</p>
        <h3 className="mt-2 font-display text-2xl leading-none tracking-tight">{r(p.title)}</h3>
        <Txt v={p.summary} as="p" className="mt-2.5 text-sm leading-relaxed text-muted" />
        {p.links.code && (
          <a
            href={p.links.code}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('project_link', { slug: p.slug, label: 'code' })}
            className="mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-2 text-sm text-accent"
          >
            <IconGitHub size={14} /> <span className="link-draw">{t('work.code')}</span> <IconArrowUpRight size={13} />
          </a>
        )}
      </article>
    </RevealItem>
  )
}

export default function Projects() {
  const { t } = useI18n()
  const main = projects.filter((p) => !p.variant || p.variant === 'card')
  const more = projects.filter((p) => p.variant === 'mention')

  return (
    <Section id="projects" jp="作品" kicker={t('work.kicker')} title={<Emph text={t('work.title')} />} intro={t('work.intro')}>
      <Reveal as="ul" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" amount={0.05}>
        {main.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
        <InDevelopment />
      </Reveal>

      <p className="kicker mt-16 mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-line-strong" /> {t('work.more')}
      </p>
      <Reveal as="ul" className="grid grid-cols-1 gap-4 lg:grid-cols-2" amount={0.05}>
        {more.map((p) => (
          <MentionCard key={p.slug} p={p} />
        ))}
      </Reveal>
    </Section>
  )
}
