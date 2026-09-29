import type { L } from './types.ts'

export interface Recommendation {
  id: string
  name: string
  title: L
  relation: L
  date: L
  /** Shown large */
  pull: string
  /** Verbatim paragraphs, English only */
  text: string[]
}

export const recommendations: Recommendation[] = [
  {
    id: 'jason-redeker',
    name: 'Jason Redeker',
    title: { en: 'Director of Software Engineering, Augeo Affinity Marketing', ja: 'Augeo Affinity Marketing ソフトウェアエンジニアリング ディレクター' },
    relation: { en: 'Managed me directly at Augeo', ja: 'Augeoでの直属の上司' },
    date: { en: 'Mar 2026', ja: '2026年3月' },
    pull: 'He delivered at a level far beyond typical intern expectations.',
    text: [
      'I had the privilege of managing Qais Alayasa during his internship, and he delivered at a level far beyond typical intern expectations. Qais took full ownership of rebuilding our internal DevOps web portal completely modernizing it from the ground up. He redesigned the application using React with Vite, significantly improving performance and developer experience.',
      'Qais didn’t stop at modernization. He expanded the platform’s functionality by adding support for AWS SQS queue management, integrated Okta SSO for secure authentication, and refined the entire UI layout to create a cleaner, more intuitive user experience. His work not only improved internal workflows but set a new standard for how we build and maintain internal tools.',
      'Throughout the internship, Qais consistently demonstrated exceptional capability, initiative, and adaptability. He took on every challenge with confidence, asked thoughtful questions, and delivered high‑quality results quickly and independently. It became clear very early that he was capable of far more than the scope of what we could reasonably assign him.',
      'Qais is an outstanding engineer with a bright future ahead. Any team would be fortunate to have him, and I recommend him without hesitation.',
    ],
  },
  {
    id: 'yunting-yin',
    name: 'Yunting Yin, PhD',
    title: { en: 'Assistant Professor, Eastern Michigan University', ja: 'イースタンミシガン大学 助教授' },
    relation: { en: 'Taught me in two CS courses at Earlham', ja: 'アーラム大学で2つのCS科目を担当' },
    date: { en: 'Sep 2025', ja: '2025年9月' },
    pull: 'Not content with simply meeting the minimum, but strives for excellence in all that he does.',
    text: [
      'I had the pleasure of teaching Qais in two Computer Science courses at Earlham College. He consistently goes above and beyond in his coursework, taking on challenges that are well above the basic requirements. Some of his projects were in areas of personal interest, such as web development, where he taught himself new skills outside of class. His intellectual curiosity and determination set him apart as a student who is not content with simply meeting the minimum, but who strives for excellence in all that he does.',
      'Alongside his academic achievements, Qais is also a strong community member. He is active in different clubs and campus events, and he shows a strong awareness of global issues and their implications. He demonstrates thoughtfulness, initiative, and a collaborative spirit that make him a respected and valued peer. Beyond my own experience, colleagues who have also taught Qais have spoken highly of his performance and positive presence in their classes.',
      'Qais’s academic excellence, self-motivation, and strong interpersonal skills make him an outstanding student. I am confident that he will continue to thrive in his studies and contribute positively to any community he is a part of.',
    ],
  },
  {
    id: 'huldah-cooper',
    name: 'Huldah Cooper',
    title: { en: 'Vice President, People', ja: 'People担当 バイスプレジデント' },
    relation: { en: 'Managed me directly during my 2025 internship', ja: '2025年インターンでの直属の上司' },
    date: { en: 'Aug 2025', ja: '2025年8月' },
    pull: 'His blend of technical prowess and outstanding soft skills makes him an invaluable addition to any team.',
    text: [
      'Qais interned as a Software Engineer with our Workplace Engagement tech team this summer and it was such a pleasure to have him apart of our summer program. He consistently demonstrated exceptional intuition and thoughtfulness in his approach to problem-solving, paired with an impressive work ethic that drove meaningful contributions to our projects. His collaborative spirit shines in all settings. Beyond his strong technical skills, Qais’s commitment to continuous learning, understanding industry trends, and embracing differing viewpoints is a true asset. His blend of technical prowess and outstanding soft skills makes him an invaluable addition to any team. Sincerely excited to see how his career journey unfolds!',
    ],
  },
]
