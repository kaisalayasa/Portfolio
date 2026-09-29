import type { L, Performance } from './types.ts'

const CVPA: L = { en: 'Earlham College Center for Visual and Performing Arts', ja: 'アーラム大学 視覚・舞台芸術センター（CVPA）' }
const LEAD: L = { en: 'Lead guitarist', ja: 'リードギター' }

export const performances: Performance[] = [
  {
    id: 'utsukushii-hire',
    featured: true,
    title: { en: 'Spitz — 美しい鰭', ja: 'スピッツ「美しい鰭」' },
    date: { en: 'Spring 2026', ja: '2026年春' },
    venue: CVPA,
    role: LEAD,
    thumbnail: 'media/music/performance-1.jpg',
    video: 'media/music/performance-1.mp4',
  },
  {
    id: 'robinson',
    title: { en: 'Spitz — Robinson (ロビンソン)', ja: 'スピッツ「ロビンソン」' },
    date: { en: 'Spring 2025', ja: '2025年春学期' },
    venue: CVPA,
    role: LEAD,
    thumbnail: 'media/music/performance-2.jpg',
    video: 'media/music/performance-2.mp4',
  },
  {
    id: 'friends-band',
    title: { en: 'With a friend’s band', ja: '友人のバンドで' },
    venue: { en: 'Jazz Room, Earlham CVPA', ja: 'アーラム大学CVPA ジャズルーム' },
    role: LEAD,
    thumbnail: 'media/music/friends-band.jpg',
    video: 'media/music/friends-band.mp4',
  },
]
