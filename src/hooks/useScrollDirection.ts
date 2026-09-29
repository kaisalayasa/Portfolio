import { useEffect, useRef, useState } from 'react'

/**
 * Hides the nav on scroll down, shows it on scroll up. scrollY is read in the scroll event itself (layout is
 * still clean there; reading it later in a rAF after other code has written styles forces an extra layout
 * every frame), and state only changes when a flag flips.
 */
export function useScrollDirection(threshold = 8) {
  const [state, setState] = useState({ hidden: false, atTop: true })
  const current = useRef(state)
  useEffect(() => {
    let last = scrollY
    const onScroll = () => {
      const y = scrollY
      const s = current.current
      const delta = y - last
      const hidden = y > 120 && (Math.abs(delta) < threshold ? s.hidden : delta > 0)
      const atTop = y < 24
      if (Math.abs(delta) >= threshold) last = y
      if (hidden !== s.hidden || atTop !== s.atTop) setState((current.current = { hidden, atTop }))
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [threshold])
  return state
}
