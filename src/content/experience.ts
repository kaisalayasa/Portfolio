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
      {
        en: 'Proposed and owned an AI B2B product from idea to working prototype, integrated with Recruit’s AirWORK ATS to centralize hiring in one place.',
        ja: 'RecruitのAirWORK ATSと連携し、企業の採用業務を一か所に集約するB2B向けAIプロダクトを自ら提案し、アイデアから動くプロトタイプまで担当しました。',
      },
      {
        en: 'Shaped the product direction through market research, user interviews, and client meetings, using Recruit Works Institute and Indeed Hiring Lab data.',
        ja: '市場調査、ユーザーインタビュー、クライアントとの打ち合わせを通じてプロダクトの方向性を固め、リクルートワークス研究所とIndeed Hiring Labのデータを活用しました。',
      },
      { en: 'Ran A/B tests with 7 employers to validate hypotheses, then iterated on feedback and data.', ja: '7社の企業とA/Bテストを行って仮説を検証し、フィードバックとデータをもとに改善を重ねました。' },
      {
        en: 'Took an AI-first approach: designed the Python backend around the OpenAI API, built with Claude Code, and led the React frontend.',
        ja: 'AIファーストで開発：OpenAI APIを軸にPythonバックエンドを設計し、Claude Codeを使ってReactのフロントエンドを主導しました。',
      },
      {
        en: 'Pitched to client CEOs entirely in Japanese; the product earned recognition from Indeed stakeholders, and my mentoring PM committed to continuing its development.',
        ja: 'クライアント企業のCEOへのピッチをすべて日本語で行いました。プロダクトはIndeed関係者から評価され、メンターのPMが開発の継続を約束してくれました。',
      },
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
    photo: { src: 'media/photos/augeo_office.jpg', alt: { en: 'The Augeo office in Minneapolis', ja: 'ミネアポリスのAugeoのオフィス' }, focus: '50% 22%' },
    bullets: [
      {
        en: 'Replaced a slow, error-prone document-reading step with a Claude-powered OCR pipeline for a John Deere project, improving accuracy 6× and cutting processing time ~80%.',
        ja: '時間がかかりミスも多かった書類読み取り工程を、John Deere向けプロジェクトでClaudeによるOCRパイプラインに置き換え、精度を6倍に、処理時間を約80%短縮しました。',
      },
      { en: 'Built a Node.js and SQL backend for data extraction and visualization, halving data access time.', ja: 'データの抽出と可視化のためのNode.jsとSQLのバックエンドを構築し、データアクセス時間を半分にしました。' },
      { en: 'Implemented single sign-on (SSO) with Okta via AWS Cognito for secure access to resources.', ja: 'AWS Cognito経由でOktaによるシングルサインオン（SSO）を実装し、リソースへ安全にアクセスできるようにしました。' },
      { en: 'Revamped the internal DevOps website, improving UI responsiveness and site performance.', ja: '社内DevOpsサイトを刷新し、UIの応答性とサイトのパフォーマンスを改善しました。' },
      { en: 'Designed and developed 3 new pages, streamlining access to internal resources.', ja: '新しいページを3つ設計・開発し、社内リソースへのアクセスを効率化しました。' },
    ],
    tags: ['Claude', 'OCR', 'Node.js', 'SQL', 'Okta', 'AWS Cognito', 'Cursor'],
  },
]
