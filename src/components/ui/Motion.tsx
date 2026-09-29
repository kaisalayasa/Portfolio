import type { ReactNode, PointerEvent as RPointerEvent, CSSProperties } from 'react'
import { m, useSpring, type Variants } from 'motion/react'
import { useIsTouch, useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

// Opacity + transform only: filters (blur) repaint every frame and made reveals stutter on phones.
const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export function Reveal({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  as = 'div',
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  as?: 'div' | 'ul' | 'ol' | 'section' | 'header'
  amount?: number
}) {
  const Comp = m[as]
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  )
}

export function RevealItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'p' | 'h2' | 'span' | 'article' }) {
  const Comp = m[as]
  return (
    <Comp className={className} variants={revealItem}>
      {children}
    </Comp>
  )
}

/** Card that tilts up to `max`° toward the pointer, with a cursor spotlight (see .spotlight in index.css). */
export function TiltCard({
  children,
  className,
  max = 6,
  style,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  max?: number
  style?: CSSProperties
  as?: 'div' | 'article' | 'li'
}) {
  const touch = useIsTouch()
  const reduced = useReducedMotion()
  const rx = useSpring(0, { stiffness: 220, damping: 22 })
  const ry = useSpring(0, { stiffness: 220, damping: 22 })
  const active = !touch && !reduced

  const onMove = (e: RPointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    if (active) {
      ry.set((px - 0.5) * 2 * max)
      rx.set(-(py - 0.5) * 2 * max)
    }
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }
  const Comp = m[as]
  return (
    <Comp
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn('card spotlight transition-[border-color] duration-300 hover:border-line-strong', className)}
      style={active ? { ...style, rotateX: rx, rotateY: ry, transformPerspective: 1100 } : style}
      variants={revealItem}
    >
      {children}
    </Comp>
  )
}

/** Pulls its child toward the pointer. */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const touch = useIsTouch()
  const reduced = useReducedMotion()
  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 })
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 })
  if (touch || reduced) return <span className={cn('inline-flex', className)}>{children}</span>
  return (
    <m.span
      className={cn('inline-flex', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </m.span>
  )
}
