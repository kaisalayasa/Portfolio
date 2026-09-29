// Star counts → src/data/github-stars.json (repos with stars > 0 only). Covers every public repo the user owns
// (the hero shows the total) plus any repo in src/content/projects.ts owned by someone else (project cards).
// Run daily by .github/workflows/refresh-data.yml. Never fails: on error the previous file is kept.
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { projects } from '../src/content/projects.ts'

const USER = 'kaisalayasa'
const FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'github-stars.json')
const headers = { 'User-Agent': 'qais-portfolio', Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) }

const get = async (url) => {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`${res.status} for ${url}`)
  return res.json()
}

try {
  const stars = {}
  const own = await get(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`)
  for (const r of own) if (!r.fork && r.stargazers_count > 0) stars[r.full_name] = r.stargazers_count
  const ownNames = new Set(own.map((r) => r.full_name.toLowerCase()))
  for (const repo of projects.map((p) => p.repo).filter((r) => r && !ownNames.has(r.toLowerCase()))) {
    const { stargazers_count: n, full_name } = await get(`https://api.github.com/repos/${repo}`)
    if (n > 0) stars[full_name] = n
  }
  const sorted = Object.fromEntries(Object.entries(stars).sort(([a], [b]) => a.localeCompare(b)))
  const next = JSON.stringify(sorted, null, 2) + '\n'
  const prev = await readFile(FILE, 'utf8').catch(() => '')
  if (next === prev) console.log('[stars] unchanged')
  else {
    await writeFile(FILE, next)
    console.log('[stars] updated', sorted)
  }
} catch (err) {
  console.warn(`[stars] skipped: ${err.message} (keeping previous file)`)
}
