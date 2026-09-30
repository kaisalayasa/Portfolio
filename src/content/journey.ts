import type { L, MediaRef } from './types.ts'

export const journey: { id: string; place: L; lat: number; lon: number; when: L; text: L; photo?: MediaRef }[] = [
  {
    id: 'palestine',
    place: { en: 'Bethlehem, Palestine', ja: 'パレスチナ・ベツレヘム' },
    lat: 31.7,
    lon: 35.2,
    when: { en: 'Where it started', ja: 'はじまりの場所' },
    text: {
      en: 'Grew up here. No Japanese school, so I built my own: 2.5 years of Anki, Duolingo, immersion, and stubbornness.',
      ja: '育った場所。日本語学校がなかったので、Anki・Duolingo・イマージョン・根気で2年半独学しました。',
    },
    photo: { src: 'media/photos/palestine.jpg', alt: { en: 'Palestine', ja: 'パレスチナ' } },
  },
  {
    id: 'richmond',
    place: { en: 'Richmond, Indiana', ja: 'インディアナ州リッチモンド' },
    lat: 39.83,
    lon: -84.89,
    when: { en: 'Earlham College · 2028', ja: 'アーラム大学・2028年卒業予定' },
    text: {
      en: 'Third-year computer science student. Resident Assistant, Harumatsuri organizer, and volleyball club convener.',
      ja: 'コンピュータサイエンス専攻の3年生。レジデント・アシスタント、春祭りの主催、バレーボールクラブのまとめ役。',
    },
    photo: { src: 'media/photos/earlham.jpg', alt: { en: 'Earlham College', ja: 'アーラム大学' } },
  },
  {
    id: 'minneapolis',
    place: { en: 'Minneapolis, Minnesota', ja: 'ミネソタ州ミネアポリス' },
    lat: 44.98,
    lon: -93.27,
    when: { en: 'Summer 2025', ja: '2025年夏' },
    text: {
      en: 'Full-stack software engineering intern at Augeo: SSO, a faster data backend, and a revamped internal DevOps site.',
      ja: 'Augeoでフルスタックのソフトウェアエンジニア インターン。SSO、より速いデータ基盤、社内DevOpsサイトの刷新に取り組みました。',
    },
    photo: { src: 'media/photos/MN.jpg', alt: { en: 'Minnesota', ja: 'ミネソタ' } },
  },
  {
    id: 'tokyo',
    place: { en: 'Chiyoda, Tokyo', ja: '東京都千代田区' },
    lat: 35.69,
    lon: 139.75,
    when: { en: 'Summer 2026', ja: '2026年夏' },
    text: {
      en: 'As an AI Product Manager intern at Recruit / Indeed, I owned an AI product from idea to prototype and pitched it in Japanese.',
      ja: 'リクルート / IndeedのAIプロダクトマネージャー インターンとして、AIプロダクトをアイデアからプロトタイプまで担当し、日本語でピッチしました。',
    },
    photo: { src: 'media/photos/recruit_project_section.jpg', alt: { en: 'With my team at Recruit in Tokyo', ja: '東京のリクルートでチームと' }, focus: '50% 25%' },
  },
  {
    id: 'morioka',
    place: { en: 'Morioka, Iwate', ja: '岩手県盛岡市' },
    lat: 39.7,
    lon: 141.15,
    when: { en: 'Fall 2026 · now', ja: '2026年秋・現在' },
    text: {
      en: 'Exchange student at Iwate University, living with a host family and teaching English at Kuroishino Middle School.',
      ja: '岩手大学の交換留学生。ホストファミリーと暮らしながら、黒石野中学校で英語を教えています。',
    },
    photo: { src: 'media/photos/iwateNewsPaper.jpg', alt: { en: 'A local newspaper article about me in Iwate', ja: '岩手の地元新聞に掲載された記事' }, focus: '50% 78%' },
  },
]
