import type { Activity } from './types.ts'

export const activities: Activity[] = [
  {
    id: 'harumatsuri',
    title: { en: 'Harumatsuri Organizer', ja: '春祭り 主催' },
    org: 'Earlham College',
    stat: { value: '~30', label: { en: 'local Japanese community members brought to campus', ja: '人の地域の日本人コミュニティの方々をキャンパスに招待' } },
    description: {
      en: 'Earlham’s spring festival. The Japanese department called it one of the strongest Harumatsuri years.',
      ja: 'アーラム大学の春祭り。日本語学科から「近年で最も充実した春祭りの一つ」と評価されました。',
    },
    photo: { src: 'media/photos/harumatsuri.jpg', alt: { en: 'Harumatsuri festival at Earlham', ja: 'アーラム大学の春祭り' } },
  },
  {
    id: 'ra',
    title: { en: 'Resident Assistant', ja: 'レジデント・アシスタント' },
    org: { en: 'Olvey-Andis Hall, Earlham', ja: 'アーラム大学 Olvey-Andis寮' },
    stat: { value: '~100', label: { en: 'residents supported', ja: '人の寮生をサポート' } },
    description: {
      en: 'Part of the RA team: building community and being the first person residents turn to when they need help.',
      ja: 'RAチームの一員として、寮のコミュニティづくりと、困ったときに最初に頼られる存在を担っています。',
    },
    photo: { src: 'media/photos/ra.jpg', alt: { en: 'Olvey-Andis Hall at Earlham', ja: 'アーラム大学 Olvey-Andis寮' } },
  },
  {
    id: 'table-tennis',
    title: { en: 'Table Tennis Club', ja: '卓球部' },
    org: { en: 'Kuroishino Middle School', ja: '黒石野中学校' },
    description: { en: 'After class, I join the students at practice. Club life is where the real conversations happen.', ja: '放課後は生徒と一緒に練習。本当の会話が生まれるのは部活の時間です。' },
    photo: { src: 'media/photos/pingpong.jpg', alt: { en: 'Kuroishino Middle School in the snow', ja: '雪の黒石野中学校' } },
  },
  {
    id: 'volleyball',
    title: { en: 'Volleyball Convener', ja: 'バレーボールのまとめ役' },
    org: 'Earlham College',
    description: { en: 'Organized regular volleyball for anyone who wanted to play.', ja: '誰でも参加できるバレーボールの場を定期的に開いていました。' },
    photo: { src: 'media/photos/volleyball.jpg', alt: { en: 'Volleyball at Earlham', ja: 'アーラム大学でのバレーボール' } },
  },
]
