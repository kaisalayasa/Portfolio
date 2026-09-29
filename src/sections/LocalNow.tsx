import { useEffect, useRef, useState } from 'react'
import { profile } from '@/content/profile'
import { useI18n } from '@/lib/i18n'
import { timeIn } from '@/lib/time'
import { useNow } from '@/hooks/useNow'

type Weather = { temp: number; code: number; isDay: boolean }

// WMO weather codes → icon + label
const WMO: [number[], string, string, string][] = [
  [[0], '☀️', 'Clear', '晴れ'],
  [[1, 2], '🌤️', 'Partly cloudy', '晴れ時々くもり'],
  [[3], '☁️', 'Cloudy', 'くもり'],
  [[45, 48], '🌫️', 'Fog', '霧'],
  [[51, 53, 55, 56, 57], '🌦️', 'Drizzle', '霧雨'],
  [[61, 63, 65, 66, 67, 80, 81, 82], '🌧️', 'Rain', '雨'],
  [[71, 73, 75, 77, 85, 86], '❄️', 'Snow', '雪'],
  [[95, 96, 99], '⛈️', 'Thunderstorm', '雷雨'],
]
const describe = (code: number, isDay: boolean) => {
  const hit = WMO.find(([codes]) => codes.includes(code)) ?? WMO[2]
  return { icon: code === 0 && !isDay ? '🌙' : hit[1], en: hit[2], ja: hit[3] }
}

/** "13:38 JST · Morioka · 🌤️ 22° Partly cloudy". Weather (Open-Meteo) is fetched only once the footer is near view. */
export function LocalNow() {
  const { t, r, lang } = useI18n()
  const cfg = profile.now
  const ref = useRef<HTMLParagraphElement>(null)
  const date = useNow(15_000)
  const [mounted, setMounted] = useState(false)
  const [weather, setWeather] = useState<Weather | null>(null)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctrl = new AbortController()
    const io = new IntersectionObserver((e) => {
      if (!e[0].isIntersecting) return
      io.disconnect()
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${cfg.lat}&longitude=${cfg.lon}&current=temperature_2m,weather_code,is_day`, { signal: ctrl.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((j) => setWeather({ temp: j.current.temperature_2m, code: j.current.weather_code, isDay: !!j.current.is_day }))
        .catch(() => {})
    }, { rootMargin: '400px 0px' })
    io.observe(el)
    return () => {
      io.disconnect()
      ctrl.abort()
    }
  }, [cfg.lat, cfg.lon])

  const city = r(cfg.cityShort)
  const w = weather && describe(weather.code, weather.isDay)
  return (
    <p ref={ref} className="flex min-h-6 flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-muted">
      <span className="inline-flex items-center gap-1.5" title={t('now.time', { city })}>
        <span className="size-1.5 animate-pulse-dot rounded-full bg-accent text-accent" aria-hidden />
        {mounted ? <time dateTime={date.toISOString()}>{timeIn(cfg.timezone, date).hhmm}</time> : '--:--'} {cfg.tzLabel}
      </span>
      <span aria-hidden>·</span>
      <span>{city}</span>
      {w && weather && (
        <>
          <span aria-hidden>·</span>
          <span title={t('now.weather', { city })}>
            <span aria-hidden>{w.icon}</span> {Math.round(weather.temp)}° {w[lang]}
          </span>
        </>
      )}
    </p>
  )
}
