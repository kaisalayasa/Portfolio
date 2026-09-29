import { useEffect, useState } from 'react'
import { m } from 'motion/react'
import { Seal } from './ui/Seal'

const STAMPS = ['Q', '学', '作', '先', '日', '愛', '夢', '友']

type Particle = { x: number; y: number; rot: number; size: number; ch: string }
const makeBurst = (): Particle[] =>
  Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.4
    const dist = 180 + Math.random() * 320
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      rot: (Math.random() - 0.5) * 540,
      size: 28 + Math.random() * 22,
      ch: STAMPS[i % STAMPS.length],
    }
  })

/** Konami-code reward: a burst of hanko stamps. */
export function Confetti({ fire }: { fire: number }) {
  const [bursts, setBursts] = useState<{ id: number; parts: Particle[] }[]>([])
  useEffect(() => {
    if (!fire) return
    setBursts((b) => [...b, { id: fire, parts: makeBurst() }])
    const t = setTimeout(() => setBursts((b) => b.filter((x) => x.id !== fire)), 2600)
    return () => clearTimeout(t)
  }, [fire])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-95 overflow-hidden">
      {bursts.map(({ id, parts }) =>
        parts.map((p, i) => (
          <m.div
            key={`${id}-${i}`}
            className="absolute top-1/2 left-1/2"
            initial={{ x: 0, y: 0, scale: 0.2, rotate: 0, opacity: 1 }}
            animate={{ x: p.x, y: [0, p.y - 120, p.y + 260], scale: [0.2, 1, 0.9], rotate: p.rot, opacity: [1, 1, 0] }}
            transition={{ duration: 2.2, ease: [0.2, 0.8, 0.4, 1] }}
          >
            <Seal text={p.ch} size={p.size} rotate={0} />
          </m.div>
        )),
      )}
    </div>
  )
}
