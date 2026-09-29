import { startTransition, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { toasts } from '@/lib/store'
import { cn } from '@/lib/cn'
import { sectionNumber } from '@/lib/sections'
import { queueMount } from '@/lib/premount'
import { Reveal, RevealItem } from './Motion'

type BtnVariant = 'primary' | 'ghost' | 'soft' | 'icon'
export const btn = (variant: BtnVariant = 'ghost', className?: string) =>
  cn(
    'group/btn relative inline-flex min-h-11 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[transform,background-color,border-color,color,box-shadow] duration-200 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50',
    variant === 'primary' &&
      'bg-accent-ink px-6 text-on-accent shadow-[0_10px_30px_-10px_var(--accent)] hover:shadow-[0_14px_40px_-10px_var(--accent)] hover:brightness-110',
    variant === 'ghost' && 'border border-line-strong px-5 text-ink hover:border-ink/40 hover:bg-ink/4',
    variant === 'soft' && 'bg-elevated px-5 text-ink hover:bg-ink/8 border border-line',
    variant === 'icon' && 'size-11 border border-line-strong text-ink hover:border-ink/40 hover:bg-ink/4',
    className,
  )

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-line bg-ink/3 px-2.5 py-0.5 font-mono text-[0.68rem] tracking-wide text-muted', className)}>
      {children}
    </span>
  )
}

/** Section shell: number + kicker + title header, with the vertical Japanese label on desktop. */
export function Section({
  id,
  jp,
  index,
  kicker,
  title,
  intro,
  children,
  className,
  headerClassName,
  bleed,
}: {
  id: string
  jp?: string
  index?: string
  kicker?: string
  title?: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  bleed?: boolean
}) {
  index ??= sectionNumber(id)
  return (
    <section id={id} aria-labelledby={title ? `${id}-title` : undefined} className={cn('relative py-20 md:py-28', className)}>
      <div className={cn('container-page relative', jp && 'lg:pl-24')}>
        {jp && (
          <div aria-hidden className="pointer-events-none absolute top-1 left-8 hidden select-none lg:block">
            <div className="vertical-jp text-[1.35rem] text-accent">{jp}</div>
            <div className="mx-auto mt-4 h-24 w-px bg-linear-to-b from-accent/60 to-transparent" />
          </div>
        )}
        {(kicker || title) && (
          <Reveal as="header" className={cn('mb-12 max-w-3xl md:mb-16', headerClassName)}>
            {kicker && (
              <RevealItem className="kicker mb-4 flex items-center gap-3">
                {index && <span className="text-accent">{index}</span>}
                <span className="h-px w-8 bg-line-strong" />
                <span>{kicker}</span>
                {jp && <span className="font-jp tracking-normal lg:hidden">· {jp}</span>}
              </RevealItem>
            )}
            {title && (
              <RevealItem as="h2" className="font-display text-[clamp(2.3rem,5.5vw,4.2rem)] leading-[1.02] tracking-[-0.02em] text-balance-pretty">
                <span id={`${id}-title`}>{title}</span>
              </RevealItem>
            )}
            {intro && <RevealItem className="mt-5 max-w-2xl text-lg text-muted">{intro}</RevealItem>}
          </Reveal>
        )}
        {!bleed && children}
      </div>
      {bleed && children}
    </section>
  )
}

/** Renders "*word*" as italic accent-colored serif. */
export function Emph({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') ? (
          <em key={i} className={cn('font-display italic text-accent', className)}>
            {p.slice(1, -1)}
          </em>
        ) : (
          p
        ),
      )}
    </>
  )
}

export function Marquee({ items, className, duration = 45 }: { items: ReactNode[]; className?: string; duration?: number }) {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center">
          <span className="px-5">{it}</span>
          <span className="text-accent" aria-hidden>
            ·
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={cn('group mask-fade-x overflow-hidden', className)}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {row()}
        {row(true)}
      </div>
    </div>
  )
}

export function Toaster() {
  const list = toasts.use()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-80 flex flex-col items-center gap-2" role="status" aria-live="polite">
      <AnimatePresence>
        {list.map((t) => (
          <m.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="glass rounded-full px-4 py-2 text-sm shadow-lg"
          >
            <span className="mr-2 text-accent">✓</span>
            {t.text}
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * A below-the-fold section that mounts in the background (src/lib/premount.ts) or when it comes within
 * 1400px of the viewport, whichever is first. Both render as a transition, so React works in small slices.
 */
export function LazySection({ children, minHeight = 600, id }: { children: ReactNode; minHeight?: number; id?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let unqueue = () => {}
    const mount = (urgent = false) => {
      unqueue()
      if (urgent) setShow(true)
      else startTransition(() => setShow(true))
    }
    // Deep links (#music) and in-page nav need the target to exist right away.
    const wanted = () => id && location.hash === `#${id}`
    if (wanted()) return mount(true)
    unqueue = queueMount(() => mount())
    const io = new IntersectionObserver((e) => e[0].isIntersecting && mount(), { rootMargin: '1400px 0px' })
    io.observe(el)
    const onHash = () => wanted() && mount(true)
    const onAll = () => mount(true)
    addEventListener('hashchange', onHash)
    addEventListener('qa:mount-all', onAll)
    return () => {
      unqueue()
      io.disconnect()
      removeEventListener('hashchange', onHash)
      removeEventListener('qa:mount-all', onAll)
    }
  }, [id])
  if (show) return <Suspense fallback={<div style={{ minHeight }} id={id} data-lazy-pending />}>{children}</Suspense>
  return <div ref={ref} id={id} style={{ minHeight }} data-lazy-pending />
}
