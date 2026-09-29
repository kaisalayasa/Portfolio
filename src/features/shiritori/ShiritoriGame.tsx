import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { useI18n } from '@/lib/i18n'
import { track } from '@/lib/analytics'
import { play } from '@/lib/sound'
import { projectBySlug } from '@/content/projects'
import { cn } from '@/lib/cn'
import { btn } from '@/components/ui/Primitives'
import { IconArrowUpRight } from '@/components/ui/Icons'
import { judge, lastKana, reply } from './logic'
import { OPENERS } from './words'

type Turn = { by: 'me' | 'you'; word: string }
type Status = 'playing' | 'won' | 'lost'

const readBest = () => {
  try {
    return Number(localStorage.getItem('qa-shiritori-best') ?? 0)
  } catch {
    return 0
  }
}

export function ShiritoriGame({ compact, autoFocus }: { compact?: boolean; autoFocus?: boolean }) {
  const { t } = useI18n()
  const [chain, setChain] = useState<Turn[]>([])
  const [status, setStatus] = useState<Status>('playing')
  const [message, setMessage] = useState('')
  const [input, setInput] = useState('')
  const [best, setBest] = useState(readBest)
  const [counted, setCounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const fullGame = projectBySlug('shiritori')?.links.live

  const used = useMemo(() => new Set(chain.map((c) => c.word)), [chain])
  const score = chain.filter((c) => c.by === 'you').length
  const last = chain.at(-1)?.word ?? null

  const reset = () => {
    const opener = OPENERS[Math.floor(Math.random() * OPENERS.length)]
    setChain([{ by: 'me', word: opener }])
    setStatus('playing')
    setMessage('')
    setInput('')
    setCounted(false)
  }

  useEffect(reset, [])
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true })
  }, [autoFocus])
  useEffect(() => {
    listRef.current?.scrollTo({ left: listRef.current.scrollWidth, top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [chain])

  const finish = (s: Status, points: number) => {
    setStatus(s)
    if (points > best) {
      setBest(points)
      try {
        localStorage.setItem('qa-shiritori-best', String(points))
      } catch {
        /* ignore */
      }
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (status !== 'playing' || !input.trim()) return
    if (!counted) {
      track('shiritori_played')
      setCounted(true)
    }
    const v = judge(input, last, used)
    if (!v.ok) {
      if (v.reason === 'endsN') {
        setChain((c) => [...c, { by: 'you', word: v.word }])
        setMessage(t('shiritori.youN', { word: v.word }))
        finish('lost', score)
        play('stamp')
      } else {
        const kana = last ? lastKana(last) : ''
        setMessage(
          v.reason === 'mustStart'
            ? t('shiritori.mustStart', { kana })
            : v.reason === 'used'
              ? t('shiritori.used', { word: v.word })
              : v.reason === 'tooShort'
                ? t('shiritori.tooShort')
                : t('shiritori.notKana'),
        )
      }
      return
    }
    play('pop')
    const nextUsed = new Set(used).add(v.word)
    const mine = reply(v.word, nextUsed)
    setInput('')
    if (!mine) {
      setChain((c) => [...c, { by: 'you', word: v.word }])
      setMessage(t('shiritori.iLose', { kana: lastKana(v.word) }))
      finish('won', score + 1)
      return
    }
    setChain((c) => [...c, { by: 'you', word: v.word }, { by: 'me', word: mine }])
    setMessage('')
  }

  const need = last ? lastKana(last) : ''

  return (
    <div className={cn('flex flex-col', compact ? 'gap-3' : 'gap-5')}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-xs text-muted">
          {t('shiritori.score', { n: score })} · {t('shiritori.best', { n: best })}
        </p>
        {!compact && <p className="text-xs text-muted">{t('shiritori.rules')}</p>}
      </div>

      <ol
        ref={listRef}
        className={cn('no-scrollbar flex gap-2 overflow-x-auto py-1', compact ? 'min-h-10' : 'min-h-12 flex-wrap overflow-x-visible')}
        aria-live="polite"
        aria-label="Word chain"
      >
        <AnimatePresence initial={false}>
          {chain.map((turn, i) => (
            <m.li
              key={`${i}-${turn.word}`}
              initial={{ opacity: 0, scale: 0.8, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                'shrink-0 rounded-full border px-3.5 py-1.5 font-jp text-sm',
                turn.by === 'me' ? 'border-accent/40 bg-accent-soft text-ink' : 'border-line-strong bg-elevated',
                status === 'lost' && i === chain.length - 1 && 'border-accent bg-accent text-on-accent line-through',
              )}
              lang="ja"
            >
              {turn.word}
            </m.li>
          ))}
        </AnimatePresence>
      </ol>

      {status === 'playing' ? (
        <form onSubmit={submit} className="flex gap-2">
          <label className="sr-only" htmlFor={compact ? 'shiritori-input-c' : 'shiritori-input'}>
            {t('shiritori.inputLabel')}
          </label>
          <input
            ref={inputRef}
            id={compact ? 'shiritori-input-c' : 'shiritori-input'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={need ? `${need}… (${t('shiritori.placeholder')})` : t('shiritori.placeholder')}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            lang="ja"
            className="min-h-11 min-w-0 flex-1 rounded-full border border-line-strong bg-bg/60 px-4 font-jp text-base outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
          />
          <button type="submit" className={btn('primary', 'px-5')}>
            {t('shiritori.submit')}
          </button>
        </form>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={reset} className={btn('primary')}>
            {t('shiritori.again')}
          </button>
          {fullGame && (
            <a href={fullGame} target="_blank" rel="noreferrer" className={btn('ghost')}>
              {t('shiritori.full')} <IconArrowUpRight size={15} />
            </a>
          )}
        </div>
      )}

      <p className={cn('min-h-5 text-sm', status === 'won' ? 'text-duo' : status === 'lost' ? 'text-accent' : 'text-muted')} role="status">
        {message || (status === 'playing' && need ? t('shiritori.yourTurn', { kana: need }) : '')}
      </p>
    </div>
  )
}
