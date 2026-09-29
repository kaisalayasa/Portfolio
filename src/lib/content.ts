import { listAssets } from './media'

/** Every photo/clip in public/media/life/, sorted by filename. */
export const lifePhotos = () =>
  listAssets('media/life/')
    .filter((a) => a.entry.kind === 'image' || a.entry.kind === 'video')
    .map((a) => ({ src: a.src, kind: a.entry.kind as 'image' | 'video' }))

export type LifeItem = ReturnType<typeof lifePhotos>[number]
