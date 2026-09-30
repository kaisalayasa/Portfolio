import type { L } from './types.ts'

export const profile = {
  name: 'Qais Alayasa',
  nameJa: 'カイス',
  nameAr: 'قيس',
  /** *word* renders in italic accent serif */
  headline: {
    en: 'Building *innovative* solutions to people’s problems.',
    ja: '人々の課題に、*革新的*な解決策を。',
  } as L,
  intro: {
    en: 'Former AI Product Manager intern at Recruit / Indeed in Tokyo and full-stack software engineering intern at Augeo in Minneapolis. I build solutions I actually use myself.',
    ja: '東京のRecruit / IndeedでAIプロダクトマネージャーのインターン、ミネアポリスのAugeoでフルスタックのソフトウェアエンジニア インターンを経験。自分でも実際に使うものをつくっています。',
  } as L,
  /** JSON-LD description */
  bio: 'Qais Alayasa is a Computer Science student at Earlham College (2028) and product builder working across software engineering, product management, AI, and UX. Former AI Product Manager intern at Recruit / Indeed in Tokyo and full-stack software engineering intern at Augeo in Minneapolis.',
  email: 'kaisalayasa@gmail.com',
  links: {
    github: 'https://github.com/kaisalayasa',
    linkedin: 'https://www.linkedin.com/in/qais-alayasa/',
  },
  /** Hero status line + footer clock and weather */
  now: {
    city: { en: 'Morioka, Iwate', ja: '岩手県盛岡市' } as L,
    cityShort: { en: 'Morioka', ja: '盛岡' } as L,
    flag: '🇯🇵',
    timezone: 'Asia/Tokyo',
    tzLabel: 'JST',
    lat: 39.7,
    lon: 141.15,
    status: {
      en: 'Teaching English & studying at Iwate University',
      ja: '岩手大学で学びながら、中学校で英語を教えています',
    } as L,
  },
  hero: {
    portrait: 'media/photos/hero.jpg',
    chips: ['React', 'AI', '日本語', 'PM', '400+ users'],
  },
  resume: {
    /** The PM résumé: the default in the Résumé section, and what the hero, contact and ⌘K buttons open. */
    pdf: 'resume/Qais_Alayasa_Resume.pdf',
    preview: 'resume/resume-preview.png',
    swe: { pdf: 'resume/Qais_Alayasa_SWE_Resume.pdf', preview: 'resume/resume-preview-swe.png' },
    lastUpdated: '2026-09',
  },
  skills: {
    strongest: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git/GitHub'],
    also: ['HTML/CSS', 'Vite', 'Express', 'Django', 'Supabase', 'AWS', 'Okta', 'AWS Cognito', 'REST APIs', 'BeautifulSoup'],
    ai: ['OpenAI API', 'Claude Code', 'Cursor', 'Local LLMs (Qwen2.5-7B)', 'Gemini API', 'OCR', 'TTS (Piper)'],
  },
  seo: {
    title: 'Qais Alayasa — Software, AI & Product',
    description:
      'Qais Alayasa builds innovative solutions to people’s problems. CS at Earlham College, former AI Product Manager intern at Recruit / Indeed in Tokyo and full-stack software engineering intern at Augeo. Trilingual in Arabic, English, and Japanese.',
    alumniOf: ['Earlham College', 'Iwate University'],
  },
}
