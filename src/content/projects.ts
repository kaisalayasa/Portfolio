import type { Project } from './types.ts'

export const projects: Project[] = [
  {
    slug: 'language-switch',
    featured: true,
    title: 'Language Switch',
    kicker: { en: 'Open-source Anki add-on · Local AI', ja: 'オープンソースAnkiアドオン・ローカルAI' },
    summary: {
      en: 'Makes bilingual Anki decks reversible. It reads each deck’s language and structure, then rebuilds templates, fields, and card HTML.',
      ja: 'バイリンガルのAnkiデッキを「逆向き」にするアドオン。デッキの言語と構造を読み取り、テンプレート・フィールド・カードHTMLを再構築します。',
    },
    result: {
      en: 'Runs fully offline with Qwen2.5-7B and Piper TTS. No API keys, no cloud.',
      ja: 'Qwen2.5-7BとPiper TTSで完全オフライン動作。APIキーもクラウドも不要。',
    },
    tags: ['Python', 'Anki', 'Qwen2.5-7B', 'Piper TTS', 'HTML parsing'],
    year: '2026',
    cover: { src: 'media/photos/language-switch-cover.jpg', alt: { en: 'Language Switch add-on screenshot', ja: 'Language Switchのスクリーンショット' } },
    links: { code: 'https://github.com/kaisalayasa/Language-Switch-Anki-Add-on' },
    repo: 'kaisalayasa/Language-Switch-Anki-Add-on',
    caseStudy: true,
  },
  {
    slug: 'shiritori',
    title: 'Shiritori',
    kicker: { en: 'Japanese word-chain game · Web app', ja: '日本語しりとりゲーム・Webアプリ' },
    summary: {
      en: 'The classic Japanese word-chain game, built for learners, with vocabulary from a JLPT word API. I built the game logic, the word verification system, and the UI.',
      ja: '学習者向けに作った、日本の定番ことば遊び「しりとり」。語彙はJLPT単語APIから取得。ゲームロジック、単語の判定システム、UIを開発しました。',
    },
    result: { en: 'Played by 400+ users', ja: '400人以上がプレイ' },
    tags: ['React', 'Game logic', 'Word verification', 'UI'],
    year: '2025',
    cover: { src: 'media/photos/shiritori-cover.jpg', alt: { en: 'Shiritori game screenshot', ja: 'しりとりゲームの画面' } },
    links: { live: 'https://shiritori-game-five.vercel.app', code: 'https://github.com/kaisalayasa/Shiritori-Game' },
    repo: 'kaisalayasa/Shiritori-Game',
    caseStudy: true,
  },
  {
    slug: 'do-you-even-lol',
    title: 'Do You Even LOL?',
    kicker: { en: 'League of Legends quiz · Python', ja: 'League of Legendsクイズ・Python' },
    summary: {
      en: 'A League of Legends guessing game: is this ability the champion’s Passive, Q, W, E, or R? It uses BeautifulSoup to scrape League of Legends sites for the latest champion data, so the game stays up to date.',
      ja: 'League of Legendsの当てクイズ。この技はパッシブ？Q・W・E・R？BeautifulSoupでLeague of Legendsのサイトから最新のチャンピオンデータを取得するので、ゲームは常に最新です。',
    },
    tags: ['Python', 'BeautifulSoup', 'Web scraping', 'JSON'],
    year: '2025',
    cover: { src: 'media/photos/doyouevenlol.jpg', alt: { en: 'Do You Even LOL? quiz screen', ja: 'Do You Even LOL?のクイズ画面' } },
    links: { code: 'https://github.com/kaisalayasa/Do-You-Even-LOL-' },
    repo: 'kaisalayasa/Do-You-Even-LOL-',
  },
  {
    slug: 'all-in-one',
    title: 'All In One',
    kicker: { en: 'React playground · Mini-apps', ja: 'Reactの実験場・ミニアプリ集' },
    summary: {
      en: 'A live playground of the React projects from my frontend learning journey: a to-do list, a weather app on an external API, and a lab for trying third-party libraries, each one documented as I went.',
      ja: 'フロントエンド学習の過程でつくったReactプロジェクトをまとめた公開プレイグラウンド。ToDoリスト、外部APIを使った天気アプリ、ライブラリを試すラボなど、それぞれ学んだことを記録しながら開発しました。',
    },
    tags: ['React', 'JavaScript', 'CSS', 'Vercel'],
    year: '2025',
    cover: { src: 'media/photos/allinone.jpg', alt: { en: 'All In One home page', ja: 'All In Oneのトップページ' } },
    links: { live: 'https://all-in-one-amber-seven.vercel.app', code: 'https://github.com/kaisalayasa/All_In_One' },
    repo: 'kaisalayasa/All_In_One',
  },
  {
    slug: 'cybersmart-webgl',
    title: 'CyberSmart',
    kicker: { en: 'Cybersecurity game · Class project', ja: 'サイバーセキュリティゲーム・授業プロジェクト' },
    summary: {
      en: 'A collaborative project for my cybersecurity class, aimed at spreading cybersecurity awareness among students in a gamified way.',
      ja: 'サイバーセキュリティの授業で取り組んだ共同プロジェクト。ゲームを通じて、学生にサイバーセキュリティへの意識を広めることを目指しました。',
    },
    tags: ['Game', 'Cybersecurity', 'Team project'],
    cover: { src: 'media/photos/cybersmart.jpg', alt: { en: 'CyberSmart game scene', ja: 'CyberSmartのゲーム画面' } },
    links: { live: 'https://cybersec-website-ecru.vercel.app/' },
  },

  // More work
  {
    slug: 'recruit-indeed',
    variant: 'wide',
    title: { en: 'AI Hiring Product', ja: 'AI採用プロダクト' },
    kicker: { en: 'Recruit / Indeed · AI PM Internship · Tokyo', ja: 'リクルート / Indeed・AIプロダクトマネージャー インターン・東京' },
    summary: {
      en: 'Owned a product that streamlines hiring with ATS systems, from initial idea to final prototype.',
      ja: 'ATSで採用を効率化するプロダクトを、最初のアイデアから最終プロトタイプまで担当しました。',
    },
    tags: ['Product', 'React', 'OpenAI', 'Claude Code', 'Google Maps API'],
    year: '2026',
    photo: { src: 'media/photos/recruit_project_section.jpg', alt: { en: 'With my team at Recruit in Tokyo', ja: '東京のリクルートでチームと' }, focus: '33% 40%' },
    links: {},
    confidential: true,
  },
  {
    slug: 'john-deere-ocr',
    variant: 'wide',
    title: { en: 'Claude OCR Pipeline', ja: 'Claude OCRパイプライン' },
    kicker: { en: 'Augeo · Client project for John Deere', ja: 'Augeo・John Deere向けクライアント案件' },
    summary: {
      en: 'Replaced a slow, error-prone document-reading step with a Claude-powered OCR workflow.',
      ja: '時間がかかりミスも多かった書類読み取り工程を、ClaudeによるOCRワークフローに置き換えました。',
    },
    result: { en: '~6× accuracy · ~80% faster', ja: '精度 約6倍・処理時間 約80%短縮' },
    tags: ['Claude', 'OCR', 'Python', 'Cursor'],
    photo: { src: 'media/photos/augeo_office.jpg', alt: { en: 'The Augeo office', ja: 'Augeoのオフィス' } },
    links: {},
    confidential: true,
  },
  {
    slug: 'bus-time',
    variant: 'mention',
    title: 'Bus-Time',
    kicker: { en: 'Personal tool · Live transit data', ja: '個人ツール・リアルタイム交通データ' },
    summary: {
      en: 'The official bus app didn’t work on our phones, so I built one that did: live departures from the local transit API for the stations we actually use.',
      ja: '公式のバスアプリが私たちのスマホで動かなかったので、動くものを自分でつくりました。地域の交通APIから、よく使う停留所の発車時刻をリアルタイムで表示します。',
    },
    tags: ['React', 'Transit API'],
    links: { code: 'https://github.com/kaisalayasa/Bus-Time' },
    repo: 'kaisalayasa/Bus-Time',
  },
  {
    slug: 'moooove',
    variant: 'mention',
    title: 'MOOOVE',
    kicker: { en: 'Student housing · Web product', ja: '学生向け住まい探し・Webプロダクト' },
    summary: {
      en: 'A platform that helps college students find sublessees. Frontend and interaction design.',
      ja: '大学生が転貸先（サブリース）を見つけるためのプラットフォーム。フロントエンドとインタラクションデザインを担当。',
    },
    tags: ['JavaScript', 'Frontend'],
    links: { code: 'https://github.com/kaisalayasa/MOOOVE' },
    repo: 'kaisalayasa/MOOOVE',
  },
]

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
export const caseStudies = () => projects.filter((p) => p.caseStudy)
