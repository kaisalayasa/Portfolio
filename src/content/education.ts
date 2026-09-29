import type { Education } from './types.ts'

export const education: Education[] = [
  {
    id: 'earlham',
    school: 'Earlham College',
    program: { en: 'Computer Science Major', ja: 'コンピュータサイエンス専攻' },
    dates: { en: 'Class of 2028', ja: '2028年卒業予定' },
    location: { en: 'Richmond, Indiana', ja: 'アメリカ・インディアナ州リッチモンド' },
    logo: 'media/logos/earlham.png',
    gpa: '3.88',
    courses: [
      { name: 'Data Structures' },
      { name: 'Algorithms' },
      { name: 'Programming and Problem Solving' },
      { name: 'Principles in Computer Organization' },
      { name: 'Cybersecurity' },
      { name: 'Calculus A' },
      { name: 'Computing Skills' },
      { name: 'Software Engineering', note: { en: 'Spring 2027', ja: '2027年春学期' } },
    ],
  },
  {
    id: 'iwate',
    school: { en: 'Iwate University', ja: '岩手大学' },
    program: { en: 'Exchange Student · Computer Science & Japanese Language', ja: '交換留学生・コンピュータサイエンスと日本語' },
    dates: { en: 'Aug – Nov 2026', ja: '2026年8月〜11月' },
    location: { en: 'Morioka, Japan', ja: '岩手県盛岡市' },
    current: true,
    logo: 'media/logos/iwate-university.png',
    bullets: [
      {
        en: 'Studying computer science and Japanese while living with a Japanese host family.',
        ja: '日本人のホストファミリーと暮らしながら、コンピュータサイエンスと日本語を学んでいます。',
      },
    ],
    roles: [
      {
        title: { en: 'English Teacher', ja: '英語教師' },
        org: { en: 'Kuroishino Middle School (黒石野中学校)', ja: '盛岡市立 黒石野中学校' },
        description: {
          en: 'Teaching English through Iwate University. My students call me “Qais-sensei”, and a few asked for me as their homeroom teacher.',
          ja: '岩手大学を通じて英語を教えています。生徒からは「カイス先生」と呼ばれ、担任になってほしいと言ってくれた生徒もいました。',
        },
      },
    ],
  },
]
