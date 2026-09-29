import { useState } from 'react'
import { asset, hasAsset } from '@/lib/media'
import { track } from '@/lib/analytics'
import { play as sfx } from '@/lib/sound'
import { cn } from '@/lib/cn'
import { IconPlay } from './Icons'
import { Media } from './Media'

/** Poster + play button; the video file only loads after the visitor presses play. */
export function VideoFacade({ src, title, poster, className, id }: { src: string; title: string; poster: string; className?: string; id: string }) {
  const [playing, setPlaying] = useState(false)
  if (!hasAsset(src)) return null

  const start = () => {
    setPlaying(true)
    sfx('pop')
    track('video_play', { id })
  }

  return (
    <div className={cn('relative aspect-video overflow-hidden bg-black', className)}>
      {playing ? (
        <video className="h-full w-full" src={asset(src)} poster={asset(poster)} controls autoPlay playsInline aria-label={title} />
      ) : (
        <button type="button" onClick={start} className="group absolute inset-0 block h-full w-full" aria-label={`Play: ${title}`} data-cursor="play">
          <Media src={poster} alt="" className="h-full w-full" imgClassName="transition-transform duration-700 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 760px, 90vw" />
          <span className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
          <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-black shadow-2xl transition-transform duration-300 group-hover:scale-110 md:size-20">
            <IconPlay size={26} className="translate-x-0.5" />
          </span>
          <span className="absolute right-4 bottom-4 left-4 text-left text-sm font-medium text-white drop-shadow">{title}</span>
        </button>
      )}
    </div>
  )
}
