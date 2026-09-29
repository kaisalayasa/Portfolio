// Usage: node scripts/optimize-images.mjs [--fast]
// Converts everything in public/media to AVIF/WebP at multiple widths, generates
// blur-up placeholders, and writes src/generated/media-manifest.json.
import { buildManifest } from './lib/media-scan.mjs'

await buildManifest({ fast: process.argv.includes('--fast') })
