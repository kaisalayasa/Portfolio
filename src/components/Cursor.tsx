import { useEffect, useState } from 'react'
import { m, useMotionValue, useSpring } from 'motion/react'
import { useIsTouch, useReducedMotion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

/**
 * Desktop-only cursor: a dot plus a trailing ring that grows over links and
 * shows "View" / "Play" over media (`data-cursor="view" | "play"`).
 */
export function Cursor() {
  const touch = useIsTouch()
  const reduced = useReducedMotion()
  const enabled = !touch && !reduced
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 350, damping: 32, mass: 0.5 })
  const ry = useSpring(y, { stiffness: 350, damping: 32, mass: 0.5 })
  const [mode, setMode] = useState<'default' | 'link' | 'view' | 'play' | 'text'>('default')
  const [visible, setVisible] = useState(false)
  const [down, setDown] = useState(false)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const el = e.target as Element | null
      const tagged = el?.closest('[data-cursor]')?.getAttribute('data-cursor')
      if (tagged === 'view' || tagged === 'play') setMode(tagged)
      else if (el?.closest('input, textarea, [contenteditable="true"]')) setMode('text')
      else if (el?.closest('a, button, [role="button"], label, select, summary')) setMode('link')
      else setMode('default')
    }
    const onLeave = () => setVisible(false)
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    addEventListener('pointerdown', onDown)
    addEventListener('pointerup', onUp)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      removeEventListener('pointerdown', onDown)
      removeEventListener('pointerup', onUp)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const big = mode === 'view' || mode === 'play'
  const size = big ? 76 : mode === 'link' ? 46 : mode === 'text' ? 4 : 30

  return (
    <div aria-hidden className={cn('pointer-events-none fixed inset-0 z-90 transition-opacity duration-300', visible ? 'opacity-100' : 'opacity-0')} data-print="hide">
      <m.div className="absolute top-0 left-0" style={{ x: rx, y: ry }}>
        <div
          className={cn(
            'grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-out',
            big ? 'border-transparent bg-accent text-on-accent' : 'border-ink/35',
            mode === 'link' && 'border-accent/70 bg-accent/10',
            down && 'scale-90',
          )}
          style={{ width: size, height: size }}
        >
          {big && <span className="font-mono text-[10px] tracking-[0.15em] uppercase">{mode === 'play' ? 'Play' : 'View'}</span>}
        </div>
      </m.div>
      <m.div className="absolute top-0 left-0" style={{ x, y }}>
        <div className={cn('size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-opacity', big && 'opacity-0')} />
      </m.div>
    </div>
  )
}
