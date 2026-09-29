// Scans /public/media and /public/resume and writes src/generated/media-manifest.json.
//
//   fast mode (dev):  dimensions + tiny blur placeholder, originals are served as-is.
//   full mode (build): also emits AVIF + WebP at several widths into public/media/_opt/.
//
// The site uses the manifest to know which assets exist (a missing file simply isn't rendered).
import { readdir, stat, mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const PUBLIC = path.join(ROOT, 'public')
const SCAN_DIRS = ['media', 'resume']
const OPT_DIR = path.join(PUBLIC, 'media', '_opt')
const MANIFEST = path.join(ROOT, 'src', 'generated', 'media-manifest.json')
const WIDTHS = [480, 960, 1600]

const IMAGE = /\.(jpe?g|png|webp|avif)$/i
const VIDEO = /\.(mp4|webm|mov)$/i
const GIF = /\.gif$/i
const IGNORE = /(^\.|^README|\.md$|^_opt$)/i

async function walk(dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (IGNORE.test(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const rel = (p) => path.relative(PUBLIC, p).split(path.sep).join('/')

async function isFresh(src, out) {
  if (!existsSync(out)) return false
  const [a, b] = await Promise.all([stat(src), stat(out)])
  return b.mtimeMs >= a.mtimeMs
}

export async function buildManifest({ fast = false, log = console.log } = {}) {
  let sharp = null
  try {
    sharp = (await import('sharp')).default
  } catch {
    log('[media] sharp unavailable, writing manifest without image metadata')
  }

  const files = (await Promise.all(SCAN_DIRS.map((d) => walk(path.join(PUBLIC, d))))).flat()
  const manifest = {}
  let optimized = 0

  for (const file of files.sort()) {
    const key = rel(file)
    if (VIDEO.test(file)) {
      manifest[key] = { kind: 'video' }
      continue
    }
    if (GIF.test(file) || !IMAGE.test(file) || !sharp) {
      manifest[key] = { kind: GIF.test(file) || IMAGE.test(file) ? 'image' : 'file' }
      continue
    }
    try {
      const img = sharp(file, { failOn: 'none' }).rotate()
      const meta = await img.metadata()
      const swap = (meta.orientation ?? 1) >= 5
      const w = swap ? meta.height : meta.width
      const h = swap ? meta.width : meta.height
      const blurBuf = await sharp(file).rotate().resize(16).webp({ quality: 40 }).toBuffer()
      const entry = { kind: 'image', w, h, blur: `data:image/webp;base64,${blurBuf.toString('base64')}` }

      if (!fast) {
        const widths = WIDTHS.filter((x) => x < w).concat(w <= WIDTHS.at(-1) ? [w] : [WIDTHS.at(-1)])
        const uniq = [...new Set(widths)]
        const base = key.replace(/^media\//, '').replace(/\.[^.]+$/, '')
        for (const width of uniq) {
          for (const fmt of ['avif', 'webp']) {
            const out = path.join(OPT_DIR, `${base}-${width}.${fmt}`)
            if (await isFresh(file, out)) continue
            await mkdir(path.dirname(out), { recursive: true })
            const pipeline = sharp(file).rotate().resize({ width, withoutEnlargement: true })
            await (fmt === 'avif' ? pipeline.avif({ quality: 52, effort: 4 }) : pipeline.webp({ quality: 78 })).toFile(out)
            optimized++
          }
        }
        entry.opt = { base: `media/_opt/${base}`, widths: uniq }
      }
      manifest[key] = entry
    } catch (err) {
      log(`[media] skipped ${key}: ${err.message}`)
      manifest[key] = { kind: 'image' }
    }
  }

  const json = JSON.stringify(manifest, null, 2) + '\n'
  const prev = existsSync(MANIFEST) ? await readFile(MANIFEST, 'utf8') : ''
  if (prev !== json) {
    await mkdir(path.dirname(MANIFEST), { recursive: true })
    await writeFile(MANIFEST, json)
  }
  log(`[media] ${Object.keys(manifest).length} assets indexed${fast ? ' (fast)' : `, ${optimized} variants written`}`)
  return manifest
}

export const MEDIA_WATCH_DIRS = SCAN_DIRS.map((d) => path.join(PUBLIC, d))
