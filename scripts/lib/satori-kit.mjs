// Shared helpers for generating images with satori (text → vector paths) + sharp (SVG → PNG).
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const FS = path.join(ROOT, 'node_modules', '@fontsource')

/** Tiny hyperscript so we don't need JSX in Node: h('div', { style }, ...children) */
export const h = (type, props = {}, ...children) => ({
  type,
  props: { ...props, children: children.flat().filter((c) => c != null && c !== false) },
})

const file = (pkg, name) => readFile(path.join(FS, pkg, 'files', name))

/** Finds the unicode-range chunk of a split CJK font that contains all given characters. */
async function cjkChunk(pkg, weight, chars) {
  const css = await readFile(path.join(FS, pkg, `${weight}.css`), 'utf8')
  const blocks = css.split('@font-face').slice(1)
  const cps = [...chars].map((c) => c.codePointAt(0))
  const inRange = (range, cp) =>
    range.split(',').some((part) => {
      const [a, b] = part.trim().replace('U+', '').split('-').map((x) => parseInt(x, 16))
      return cp >= a && cp <= (b ?? a)
    })
  const hits = new Set()
  for (const b of blocks) {
    const range = b.match(/unicode-range:\s*([^;]+);/)?.[1]
    const woff = b.match(/url\(\.\/files\/([^)]+\.woff)\)/)?.[1]
    if (range && woff && cps.some((cp) => inRange(range, cp))) hits.add(woff)
  }
  return Promise.all([...hits].map((n) => file(pkg, n)))
}

/** CSS font stack for the loaded Japanese chunks (set by loadFonts). */
export let MINCHO = 'Zen Old Mincho 0'

export async function loadFonts({ jpChars = '' } = {}) {
  const fonts = [
    { name: 'Instrument Serif', data: await file('instrument-serif', 'instrument-serif-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Instrument Serif', data: await file('instrument-serif', 'instrument-serif-latin-400-italic.woff'), weight: 400, style: 'italic' },
    { name: 'Geist', data: await file('geist', 'geist-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Geist', data: await file('geist', 'geist-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'Geist Mono', data: await file('geist-mono', 'geist-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
  ]
  if (jpChars) {
    // Each unicode-range chunk gets its own family name; MINCHO lists them as a fallback stack.
    const chunks = await cjkChunk('zen-old-mincho', 700, jpChars)
    chunks.forEach((data, i) => fonts.push({ name: `Zen Old Mincho ${i}`, data, weight: 700, style: 'normal' }))
    MINCHO = chunks.map((_, i) => `Zen Old Mincho ${i}`).join(', ')
  }
  return fonts
}

/** The hanko seal as a satori element. */
export function seal({ size, text = 'Q', rotate = -6, radius }) {
  const r = radius ?? Math.round(size * 0.25)
  const q = text === 'Q'
  return h(
    'div',
    {
      style: {
        width: size,
        height: size,
        borderRadius: r,
        background: '#4FD1C5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${rotate}deg)`,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
      },
    },
    h(
      'div',
      {
        style: {
          width: size * 0.82,
          height: size * 0.82,
          borderRadius: r * 0.72,
          border: `${Math.max(1, size * 0.022)}px solid rgba(4,37,34,0.45)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#042522',
          fontFamily: q ? 'Instrument Serif' : MINCHO,
          fontStyle: q ? 'italic' : 'normal',
          fontWeight: q ? 400 : 700,
          fontSize: size * (q ? 0.62 : 0.4),
          lineHeight: 1,
          paddingTop: q ? size * 0.04 : 0,
        },
      },
      text,
    ),
  )
}

export { ROOT }
