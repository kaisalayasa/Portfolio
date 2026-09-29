import type { Experience } from './types.ts'

export const experience: Experience[] = [
  {
    id: 'recruit',
    org: { en: 'Recruit Holdings / Indeed', ja: 'リクルートホールディングス / Indeed' },
    role: { en: 'AI Product Manager Intern', ja: 'AIプロダクトマネージャー インターン' },
    dates: { en: 'Jun – Aug 2026', ja: '2026年6月〜8月' },
    location: { en: 'Tokyo, Japan', ja: '東京' },
    logo: 'media/logos/recruit.png',
    photo: { src: 'media/japan/tokyo-recruit.jpg', alt: { en: 'At Recruit in Tokyo', ja: '東京のリクルートにて' } },
    bullets: [
      { en: 'Owned a product that streamlines hiring with ATS systems, from initial idea to final prototype.', ja: 'ATSで採用を効率化するプロダクトを、最初のアイデアから最終プロトタイプまで担当しました。' },
      { en: 'Took an AI-first approach: integrated the OpenAI API and built with Claude Code.', ja: 'AIファーストで開発：OpenAI APIを統合し、Claude Codeで構築しました。' },
      { en: 'Worked in Japanese: pitching to clients, interviewing, and presenting to leadership.', ja: 'クライアントへのピッチ、インタビュー、経営陣への発表をすべて日本語で行いました。' },
    ],
    tags: ['Product', 'AI', 'ATS', 'React', 'OpenAI', 'Claude Code', 'Japanese'],
  },
  {
    id: 'augeo',
    org: 'Augeo',
    role: { en: 'Full-Stack Software Engineering Intern', ja: 'フルスタック ソフトウェアエンジニア インターン' },
    dates: { en: 'Jun – Aug 2025', ja: '2025年6月〜8月' },
    location: { en: 'Minneapolis, USA', ja: 'アメリカ・ミネアポリス' },
    logo: 'media/logos/augeo.png',
    bullets: [
      { en: 'Revamped the internal DevOps site, improving UI responsiveness and performance.', ja: '社内DevOpsサイトを刷新し、UIの応答性とパフォーマンスを改善しました。' },
      { en: 'Implemented single sign-on (SSO) with Okta via AWS Cognito for secure access.', ja: 'AWS Cognito経由でOktaによるシングルサインオン（SSO）を実装しました。' },
      { en: 'Built a Node.js and SQL backend connection that halved data access time.', ja: 'Node.jsとSQLのバックエンド連携を構築し、データアクセス時間を半分にしました。' },
    ],
    tags: ['Node.js', 'SQL', 'Okta', 'AWS Cognito', 'Cursor'],
  },
]
