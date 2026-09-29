import type { L } from './types.ts'

export const languages = {
  spoken: [
    { code: 'ar', native: 'العربية', name: { en: 'Arabic', ja: 'アラビア語' }, level: { en: 'Native', ja: '母語' }, meter: 1, dir: 'rtl' },
    { code: 'en', native: 'English', name: { en: 'English', ja: '英語' }, level: { en: 'Fluent · professional', ja: '流暢・ビジネスレベル' }, meter: 0.95, dir: 'ltr' },
    {
      code: 'ja',
      native: '日本語',
      name: { en: 'Japanese', ja: '日本語' },
      level: { en: 'Professional working proficiency', ja: 'ビジネスレベル' },
      note: { en: 'Presentations, business & workplace Japanese', ja: 'プレゼン・ビジネス・職場での日本語' },
      meter: 0.8,
      dir: 'ltr',
    },
  ] as { code: string; native: string; name: L; level: L; note?: L; meter: number; dir: 'ltr' | 'rtl' }[],

  arc: [
    { place: { en: 'A desk in Palestine', ja: 'パレスチナの机' }, text: { en: 'No Japanese school, so I built my own system: Anki, Duolingo, immersion, and every free resource I could find. 2.5 years of self-study.', ja: '日本語学校がなかったので、Anki・Duolingo・イマージョン・無料の教材で自分だけの学習法をつくりました。独学2年半。' } },
    { place: { en: 'A product team in Tokyo', ja: '東京のプロダクトチーム' }, text: { en: 'Working in Japanese: pitching to clients, interviewing, and presenting to leadership.', ja: 'クライアントへのピッチ、インタビュー、経営陣への発表。すべて日本語で。' } },
    { place: { en: 'A classroom in Morioka', ja: '盛岡の教室' }, text: { en: 'Now I’m on the other side of the desk, teaching English as “Qais-sensei”.', ja: '今度は教える側として、「カイス先生」として英語を教えています。' } },
  ] as { place: L; text: L }[],

  stats: {
    selfStudyYears: '2.5',
    peakNewWordsPerDay: 20,
    dailyReviews: '160+',
  },

  duolingoCard: { src: 'media/photos/duolingo-card.jpg', alt: { en: 'Duolingo: Japanese, professional working proficiency, Duolingo Score 128', ja: 'Duolingo：日本語 ビジネスレベル、Duolingoスコア128' } as L },

  anki: {
    totalCards: '9,000+',
    dailyReviews: '160+',
    totalReviews: '150,000+',
    /** Heatmap total. The grid itself is an illustrative pattern scaled to this. */
    reviewsLastYear: 41_194,
    decks: ['Core 2k', 'Core 2k/6k', { en: 'Sentence mining', ja: '文章マイニング' }] as L[],
  },

  kanji: {
    known: '2,000+',
    image: 'media/kanji/kanji-grid.png',
  },
}
