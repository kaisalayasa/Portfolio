import manifest from '@/generated/media-manifest.json'

type ManifestEntry = {
  kind: 'image' | 'video' | 'file'
  w?: number
  h?: number
  blur?: string
  opt?: { base: string; widths: number[] }
}

const entries = manifest as Record<string, ManifestEntry>
const BASE = import.meta.env.BASE_URL

/** 'media/x.jpg' → '<base>media/x.jpg'. External URLs pass through. */
export function asset(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return BASE + path.replace(/^\//, '')
}

const key = (path: string) => path.replace(/^\//, '')

export const hasAsset = (path?: string) => !!path && key(path) in entries
export const getAsset = (path?: string): ManifestEntry | undefined => (path ? entries[key(path)] : undefined)
export const listAssets = (prefix: string) =>
  Object.keys(entries)
    .filter((k) => k.startsWith(prefix))
    .sort()
    .map((k) => ({ src: k, entry: entries[k] }))

export function srcSet(entry: ManifestEntry, fmt: 'avif' | 'webp') {
  if (!entry.opt) return undefined
  return entry.opt.widths.map((w) => `${asset(`${entry.opt!.base}-${w}.${fmt}`)} ${w}w`).join(', ')
}
