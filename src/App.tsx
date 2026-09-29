import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { matchPath, useLocation } from '@/lib/router'
import { AnimatePresence } from 'motion/react'
import { ui } from '@/lib/store'
import { initAnalytics, track, trackPageview } from '@/lib/analytics'
import { consoleHello } from '@/lib/console'
import { getLenis, scrollToId, setLenis } from '@/lib/scroll'
import { play } from '@/lib/sound'
import { useKeySequence } from '@/hooks/useKeySequence'
import { useIsTouch, useReducedMotion } from '@/hooks/useMediaQuery'
import { Nav } from '@/components/Nav'
import { Loader } from '@/components/Loader'
import { Cursor } from '@/components/Cursor'
import { Confetti } from '@/components/Confetti'
import { Toaster } from '@/components/ui/Primitives'
import Home from '@/pages/Home'

const CaseStudy = lazy(() => import('@/pages/CaseStudy'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const CommandPalette = lazy(() => import('@/components/CommandPalette'))
const ShiritoriModal = lazy(() => import('@/features/shiritori/ShiritoriModal'))

const SEQUENCES = {
  shiritori: [...'shiritori'],
  siritori: [...'siritori'],
  kana: [...'しりとり'],
  konami: ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'],
}

/**
 * Lenis smooth wheel scrolling, desktop only. On touch devices native scrolling is smoother, and Lenis's
 * non-passive touch listeners would make scrolling wait on the main thread.
 * A leaf component, so its media-query re-render can't touch the route tree mid-hydration.
 */
function SmoothScroll() {
  const reduced = useReducedMotion()
  const touch = useIsTouch()
  useEffect(() => {
    if (reduced || touch) return
    let raf = 0
    let alive = true
    let instance: import('lenis').default | null = null
    import('lenis').then(({ default: Lenis }) => {
      if (!alive) return
      instance = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
      setLenis(instance)
      const loop = (time: number) => {
        instance?.raf(time)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    })
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      instance?.destroy()
      setLenis(null)
    }
  }, [reduced, touch])
  return null
}

/** Marks top-level page blocks that are off screen, which pauses their CSS animations (see [data-offscreen] in index.css). */
function usePauseOffscreen() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.toggleAttribute('data-offscreen', !e.isIntersecting)), { rootMargin: '200px 0px' })
    const seen = new WeakSet<Element>()
    const scan = () =>
      document.querySelectorAll('main > *, #root > footer').forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        io.observe(el)
      })
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.getElementById('root') ?? document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}

/** Scroll to top on route change, or to the #section in the URL. Also counts page views. */
function useRouteEffects() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) scrollToId(hash.slice(1), { instant: true })
    else {
      getLenis()?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
    }
    trackPageview(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
}

function Page() {
  const { pathname } = useLocation()
  if (pathname === '/') return <Home />
  const cs = matchPath('/projects/:slug', pathname)
  return <Suspense fallback={<div className="min-h-screen" />}>{cs ? <CaseStudy key={cs.slug} slug={cs.slug} /> : <NotFound />}</Suspense>
}

export default function App() {
  const { palette, shiritori } = ui.use()
  const [paletteLoaded, setPaletteLoaded] = useState(false)
  const [confetti, setConfetti] = useState(0)
  useRouteEffects()
  usePauseOffscreen()

  useEffect(() => {
    consoleHello()
    initAnalytics()
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        ui.set((s) => ({ ...s, palette: !s.palette }))
      }
    }
    // Printing needs every lazy section mounted (the résumé lives far down the page).
    const onPrint = () => dispatchEvent(new Event('qa:mount-all'))
    addEventListener('keydown', onKey)
    addEventListener('beforeprint', onPrint)
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('beforeprint', onPrint)
    }
  }, [])

  useEffect(() => {
    if (palette) setPaletteLoaded(true)
  }, [palette])

  const sequences = useMemo(() => SEQUENCES, [])
  useKeySequence(sequences, (name) => {
    if (name === 'konami') {
      setConfetti(Date.now())
      play('stamp')
      track('easter_egg', { id: 'konami' })
    } else if (!ui.get().shiritori) {
      ui.set((s) => ({ ...s, shiritori: true }))
      track('easter_egg', { id: 'shiritori' })
    }
  })

  return (
    <>
      <Loader />
      <Nav />
      <Cursor />
      <div className="grain" aria-hidden />
      <Toaster />
      <Confetti fire={confetti} />
      <Suspense fallback={null}>
        {paletteLoaded && <CommandPalette />}
        <AnimatePresence>{shiritori && <ShiritoriModal key="shiritori" />}</AnimatePresence>
      </Suspense>

      <SmoothScroll />
      <Page />
    </>
  )
}
