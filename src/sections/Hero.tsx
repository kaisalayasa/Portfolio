import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { profile } from '@/content/profile'
import { useI18n } from '@/lib/i18n'
import { asset, hasAsset } from '@/lib/media'
import { scrollToId } from '@/lib/scroll'
import { track } from '@/lib/analytics'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { btn } from '@/components/ui/Primitives'
import { Magnetic } from '@/components/ui/Motion'
import { Media } from '@/components/ui/Media'
import { IconArrowRight, IconGitHub, IconLinkedIn } from '@/components/ui/Icons'

const GREETINGS = [
  { text: 'Hi, I’m Qais.', lang: 'en', dir: 'ltr' },
  { text: 'こんにちは、カイスです。', lang: 'ja', dir: 'ltr' },
  { text: 'مرحبا، أنا قيس', lang: 'ar', dir: 'rtl' },
] as const

/** Windows has no flag emoji, so Japan's flag is drawn; other flags fall back to the emoji. */
function Flag({ emoji }: { emoji: string }) {
  if (emoji !== '🇯🇵') return <span aria-hidden>{emoji}</span>
  return (
    <svg viewBox="0 0 30 20" width="17" height="11" className="ml-0.5 inline-block rounded-[2px] align-[-1px] shadow-[0_0_0_1px_var(--border)]" aria-label="Japan">
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </svg>
  )
}

