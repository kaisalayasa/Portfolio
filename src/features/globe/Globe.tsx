import { useEffect, useRef } from 'react'
import createGlobe, { type COBEOptions } from 'cobe'
import { journey } from '@/content/journey'
import { useI18n } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'
import { phiFor, project, shortest } from './projection'

const THETA = 0.32
const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/**
 * Interactive cobe globe. The canvas is created imperatively because cobe
 * re-parents it into its own wrapper (React must not own that node).
 */
export default function Globe({
  active,
  rotateTo,
  onSelect,
}: {
  active: string
  /** Changes whenever the globe should turn to face a stop (click / list selection). */
  rotateTo: { id: string; n: number }
  onSelect: (id: string, rotate: boolean) => void
}) {
  const { r, t } = useI18n()
  const { theme } = useTheme()
  const host = useRef<HTMLDivElement>(null)
  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const state = useRef({ phi: phiFor(journey[0].lon), target: null as number | null, dragging: false, lastX: 0, velocity: 0 })

  useEffect(() => {
    const stop = journey.find((s) => s.id === rotateTo.id)
    if (stop && rotateTo.n > 0) state.current.target = shortest(state.current.phi, phiFor(stop.lon))
  }, [rotateTo])

  useEffect(() => {
    const el = host.current
    if (!el) return
    const canvas = document.createElement('canvas')
    canvas.style.cssText = 'width:100%;height:100%;opacity:0;transition:opacity 1s ease;contain:layout paint size;cursor:grab'
    canvas.setAttribute('aria-hidden', 'true')
    el.prepend(canvas)

    const dark = theme === 'dark'
    const accent = hex(dark ? '#4FD1C5' : '#0B6B64')
    let size = el.offsetWidth
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const opts: COBEOptions = {
      devicePixelRatio: dpr,
      width: size,
      height: size,
      phi: state.current.phi,
      theta: THETA,
      dark: dark ? 1 : 0,
      diffuse: dark ? 1.2 : 1.6,
      mapSamples: 16000,
      mapBrightness: dark ? 5 : 8,
      mapBaseBrightness: dark ? 0 : 0.05,
      baseColor: dark ? [0.15, 0.18, 0.25] : [0.95, 0.95, 0.93],
      markerColor: accent,
      glowColor: dark ? [0.07, 0.1, 0.16] : [0.88, 0.93, 0.95],
      markers: journey.map((s) => ({ location: [s.lat, s.lon] as [number, number], size: 0.055 })),
      arcs: journey.slice(1).map((s, i) => ({ from: [journey[i].lat, journey[i].lon] as [number, number], to: [s.lat, s.lon] as [number, number] })),
      arcColor: accent,
      arcWidth: 0.6,
      arcHeight: 0.28,
      markerElevation: 0.01,
    }
    const globe = createGlobe(canvas, opts)
    requestAnimationFrame(() => (canvas.style.opacity = '1'))

    let raf = 0
    let running = true
    const tick = () => {
      const s = state.current
      if (!s.dragging) {
        if (s.target != null) {
          s.phi += (s.target - s.phi) * 0.08
          if (Math.abs(s.target - s.phi) < 0.001) s.target = null
        } else {
          s.phi += 0.0022 + s.velocity
          s.velocity *= 0.94
        }
      }
      globe.update({ phi: s.phi, width: size, height: size })
      for (const stop of journey) {
        const btn = markerRefs.current[stop.id]
        if (!btn) continue
        const p = project(stop.lat, stop.lon, s.phi, THETA)
        btn.style.transform = `translate(${p.x * size}px, ${p.y * size}px) translate(-50%, -50%)`
        btn.style.opacity = p.visible ? '1' : '0'
        btn.style.pointerEvents = p.visible ? 'auto' : 'none'
        btn.tabIndex = p.visible ? 0 : -1
      }
      if (running) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Only render while on screen.
    const io = new IntersectionObserver(([e]) => {
      const was = running
      running = e.isIntersecting && !document.hidden
      if (running && !was) raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    const ro = new ResizeObserver(() => (size = el.offsetWidth))
    ro.observe(el)

    // Drag to spin (horizontal only, so vertical page scroll still works on touch).
    const down = (e: PointerEvent) => {
      state.current.dragging = true
      state.current.lastX = e.clientX
      state.current.target = null
      canvas.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      const s = state.current
      if (!s.dragging) return
      const dx = e.clientX - s.lastX
      s.lastX = e.clientX
      s.phi += dx / 180
      s.velocity = dx / 3000
    }
    const up = () => {
      state.current.dragging = false
      canvas.style.cursor = 'grab'
    }
    canvas.addEventListener('pointerdown', down)
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('pointerdown', down)
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      globe.destroy()
      // cobe wrapped the canvas in its own div; remove whatever it left behind.
      const wrapper = canvas.parentElement
      if (wrapper && wrapper !== el) wrapper.remove()
      else canvas.remove()
    }
  }, [theme])

  return (
    <div ref={host} className="relative aspect-square w-full touch-pan-y select-none" role="group" aria-label={t('journey.title')}>
      <div className="pointer-events-none absolute inset-0">
        {journey.map((s, i) => (
          <button
            key={s.id}
            ref={(b) => {
              markerRefs.current[s.id] = b
            }}
            type="button"
            onClick={() => onSelect(s.id, true)}
            onMouseEnter={() => onSelect(s.id, false)}
            onFocus={() => onSelect(s.id, false)}
            className={cn(
              'pointer-events-auto absolute top-0 left-0 flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-xs whitespace-nowrap transition-[opacity,background-color] duration-300',
              active === s.id ? 'glass text-ink' : 'text-muted hover:text-ink',
            )}
            style={{ opacity: 0 }}
            aria-pressed={active === s.id}
          >
            <span className={cn('grid size-6 place-items-center rounded-full font-mono text-[10px]', active === s.id ? 'bg-accent text-on-accent' : 'bg-elevated/80')}>{i + 1}</span>
            {r(s.place)}
          </button>
        ))}
      </div>
    </div>
  )
}
