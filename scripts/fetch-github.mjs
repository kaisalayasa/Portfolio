// Star counts for the repos in src/content/projects.ts → src/data/github-stars.json (only repos with stars).
// Run daily by .github/workflows/refresh-data.yml. Never fails: on error the previous file is kept.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { projects } from '../src/content/projects.ts'

const FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'github-stars.json')
const headers = { 'User-Agent': 'qais-portfolio', Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) }

try {
  const stars = {}
  for (const repo of projects.map((p) => p.repo).filter(Boolean)) {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers, signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`${res.status} for ${repo}`)
    const { stargazers_count: n } = await res.json()
    if (n > 0) stars[repo] = n
  }
  const next = JSON.stringify(stars, null, 2) + '\n'
  const prev = await readFile(FILE, 'utf8').catch(() => '')
  if (next === prev) console.log('[stars] unchanged')
  else {
    await writeFile(FILE, next)
    console.log('[stars] updated', stars)
  }
} catch (err) {
  console.warn(`[stars] skipped: ${err.message} (keeping previous file)`)
}
