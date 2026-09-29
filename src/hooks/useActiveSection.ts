import { useEffect, useState } from 'react'

/**
 * Which section id sits in the middle band of the viewport.
 * Sections mount lazily (placeholder → real node), so nodes are re-observed as they change.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const state = new Map<string, boolean>()
    const observed = new WeakSet<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Ignore stale placeholder nodes that have since been replaced.
          if (document.getElementById(e.target.id) === e.target) state.set(e.target.id, e.isIntersecting)
        }
        setActive(ids.find((id) => state.get(id)) ?? '')
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    const scan = () => {
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && !observed.has(el)) {
          observed.add(el)
          io.observe(el)
        }
      }
    }
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.getElementById('main') ?? document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [ids])
  return active
}
