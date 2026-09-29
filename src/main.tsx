import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

// Latin fonts are critical; Japanese/Arabic load after the page's load event.
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './styles/index.css'

import { Root } from './Root'

const loadIntlFonts = () => import('./styles/fonts-intl')
if (document.readyState === 'complete') loadIntlFonts()
else addEventListener('load', () => ('requestIdleCallback' in window ? requestIdleCallback(loadIntlFonts, { timeout: 1500 }) : setTimeout(loadIntlFonts, 200)), { once: true })

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <Root />
  </StrictMode>
)

// Prerendered HTML is English: hydrate it, unless the visitor chose Japanese (fresh render, no English flash).
const here = location.pathname.slice(import.meta.env.BASE_URL.length - 1).replace(/(.)\/$/, '$1') || '/'
const prerendered = container.dataset.route === here && container.hasChildNodes()
if (prerendered && document.documentElement.lang !== 'ja') hydrateRoot(container, app)
else {
  container.textContent = ''
  createRoot(container).render(app)
}
