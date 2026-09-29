import { LazyMotion, MotionConfig } from 'motion/react'
import { ThemeProvider } from '@/lib/theme'
import { I18nProvider } from '@/lib/i18n'
import { Router } from '@/lib/router'
import App from './App'

// Animation features load in parallel with first paint (keeps the entry bundle small).
const loadFeatures = () => import('./lib/motion-features').then((m) => m.default)

/** The whole app. Shared by the browser entry (main.tsx) and the prerenderer (entry-server.tsx). */
export function Root({ url }: { url?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        <ThemeProvider>
          <I18nProvider>
            <Router initial={url}>
              <App />
            </Router>
          </I18nProvider>
        </ThemeProvider>
      </LazyMotion>
    </MotionConfig>
  )
}
