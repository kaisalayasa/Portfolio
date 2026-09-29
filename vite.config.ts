/// <reference types="vitest/config" />
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { BASE, SITE_URL } from './site.config.ts'
import { profile } from './src/content/profile.ts'
import { mediaManifestPlugin } from './scripts/lib/vite-media-plugin.mjs'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Injects <head> SEO tags + JSON-LD from src/content/profile.ts. */
function seoPlugin(): Plugin {
  return {
    name: 'qais:seo',
    transformIndexHtml(html) {
      const { seo } = profile
      const og = `${SITE_URL}/og/og.png`
      const sameAs = [profile.links.github, profile.links.linkedin]
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name,
        alternateName: [profile.nameJa, profile.nameAr],
        url: SITE_URL,
        image: og,
        jobTitle: 'Computer Science Student & Product Builder',
        description: profile.bio,
        alumniOf: seo.alumniOf.map((name) => ({ '@type': 'CollegeOrUniversity', name })),
        knowsLanguage: ['ar', 'en', 'ja'],
        knowsAbout: ['Software Engineering', 'Product Management', 'Artificial Intelligence', 'UX Design', 'React'],
        nationality: 'Palestinian',
        sameAs,
      }
      const tags = `
    <title>${esc(seo.title)}</title>
    <meta name="description" content="${esc(seo.description)}" />
    <link rel="canonical" href="${SITE_URL}/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(profile.name)}" />
    <meta property="og:title" content="${esc(seo.title)}" />
    <meta property="og:description" content="${esc(seo.description)}" />
    <meta property="og:url" content="${SITE_URL}/" />
    <meta property="og:image" content="${og}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:locale:alternate" content="ja_JP" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(seo.title)}" />
    <meta name="twitter:description" content="${esc(seo.description)}" />
    <meta name="twitter:image" content="${og}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
      return html.replace('<!--seo-->', tags)
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  base: BASE,
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] }) },
    react({ include: /\.(mdx|jsx|tsx)$/ }),
    tailwindcss(),
    seoPlugin(),
    mediaManifestPlugin(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(import.meta.dirname, 'src') },
      // The prerenderer (scripts/postbuild.mjs) uses the web-streams server renderer; Node 24 has web streams built in.
      ...(isSsrBuild ? [{ find: /^react-dom\/server$/, replacement: 'react-dom/server.browser' }] : []),
    ],
  },
  // Bundle everything into the prerender build so it runs without CJS/ESM interop surprises.
  ssr: { noExternal: true },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
}))
