// After `vite build`: prerender "/" and each case study to HTML, write per-route meta, 404.html, sitemap and robots.
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { BASE, CUSTOM_DOMAIN, SITE_URL } from '../site.config.ts'
import { projects } from '../src/content/projects.ts'
import { profile } from '../src/content/profile.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
// First paint needs only HTML + CSS, so JS (hydration) starts at first contentful paint; a timer covers background tabs.
function deferScripts(html) {
  const preloads = [...html.matchAll(/<link rel="modulepreload"[^>]*href="([^"]+)"[^>]*>\s*/g)]
  const entry = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>\s*/)
  if (!entry) return html
  for (const [tag] of preloads) html = html.replace(tag, '')
  html = html.replace(entry[0], '')
  const boot = `<script type="module">let s=0;const go=()=>{if(s++)return;for(const h of ${JSON.stringify(preloads.map((m) => m[1]))}){const l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=h;document.head.append(l)}import(${JSON.stringify(entry[1])})};try{new PerformanceObserver((l,o)=>{if(l.getEntriesByName('first-contentful-paint').length){o.disconnect();setTimeout(go)}}).observe({type:'paint',buffered:true})}catch{go()}setTimeout(go,3000)</script>`
  return html.replace('</body>', () => boot + '\n  </body>')
}

// Preload the hero's fonts so they download alongside the CSS.
const assetFiles = await readdir(path.join(DIST, 'assets'))
const heroFonts = ['geist-latin-wght-normal', 'instrument-serif-latin-400-normal', 'instrument-serif-latin-400-italic']
  .map((name) => assetFiles.find((f) => f.startsWith(`${name}-`) && f.endsWith('.woff2')))
  .filter(Boolean)
const fontPreloads = heroFonts.map((f) => `<link rel="preload" href="${BASE}assets/${f}" as="font" type="font/woff2" crossorigin />`).join('\n    ')
const shell = deferScripts((await readFile(path.join(DIST, 'index.html'), 'utf8')).replace('<link rel="icon"', `${fontPreloads}
    <link rel="icon"`))
const { render } = await import(pathToFileURL(path.join(ROOT, 'dist-ssr', 'entry-server.js')).href)
const prerender = async (url, html) => html.replace('<div id="root"></div>', `<div id="root" data-route="${url}">${await render(url)}</div>`)
const en = (v) => (typeof v === 'string' ? v : v.en)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function withMeta(html, { title, description, url, noindex = false }) {
  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  if (noindex) out = out.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex" />')
  return out
}

const routes = ['/']
for (const p of projects.filter((x) => x.caseStudy)) {
  const route = `/projects/${p.slug}/`
  const title = `${en(p.title)} — Case study · ${profile.name}`
  const description = en(p.summary)
  const dir = path.join(DIST, 'projects', p.slug)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), await prerender(`/projects/${p.slug}`, withMeta(shell, { title, description, url: `${SITE_URL}${route}` })))
  routes.push(route)
}

await writeFile(
  path.join(DIST, '404.html'),
  withMeta(shell, { title: `迷子になりました — ${profile.name}`, description: 'Page not found.', url: `${SITE_URL}/`, noindex: true }),
)

// Home last: 404.html above must stay an empty shell (the router renders 迷子になりました).
await writeFile(path.join(DIST, 'index.html'), await prerender('/', shell))
await rm(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true })

const today = new Date().toISOString().slice(0, 10)
await writeFile(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE_URL}${r}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`,
)
if (CUSTOM_DOMAIN) await writeFile(path.join(DIST, 'CNAME'), `${CUSTOM_DOMAIN}
`)
await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

console.log(`[postbuild] ${routes.length - 1} case-study pages, 404.html, sitemap.xml, robots.txt → dist/`)
