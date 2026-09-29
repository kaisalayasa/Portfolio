import type Lenis from 'lenis'

let lenis: Lenis | null = null
export const setLenis = (l: Lenis | null) => (lenis = l)
export const getLenis = () => lenis

const frame = () => new Promise((r) => requestAnimationFrame(r))

/**
 * Smooth-scrolls to a section, first mounting any lazy sections above it so the
 * target position is final (no landing short while content streams in).
 */
export async function scrollToId(id: string, opts: { instant?: boolean } = {}) {
  dispatchEvent(new Event('qa:mount-all'))
  const started = performance.now()
  await frame()
  while (document.querySelector('[data-lazy-pending]') && performance.now() - started < 2500) await frame()
  await frame()
  const el = document.getElementById(id)
  if (!el) return
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const immediate = opts.instant || reduced
  // Lenis and scrollIntoView both honor the target's scroll-margin (nav clearance). Sections above can
  // still settle after mounting, so re-check once the scroll lands and correct any drift.
  const settle = () => {
    const drift = el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)
    if (Math.abs(drift) > 4) (lenis ? lenis.scrollTo(el, { immediate: true }) : scrollBy(0, drift))
  }
  if (lenis) lenis.scrollTo(el, { immediate, duration: 1.1, onComplete: () => requestAnimationFrame(settle) })
  else {
    el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' })
    setTimeout(settle, immediate ? 50 : 900)
  }
  if (location.hash !== `#${id}`) history.replaceState(history.state, '', `#${id}`)
  // Move focus for keyboard + screen reader users without scrolling again.
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

export function scrollToTop() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (lenis) lenis.scrollTo(0, { immediate: reduced })
  else scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}
