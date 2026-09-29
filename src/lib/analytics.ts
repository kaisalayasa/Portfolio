import { GOATCOUNTER } from '../../site.config.ts'

/** The site's one tracking API (GoatCounter, cookieless). Every call is a no-op until GOATCOUNTER is set. */
type EventName =
  | 'resume_download'
  | 'project_link'
  | 'case_study_open'
  | 'video_play'
  | 'linkedin_click'
  | 'email_copy'
  | 'language_toggle'
  | 'theme_toggle'
  | 'shiritori_played'
  | 'shiritori_play'
  | 'palette_open'
  | 'easter_egg'

type Props = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    goatcounter?: { count?: (o: { path: string; title?: string; event?: boolean }) => void; no_onload?: boolean }
  }
}

let started = false

/** Loads GoatCounter once the page is idle, so it never competes with first paint. */
export function initAnalytics() {
  if (started || import.meta.env.DEV || !GOATCOUNTER) return
  started = true
  const start = () => {
    window.goatcounter = { no_onload: true }
    const s = document.createElement('script')
    s.async = true
    s.src = 'https://gc.zgo.at/count.js'
    s.dataset.goatcounter = `https://${GOATCOUNTER}.goatcounter.com/count`
    s.onload = () => trackPageview(location.pathname)
    document.head.appendChild(s)
  }
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 4000 })
  else setTimeout(start, 2500)
}

export function trackPageview(path: string) {
  try {
    window.goatcounter?.count?.({ path, title: document.title })
  } catch {
    /* analytics must never break the page */
  }
}

export function track(name: EventName, props: Props = {}) {
  if (import.meta.env.DEV) {
    console.debug('[track]', name, props)
    return
  }
  try {
    const suffix = props.id ?? props.slug ?? props.label ?? ''
    window.goatcounter?.count?.({ path: `event/${name}${suffix ? `/${suffix}` : ''}`, title: name, event: true })
  } catch {
    /* ignore */
  }
}
