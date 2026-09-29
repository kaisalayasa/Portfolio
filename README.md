# Qais Alayasa: Portfolio

A bilingual (EN / 日本語), prerendered React portfolio, deployed to GitHub Pages at https://kaisalayasa.github.io.

React 18 · Vite · TypeScript · Tailwind CSS v4 · Motion · cobe · MDX

## Quick start

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck, build, prerender → dist/
npm test
```

Requires Node 24+.

## Editing content

Everything lives in `src/content/`. Text is either a plain string or `{ en, ja }`.

| File | What's in it |
|---|---|
| `profile.ts` | Name, headline, intro, email, links, where I am now (hero status, footer clock + weather), skills, SEO |
| `experience.ts` · `education.ts` | Work and school entries |
| `projects.ts` | Projects; `caseStudy: true` needs `case-studies/<slug>.mdx` |
| `languages.ts` | Languages section: story, stats, Duolingo image, Anki numbers, kanji |
| `journey.ts` | Globe stops |
| `music.ts` · `favorites.ts` | Performances, favorite band + Spotify |
| `activities.ts` · `recommendations.ts` | Extracurriculars, recommendations |
| `i18n/en.json` · `ja.json` | UI strings (keep both files' keys identical; `npm test` checks) |

Media goes in `public/media/…` and is optimized automatically at build time (AVIF/WebP + blur-up placeholders). Photos dropped into `public/media/life/` appear in the Life section automatically, sorted by filename. The résumé PDF goes at `public/resume/Qais_Alayasa_Resume.pdf`.

## Deploying

Push to `main`. `.github/workflows/deploy.yml` tests, builds and deploys to GitHub Pages (Settings → Pages → Source: GitHub Actions). `site.config.ts` holds the repo name, an optional custom domain, and the GoatCounter code for analytics. A daily workflow refreshes GitHub star counts.

## Easter eggs

⌘K / Ctrl+K opens the command palette. Type `shiritori` anywhere for the word game. ↑ ↑ ↓ ↓ ← → ← → B A.
