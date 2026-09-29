// Dev-only: re-index /public/media when files change, so new photos appear without a restart.
import { buildManifest, MEDIA_WATCH_DIRS } from './media-scan.mjs'

export function mediaManifestPlugin() {
  let timer
  return {
    name: 'qais:media-manifest',
    apply: 'serve',
    configureServer(server) {
      server.watcher.add(MEDIA_WATCH_DIRS)
      const rebuild = (file) => {
        if (!MEDIA_WATCH_DIRS.some((d) => file.startsWith(d)) || file.includes('_opt')) return
        clearTimeout(timer)
        timer = setTimeout(() => buildManifest({ fast: true, log: (m) => server.config.logger.info(m) }), 150)
      }
      server.watcher.on('add', rebuild)
      server.watcher.on('unlink', rebuild)
      server.watcher.on('change', rebuild)
    },
  }
}
