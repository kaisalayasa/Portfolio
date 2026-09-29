import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { Link } from '@/lib/router'
import { m, useScroll, useSpring } from 'motion/react'
import { caseStudies, projectBySlug } from '@/content/projects'
import { profile } from '@/content/profile'
import { useI18n } from '@/lib/i18n'
import { scrollToId } from '@/lib/scroll'
import { track } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { Tag, btn } from '@/components/ui/Primitives'
import { Media } from '@/components/ui/Media'
import { Txt } from '@/components/ui/Txt'
import { mdxComponents } from '@/components/mdx'
import { IconArrowLeft, IconArrowRight, IconArrowUpRight, IconGitHub } from '@/components/ui/Icons'
import { Footer } from '@/sections/Footer'
import NotFound from './NotFound'

type MdxModule = { default: ComponentType<{ components?: Record<string, ComponentType<never>> }>; meta?: { timeline?: string } }
const modules = import.meta.glob<MdxModule>('../content/case-studies/*.mdx')

function useMdx(slug: string) {
  const [mod, setMod] = useState<MdxModule | null>(null)
  useEffect(() => {
    setMod(null)
    modules[`../content/case-studies/${slug}.mdx`]?.().then(setMod)
  }, [slug])
  return mod
}

function Toc({ articleRef, ready }: { articleRef: React.RefObject<HTMLElement | null>; ready: unknown }) {
  const { t } = useI18n()
  const [items, setItems] = useState<{ id: string; text: string }[]>([])
  const [active, setActive] = useState('')
  useEffect(() => {
    const el = articleRef.current
    if (!el) return
    const hs = [...el.querySelectorAll('h2[id]')] as HTMLElement[]
    setItems(hs.map((h) => ({ id: h.id, text: h.textContent ?? '' })))
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-20% 0px -70% 0px' })
    hs.forEach((h) => io.observe(h))
    return () => io.disconnect()
  }, [articleRef, ready])
  if (!items.length) return null
  return (
    <nav aria-label={t('case.toc')} className="sticky top-28 hidden lg:block">
      <p className="kicker mb-4">{t('case.toc')}</p>
      <ol className="space-y-1 border-l border-line">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(i.id)
              }}
              className={cn('-ml-px block border-l py-1.5 pl-4 text-sm transition-colors', active === i.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink')}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function CaseStudy({ slug }: { slug: string }) {
  const { t, r } = useI18n()
  const p = projectBySlug(slug)
  const mod = useMdx(slug)
  const article = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  const list = useMemo(caseStudies, [])
  const idx = list.findIndex((x) => x.slug === slug)
  const prev = idx > 0 ? list[idx - 1] : list.at(-1)
  const next = list[(idx + 1) % list.length]

  useEffect(() => {
    if (p) document.title = `${r(p.title)} — ${profile.name}`
  }, [p, r])

  if (!p || !p.caseStudy) return <NotFound />
  const Body = mod?.default
  const { code, live } = p.links

  return (
    <>
      <m.div aria-hidden className="fixed inset-x-0 top-0 z-55 h-[3px] origin-left bg-accent" style={{ scaleX: progress }} title={t('case.progress')} />
      <main id="main" className="pt-28 md:pt-36">
        <header className="container-page">
          <Link to="/#projects" viewTransition className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink">
            <IconArrowLeft size={15} /> {t('case.back')}
          </Link>
          <p className="kicker mt-8">{r(p.kicker)}</p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] tracking-[-0.03em]" style={{ viewTransitionName: `title-${p.slug}` }}>
            {r(p.title)}
          </h1>
          <Txt v={p.summary} as="p" className="mt-6 max-w-3xl text-xl leading-relaxed text-muted" />

          <dl className="mt-10 grid gap-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="kicker">{t('case.year')}</dt>
              <dd className="mt-1.5">{mod?.meta?.timeline || p.year || '—'}</dd>
            </div>
            <div>
              <dt className="kicker">{t('case.stack')}</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </dd>
            </div>
            <div>
              <dt className="kicker">{t('case.links')}</dt>
              <dd className="mt-1.5 flex flex-wrap gap-2">
                {code && (
                  <a href={code} target="_blank" rel="noreferrer" onClick={() => track('project_link', { slug: p.slug, label: 'code' })} className={btn('ghost', 'min-h-10 px-4 text-sm')}>
                    <IconGitHub size={15} /> {t('work.code')}
                  </a>
                )}
                {live && (
                  <a href={live} target="_blank" rel="noreferrer" onClick={() => track('project_link', { slug: p.slug, label: 'live' })} className={btn('ghost', 'min-h-10 px-4 text-sm')}>
                    {t('work.live')} <IconArrowUpRight size={14} />
                  </a>
                )}
                {!code && !live && <span className="text-muted">{p.confidential ? '🔒' : '—'}</span>}
              </dd>
            </div>
          </dl>
        </header>

        {p.cover && (
          <div className="container-page mt-12">
            <Media src={p.cover.src} alt={r(p.cover.alt)} aspect="21/9" className="rounded-[24px] border border-line" priority sizes="(min-width: 1200px) 1136px, 100vw" />
          </div>
        )}

        <div className="container-page mt-16 grid gap-12 pb-24 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside>
            <Toc articleRef={article} ready={mod} />
          </aside>
          <article ref={article} className="prose-cs max-w-[720px]">
            {Body ? (
              <Body components={mdxComponents as Record<string, ComponentType<never>>} />
            ) : (
              <div className="space-y-4">
                <div className="skeleton h-8 w-2/3" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-5/6" />
              </div>
            )}
          </article>
        </div>

        <nav aria-label="Case studies" className="border-t border-line">
          <div className="container-page grid gap-4 py-12 md:grid-cols-2">
            {prev && prev.slug !== slug && (
              <Link to={`/projects/${prev.slug}`} viewTransition className="group card spotlight p-6">
                <span className="kicker flex items-center gap-2">
                  <IconArrowLeft size={13} /> {t('case.prev')}
                </span>
                <span className="mt-3 block font-display text-3xl">{r(prev.title)}</span>
              </Link>
            )}
            {next && next.slug !== slug && (
              <Link to={`/projects/${next.slug}`} viewTransition className="group card spotlight p-6 text-right md:col-start-2">
                <span className="kicker flex items-center justify-end gap-2">
                  {t('case.next')} <IconArrowRight size={13} />
                </span>
                <span className="mt-3 block font-display text-3xl">{r(next.title)}</span>
              </Link>
            )}
          </div>
        </nav>
      </main>
      <Footer />
    </>
  )
}
