// Usage: npm run icons
// Renders the hanko seal logo into favicon.svg (text converted to paths, no font needed),
// PNG favicons, the apple-touch icon and PWA icons.
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import satori from 'satori'
import sharp from 'sharp'
import { ROOT, h, loadFonts, seal } from './lib/satori-kit.mjs'

const fonts = await loadFonts()
const PUBLIC = path.join(ROOT, 'public')

async function render(size, { bg = null, pad = 0.06 } = {}) {
  const inner = Math.round(size * (1 - pad * 2))
  return satori(
    h('div', { style: { width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg ?? 'transparent' } }, seal({ size: inner })),
    { width: size, height: size, fonts },
  )
}

const favicon = await render(64)
await writeFile(path.join(PUBLIC, 'favicon.svg'), favicon)

const outputs = [
  ['favicon-32.png', 32, {}],
  ['apple-touch-icon.png', 180, { bg: '#0A0E17', pad: 0.14 }],
  ['icon-192.png', 192, {}],
  ['icon-512.png', 512, {}],
  ['icon-maskable-512.png', 512, { bg: '#0A0E17', pad: 0.2 }],
]
for (const [name, size, opts] of outputs) {
  const svg = await render(size, opts)
  await sharp(Buffer.from(svg)).png().toFile(path.join(PUBLIC, name))
}
console.log('[icons] favicon.svg + %d PNGs written to /public', outputs.length)
