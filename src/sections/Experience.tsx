import { useRef } from 'react'
import { m, useScroll, useSpring } from 'motion/react'
import { experience } from '@/content/experience'
import type { Experience as Exp } from '@/content/types'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/cn'
import { Emph, Section, Tag } from '@/components/ui/Primitives'
import { Reveal, RevealItem } from '@/components/ui/Motion'
import { Media } from '@/components/ui/Media'
import { Txt } from '@/components/ui/Txt'
import { OrgLogo } from '@/components/ui/OrgLogo'

function Entry({ e }: { e: Exp }) {
  const { t, r } = useI18n()
  return (
    <RevealItem as="li" className="relative pl-10 md:pl-16">
      <span aria-hidden className="absolute top-7 left-[7px] md:left-[23px]">
        <span className={cn('block size-[11px] rounded-full border-2 border-bg', e.current ? 'bg-accent shadow-[0_0_0_4px_var(--accent-soft),0_0_18px_var(--accent)]' : 'bg-line-strong')} />
      </span>

      <article className="card spotlight p-5 transition-colors hover:border-line-strong md:p-7">
        <div className="flex flex-wrap items-start gap-4">
          <OrgLogo name={r(e.org)} logo={e.logo} />
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
                  {t('experience.now')}
                </span>
              )}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
              {r(e.role)} <span className="font-display font-normal text-muted italic">@ {r(e.org)}</span>
            </h3>
          </div>
        </div>

        <div className={cn('mt-5 grid gap-6', e.photo && 'md:grid-cols-[1fr_220px]')}>
          <ul className="space-y-2.5">
            {e.bullets.map((b, i) => (
              <li key={i} className="relative pl-5 text-[0.97rem] leading-relaxed text-ink/90">
                <span aria-hidden className="absolute top-[0.72em] left-0 h-px w-2.5 bg-accent" />
                <Txt v={b} />
              </li>
            ))}
          </ul>
          {e.photo && <Media src={e.photo.src} alt={r(e.photo.alt)} aspect="4/3" className="rounded-xl" sizes="220px" />}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {e.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </article>
    </RevealItem>
  )
}

export default function Experience() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <Section id="experience" jp="経歴" kicker={t('experience.kicker')} title={<Emph text={t('experience.title')} />}>
      <div ref={ref} className="relative">
        <div aria-hidden className="absolute top-2 bottom-2 left-3 w-px bg-line md:left-7">
          <m.div className="h-full w-full origin-top bg-linear-to-b from-accent via-accent to-indigo shadow-[0_0_12px_var(--accent)]" style={{ scaleY: fill }} />
        </div>
        <Reveal as="ol" className="space-y-6" stagger={0.1} amount={0.05}>
          {experience.map((e) => (
            <Entry key={e.id} e={e} />
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
