import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from '@/lib/router'
import { AnimatePresence, m, useScroll } from 'motion/react'
import { useI18n, type TKey } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { ui } from '@/lib/store'
import { scrollToId, scrollToTop } from '@/lib/scroll'
import { toggleSound, useSoundEnabled, play } from '@/lib/sound'
import type { SectionId } from '@/lib/sections'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { cn } from '@/lib/cn'
import { Seal } from './ui/Seal'
import { IconClose, IconCommand, IconMenu, IconMoon, IconSoundOff, IconSoundOn, IconSun } from './ui/Icons'

export const NAV_ITEMS: { id: SectionId; key: TKey; jp: string }[] = [
  { id: 'experience', key: 'nav.experience', jp: '経歴' },
  { id: 'education', key: 'nav.education', jp: '学歴' },
  { id: 'projects', key: 'nav.projects', jp: '作品' },
  { id: 'languages', key: 'nav.languages', jp: '言語' },
  { id: 'life', key: 'nav.life', jp: '写真' },
  { id: 'music', key: 'nav.music', jp: '音楽' },
  { id: 'activities', key: 'nav.activities', jp: '課外活動' },
  { id: 'resume', key: 'nav.resume', jp: '履歴書' },
  { id: 'contact', key: 'nav.contact', jp: '連絡' },
]

/** Navigate to a home-page section from anywhere (case studies included). */
export function useGoToSection() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  return (id: string) => {
    ui.set((s) => ({ ...s, menu: false }))
    if (pathname === '/') scrollToId(id)
    else nav(`/#${id}`)
  }
}

export function Nav() {
  const { t, lang, toggleLang } = useI18n()
  const { toggle } = useTheme()
  const sound = useSoundEnabled()
  const { menu } = ui.use()
  const { pathname } = useLocation()
  const home = pathname === '/'
  const items = NAV_ITEMS
  const ids = useMemo(() => items.map((i) => i.id), [items])
  const active = useActiveSection(home ? ids : [])
  const { hidden, atTop } = useScrollDirection()
  const { scrollYProgress } = useScroll()
  const go = useGoToSection()
  const [isMac, setIsMac] = useState(false)
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), [])

  const onLink = (e: MouseEvent, id: string) => {
    e.preventDefault()
    play('click')
    go(id)
  }

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  const show = !hidden || menu

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-100 -translate-y-20 rounded-full bg-accent-ink px-4 py-2 text-sm text-on-accent focus:translate-y-0"
      >
        {t('nav.skip')}
      </a>
      <m.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4"
        initial={false}
        animate={{ y: show ? 0 : -96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        data-print="hide"
      >
        <nav
          aria-label={t('nav.primary')}
          className={cn(
            'glass relative flex h-14 w-full max-w-[1120px] items-center gap-1 rounded-full pr-2 pl-2 transition-shadow duration-500 md:pl-3',
            !atTop && 'shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]',
          )}
        >
          <Link
            to="/"
            onClick={(e) => {
              if (home) {
                e.preventDefault()
                scrollToTop()
              }
            }}
            className="flex min-h-11 items-center gap-2.5 rounded-full pr-3 pl-1"
            aria-label="Qais Alayasa — home"
          >
            <Seal size={34} />
            <span className="hidden font-display text-lg leading-none whitespace-nowrap sm:inline lg:hidden xl:inline">Qais Alayasa</span>
          </Link>

          <ul className="mx-auto hidden items-center gap-0.5 lg:flex">
            {items.map((item) => (
              <li key={item.id} className="relative">
                <a
                  href={`${import.meta.env.BASE_URL}#${item.id}`}
                  onClick={(e) => onLink(e, item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={cn(
                    'relative z-10 flex min-h-10 items-center rounded-full px-3 text-[0.84rem] whitespace-nowrap transition-colors xl:px-3.5',
                    active === item.id ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  {t(item.key)}
                </a>
                {active === item.id && (
                  <m.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-ink/7" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button
              type="button"
              onClick={toggleLang}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 font-mono text-xs whitespace-nowrap text-muted transition-colors hover:bg-ink/5 hover:text-ink"
              title={t('nav.langLabel')}
            >
              <span lang={lang === 'en' ? 'ja' : 'en'}>{lang === 'en' ? '日本語' : 'EN'}</span>
              <span className="sr-only">: {t('nav.langLabel')}</span>
            </button>
            <button
              type="button"
              onClick={toggle}
              className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
              aria-label={t('nav.theme')}
            >
              {/* Both icons render; CSS shows the right one, so prerendered HTML matches every theme. */}
              <IconSun className="hidden transition-transform duration-300 hover:rotate-45 dark:block" />
              <IconMoon className="block transition-transform duration-300 hover:-rotate-12 dark:hidden" />
            </button>
            <button
              type="button"
              onClick={toggleSound}
              className="hidden size-11 place-items-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink sm:grid"
              aria-label={sound ? t('nav.soundOff') : t('nav.soundOn')}
              aria-pressed={sound}
            >
              {sound ? <IconSoundOn /> : <IconSoundOff />}
            </button>
            <button
              type="button"
              onClick={() => ui.set((s) => ({ ...s, palette: true }))}
              className="hidden min-h-11 items-center gap-1.5 rounded-full border border-line px-3 font-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-ink md:flex"
              aria-label={t('nav.palette')}
              aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
            >
              {isMac ? <IconCommand size={13} /> : <span>Ctrl</span>}
              <span>K</span>
            </button>
            <button
              type="button"
              onClick={() => ui.set((s) => ({ ...s, menu: !s.menu }))}
              className="grid size-11 place-items-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
              aria-label={menu ? t('nav.close') : t('nav.menu')}
              aria-expanded={menu}
              aria-controls="mobile-menu"
            >
              {menu ? <IconClose /> : <IconMenu />}
            </button>
          </div>

          {/* Scroll progress: a motion value, so scrolling never re-renders the nav */}
          {home && <m.span aria-hidden className="absolute right-6 bottom-0 left-6 h-px origin-left bg-accent/80" style={{ scaleX: scrollYProgress }} />}
        </nav>
      </m.header>

      <AnimatePresence>
        {menu && (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-bg/95 px-6 pt-28 pb-10 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
          >
            <m.ul
              className="flex flex-col gap-1"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {items.map((item, i) => (
                <m.li key={item.id} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}>
                  <a
                    href={`${import.meta.env.BASE_URL}#${item.id}`}
                    onClick={(e) => onLink(e, item.id)}
                    className="flex items-baseline gap-4 border-b border-line py-3"
                  >
                    <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-[2.6rem] leading-none">{t(item.key)}</span>
                    <span className="ml-auto font-mincho text-sm text-muted" aria-hidden>
                      {item.jp}
                    </span>
                  </a>
                </m.li>
              ))}
            </m.ul>
            <div className="mt-auto flex items-center gap-3 pt-8 text-sm text-muted">
              <button type="button" className="rounded-full border border-line px-4 py-2.5" onClick={() => ui.set((s) => ({ ...s, menu: false, palette: true }))}>
                {t('nav.palette')}
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
