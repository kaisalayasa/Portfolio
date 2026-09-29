/**
 * Background mounting for lazy sections. Once the visitor starts interacting, pending sections mount one
 * at a time while scrolling is paused, so they're usually ready before they're scrolled to and building
 * them never hitches a scroll. Nothing runs during page load (first paint and Lighthouse are unaffected).
 */
type Job = () => void

const queue: Job[] = []
const QUIET_MS = 300
/** Let the hero intro finish before any background work. */
const START_AFTER_MS = 2500
let armed = false
let running = false
let lastScroll = 0

const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 2000 }) : setTimeout(cb, 200))

function pump() {
  if (running || !armed) return
  running = true
  const tick = () => {
    if (!queue.length) return void (running = false)
    if (performance.now() < START_AFTER_MS) return void setTimeout(tick, START_AFTER_MS - performance.now())
    const quiet = performance.now() - lastScroll
    if (quiet < QUIET_MS) return void setTimeout(tick, QUIET_MS - quiet + 20)
    idle(() => {
      if (performance.now() - lastScroll < QUIET_MS) return tick()
      queue.shift()?.()
      // Give the commit and layout a moment to land before starting the next section.
      setTimeout(tick, 120)
    })
  }
  tick()
}

/** Queues a mount; returns a function that removes it (call it when the section mounts some other way). */
export function queueMount(job: Job) {
  queue.push(job)
  pump()
  return () => {
    const i = queue.indexOf(job)
    if (i >= 0) queue.splice(i, 1)
  }
}

if (typeof window !== 'undefined') {
  const events = ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'wheel'] as const
  const arm = () => {
    if (armed) return
    armed = true
    for (const e of events) removeEventListener(e, arm)
    pump()
  }
  for (const e of events) addEventListener(e, arm, { passive: true })
  addEventListener(
    'scroll',
    () => {
      lastScroll = performance.now()
      arm()
    },
    { passive: true },
  )
}
