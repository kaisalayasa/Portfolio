import { useEffect } from 'react'
import { play } from '@/lib/sound'

/**
 * The intro seal lives in index.html and dismisses itself with CSS after ~1s (so it never
 * waits for JavaScript). This only records the visit, allows click/key to skip, and cleans up.
 * First visit per session only; skipped entirely with reduced motion.
 */
export function Loader() {
  useEffect(() => {
    const root = document.documentElement
    const el = document.getElementById('boot-loader')
    if (!root.classList.contains('is-loading') || !el) return
    try {
      sessionStorage.setItem('qa-loaded', '1')
    } catch {
      /* ignore */
    }
    const skip = () => root.classList.add('loader-out')
    // If JS arrived while the seal is still up, give it its stamp sound (when sounds are on).
    const visible = getComputedStyle(el).visibility !== 'hidden'
    if (visible) play('stamp')
    el.addEventListener('click', skip)
    addEventListener('keydown', skip, { once: true })
    const done = setTimeout(() => el.remove(), 1600)
    return () => {
      clearTimeout(done)
      el.removeEventListener('click', skip)
      removeEventListener('keydown', skip)
    }
  }, [])
  return null
}
