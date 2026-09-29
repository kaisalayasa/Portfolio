/** Local time in the configured timezone (footer clock). */
export function timeIn(timezone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00'
  const hour = Number(get('hour')) % 24
  return { hour, minute: Number(get('minute')), hhmm: `${String(hour).padStart(2, '0')}:${get('minute')}`, ss: get('second') }
}

export function formatMonth(iso: string, lang: 'en' | 'ja') {
  const d = new Date(iso.length === 7 ? `${iso}-01T00:00:00` : iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    ...(iso.length > 7 ? { day: 'numeric' } : {}),
  }).format(d)
}
