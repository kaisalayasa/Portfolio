import { useMemo } from 'react'
import { languages } from '@/content/languages'
import { useI18n } from '@/lib/i18n'
import { RevealItem } from '@/components/ui/Motion'

type Reviews = Record<string, number>
const DAY = 86_400_000
const iso = (d: Date) => d.toISOString().slice(0, 10)

/** Every day shown on the calendar: the last 365 days, starting on a Sunday. */
function calendarDays() {
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  const start = new Date(end.getTime() - 364 * DAY)
  start.setTime(start.getTime() - start.getUTCDay() * DAY)
  const days: Date[] = []
  for (let d = start; d <= end; d = new Date(d.getTime() + DAY)) days.push(d)
  return days
}

/** An evenly filled year with small random gaps, scaled to `total`. Seeded, so it's identical on every visit. */
function pattern(days: Date[], total: number): Reviews {
  let seed = 11
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const weights = days.map(() => {
    const r = rand()
    return r < 0.05 ? 0 : 0.6 + rand() * 0.8 + (r > 0.93 ? 0.7 : 0)
  })
  const scale = total / (weights.reduce((a, b) => a + b, 0) || 1)
  return Object.fromEntries(days.map((d, i) => [iso(d), Math.round(weights[i] * scale)]))
}

/** GitHub-style calendar of Anki reviews over the last year. */
export function Heatmap({ className }: { className?: string }) {
  const { t, lang } = useI18n()
  const days = useMemo(calendarDays, [])

  const { weeks, max, months } = useMemo(() => {
    const data = pattern(days, languages.anki.reviewsLastYear)
    const weeks: { date: string; n: number }[][] = []
    let max = 0
    const months: { i: number; label: string }[] = []
    const fmt = new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en-US', { month: 'short', timeZone: 'UTC' })
    for (const d of days) {
      if (d.getUTCDay() === 0) {
        weeks.push([])
        if (d.getUTCDate() <= 7) months.push({ i: weeks.length - 1, label: fmt.format(d) })
      }
      const n = data[iso(d)] ?? 0
      max = Math.max(max, n)
      weeks[weeks.length - 1].push({ date: iso(d), n })
    }
    return { weeks, max, months }
  }, [days, lang])
  const total = languages.anki.reviewsLastYear

  const level = (n: number) => (n === 0 ? 0 : Math.min(4, Math.ceil((n / (max || 1)) * 4)))
  const fills = ['var(--heat-0)', 'color-mix(in oklab, var(--accent) 28%, transparent)', 'color-mix(in oklab, var(--accent) 50%, transparent)', 'color-mix(in oklab, var(--accent) 75%, transparent)', 'var(--accent)']
  const cell = 12
  const gap = 3

  return (
    <RevealItem className={className}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-3xl">{t('languages.heatTitle')}</h3>
        <p className="font-mono text-xs text-muted">{t('languages.heatTotal', { n: total.toLocaleString() })}</p>
      </div>
      <div className="no-scrollbar -mx-2 overflow-x-auto rounded-md px-2" data-lenis-prevent tabIndex={0} role="region" aria-label={t('languages.heatTitle')}>
        <svg
          viewBox={`0 0 ${weeks.length * (cell + gap)} ${7 * (cell + gap) + 18}`}
          className="block h-auto w-full min-w-[640px]"
          role="img"
          aria-label={t('languages.heatTotal', { n: total.toLocaleString() })}
        >
          {months.map((mo) => (
            <text key={`${mo.i}-${mo.label}`} x={mo.i * (cell + gap)} y="10" fontSize="10" className="fill-muted font-mono">
              {mo.label}
            </text>
          ))}
          {weeks.map((week, wi) =>
            week.map((day, di) => <rect key={day.date} x={wi * (cell + gap)} y={18 + di * (cell + gap)} width={cell} height={cell} rx="3" fill={fills[level(day.n)]} />),
          )}
        </svg>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[0.65rem] text-muted" aria-hidden>
        {t('languages.less')}
        {fills.map((f) => (
          <span key={f} className="inline-block size-2.5 rounded-[3px]" style={{ background: f }} />
        ))}
        {t('languages.more')}
      </div>
    </RevealItem>
  )
}
