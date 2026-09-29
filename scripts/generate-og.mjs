// Usage: npm run og
// Designs the 1200×630 share image (public/og/og.png) from profile content.
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import satori from 'satori'
import sharp from 'sharp'
import { ROOT, h, loadFonts, seal } from './lib/satori-kit.mjs'
import * as kit from './lib/satori-kit.mjs'
import { profile } from '../src/content/profile.ts'

const W = 1200
const H = 630
const headline = typeof profile.headline === 'string' ? profile.headline : profile.headline.en
const fonts = await loadFonts({ jpChars: 'カイス先生' })

// "*word*" → italic accent; punctuation right after it stays attached.
// One flex item per word, so a wrapped line never starts with a space.
const words = headline
  .replace(/\*([^*]+)\*([,.;:!?]*)/g, '*$1$2*')
  .split(/(\*[^*]+\*)/g)
  .flatMap((seg) => (seg.startsWith('*') ? [seg] : seg.split(/\s+/)))
  .filter(Boolean)

const tree = h(
  'div',
  {
    style: {
      width: W,
      height: H,
      display: 'flex',
      position: 'relative',
      background: '#0A0E17',
      backgroundImage: 'radial-gradient(circle at 88% 8%, rgba(79,209,197,0.26), transparent 42%), radial-gradient(circle at 0% 100%, rgba(129,140,248,0.2), transparent 45%)',
      color: '#E6EBF2',
      fontFamily: 'Geist',
      padding: '64px 72px',
    },
  },
  // Left column
  h(
    'div',
    { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 900 } },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 22 } },
      seal({ size: 76 }),
      h('div', { style: { display: 'flex', fontFamily: 'Instrument Serif', fontSize: 44 } }, profile.name),
    ),
    h(
      'div',
      { style: { display: 'flex', flexWrap: 'wrap', columnGap: 18, fontFamily: 'Instrument Serif', fontSize: 76, lineHeight: 1.02, letterSpacing: -1.5 } },
      ...words.map((w) =>
        w.startsWith('*') ? h('span', { style: { fontStyle: 'italic', color: '#4FD1C5' } }, w.slice(1, -1)) : h('span', {}, w),
      ),
    ),
    h(
      'div',
      { style: { display: 'flex', fontFamily: 'Geist Mono', fontSize: 20, letterSpacing: 2, color: '#8A94A6', textTransform: 'uppercase' } },
      'CS @ Earlham · ex-AI PM intern @ Recruit / Indeed',
    ),
  ),
  // Vertical Japanese on the right
  h(
    'div',
    { style: { position: 'absolute', right: 70, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: kit.MINCHO, fontWeight: 700, fontSize: 46, color: 'rgba(230,235,242,0.85)' } },
    ...[...'カイス'].map((c) => h('div', { style: { display: 'flex' } }, c)),
  ),
  h('div', { style: { position: 'absolute', right: 58, bottom: 58, display: 'flex' } }, seal({ size: 110, text: '先生', rotate: -8 })),
)

const svg = await satori(tree, { width: W, height: H, fonts })
await mkdir(path.join(ROOT, 'public', 'og'), { recursive: true })
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(ROOT, 'public', 'og', 'og.png'))
console.log('[og] public/og/og.png written')