function Greeting() {
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (reduced || !ref.current) return
    let id: ReturnType<typeof setInterval> | undefined
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id)
      if (e.isIntersecting) id = setInterval(() => setI((x) => (x + 1) % GREETINGS.length), 2600)
    })
    io.observe(ref.current)
    return () => {
      io.disconnect()
      clearInterval(id)
    }
  }, [reduced])
  const g = GREETINGS[i]
  return (
    <p ref={ref} className="relative h-9 overflow-hidden text-xl text-muted md:text-2xl">
      <span className="sr-only">Hi, I’m Qais. こんにちは、カイスです。 مرحبا، أنا قيس</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={g.text}
          lang={g.lang}
          dir={g.dir}
          aria-hidden
          className="absolute inset-y-0 left-0 whitespace-nowrap"
          style={{ fontFamily: g.lang === 'ja' ? 'var(--font-mincho)' : g.lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-display)' }}
          initial={{ opacity: 0, y: '60%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-60%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {g.text}
        </m.span>
      </AnimatePresence>
    </p>
  )
}

/** Headline with a per-word mask reveal; "*word*" renders in italic accent-colored serif. */
function Headline({ text }: { text: string }) {
  // Japanese has no spaces: split it into real words so the reveal and line breaks feel natural.
  const words = (part: string) =>
    /[぀-ヿ一-鿿]/.test(part) && typeof Intl.Segmenter === 'function'
      ? [...new Intl.Segmenter('ja', { granularity: 'word' }).segment(part)].map((x) => x.segment)
      : part.split(/(\s+)/).filter(Boolean)
  const raw = text.split(/(\*[^*]+\*)/g).flatMap((part) =>
    part.startsWith('*') ? [{ w: part.slice(1, -1), em: true, tail: '' }] : words(part).map((w) => ({ w, em: false, tail: '' })),
  )
  // Glue punctuation to the word before it so "engineering," never wraps apart.
  const tokens: typeof raw = []
  for (const tok of raw) {
    const prev = tokens.at(-1)
    const punct = tok.w.match(/^[,.;:!?、。]+/)?.[0]
    if (punct && prev && !/^\s+$/.test(prev.w)) {
      prev.tail += punct
      const rest = tok.w.slice(punct.length)
      if (rest) tokens.push({ ...tok, w: rest })
    } else tokens.push(tok)
  }
  let wordIndex = 0
  return (
    <h1 className="hero-title font-display text-[clamp(2.8rem,6.6vw,6.1rem)] leading-[0.96] tracking-[-0.035em] text-balance-pretty">
      <span className="sr-only">{text.replace(/\*/g, '')}</span>
      <span aria-hidden>
        {tokens.map((tok, i) => {
          if (/^\s+$/.test(tok.w)) return ' '
          const idx = wordIndex++
          return (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom -mb-[0.08em]">
              <span className="reveal-word" style={{ ['--i' as string]: idx }}>
                {tok.em ? <em className="pr-[0.04em] text-accent">{tok.w}</em> : tok.w}
                {tok.tail}
              </span>
            </span>
          )
        })}
      </span>
    </h1>
  )
}

function Portrait() {
  const { t } = useI18n()
  const { portrait, chips } = profile.hero
  const positions = [
    'top-[8%] -left-8',
    'top-[34%] -right-7',
    'bottom-[26%] -left-10',
    'bottom-[7%] right-4',
    '-top-4 right-[18%]',
  ]
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="card relative overflow-hidden rounded-[30px] p-2" style={{ aspectRatio: '4/5' }}>
        <Media src={portrait} alt={t('hero.portraitAlt')} priority className="h-full w-full rounded-[24px]" sizes="(min-width: 1024px) 420px, 80vw" />
      </div>
      {chips.map((c, i) => (
        <span
          key={c}
          className={`float-chip glass absolute hidden rounded-full px-3.5 py-1.5 font-mono text-xs shadow-lg md:inline-block ${positions[i % positions.length]}`}
          style={{ ['--dur' as string]: `${5 + i}s`, ['--delay' as string]: `${i * -1.3}s` }}
          aria-hidden
        >
          {i === 0 && <span className="mr-1.5 inline-block size-1.5 rounded-full bg-accent align-middle" />}
          {c}
        </span>
      ))}
    </div>
  )
}

export function Hero() {
  const { t, r } = useI18n()
  const { linkedin } = profile.links
  const hasResume = hasAsset(profile.resume.pdf)

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-24 md:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -top-40 -right-40 size-[620px] rounded-full bg-accent/20 blur-[120px] dark:bg-accent/25" />
        <div className="animate-drift absolute bottom-[-20%] -left-40 size-[520px] rounded-full bg-indigo/15 blur-[120px] [animation-delay:-8s]" />
      </div>

      <div className="container-page grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <div className="hero-fade mb-7 inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-surface/70 py-1.5 pr-4 pl-3 text-[0.8rem] backdrop-blur" style={{ ['--d' as string]: '0.1s' }}>
            <span className="relative inline-flex size-2 shrink-0 rounded-full bg-[#3ecf6e] text-[#3ecf6e] animate-pulse-dot" aria-hidden />
            <span className="truncate">
              <span className="text-ink">
                {t('hero.status', { city: r(profile.now.city) })} <Flag emoji={profile.now.flag} />
              </span>
              <span className="text-muted"> · {r(profile.now.status)}</span>
            </span>
          </div>

          <div className="hero-fade mb-3" style={{ ['--d' as string]: '0.2s' }}>
            <Greeting />
          </div>

          <Headline text={r(profile.headline)} />

          <p className="hero-fade mt-7 max-w-xl text-lg leading-relaxed text-muted md:text-xl" style={{ ['--d' as string]: '0.75s' }}>
            {r(profile.intro)}
          </p>

          <div className="hero-fade mt-9 flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '0.9s' }}>
            <Magnetic>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId('projects')
                }}
                className={btn('primary', 'h-12 px-7 text-[0.95rem]')}
              >
                {t('hero.cta')}
                <IconArrowRight size={17} className="transition-transform group-hover/btn:translate-x-0.5" />
              </a>
            </Magnetic>
            <a
              href={hasResume ? asset(profile.resume.pdf) : '#resume'}
              {...(hasResume ? { target: '_blank', rel: 'noreferrer' } : {})}
              onClick={(e) => {
                if (hasResume) track('resume_download', { from: 'hero' })
                else {
                  e.preventDefault()
                  scrollToId('resume')
                }
              }}
              className={btn('ghost', 'h-12')}
            >
              {t('hero.resume')}
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className={btn('icon', 'size-12')} aria-label="GitHub">
              <IconGitHub />
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className={btn('icon', 'size-12')}
              aria-label="LinkedIn"
              onClick={() => track('linkedin_click', { from: 'hero' })}
            >
              <IconLinkedIn />
            </a>
          </div>
        </div>

        <div className="hero-fade" style={{ ['--d' as string]: '0.45s' }}>
          <Portrait />
        </div>
      </div>

      <a
        href="#experience"
        onClick={(e) => {
          e.preventDefault()
          scrollToId('experience')
        }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted md:flex"
        aria-label={t('hero.scroll')}
      >
        <span className="kicker text-[0.62rem]">{t('hero.scroll')}</span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="scroll-line absolute inset-0 bg-accent" />
        </span>
      </a>
    </section>
  )
}
