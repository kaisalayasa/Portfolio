import { readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import en from './i18n/en.json'
import ja from './i18n/ja.json'
import { projects } from './projects'
import { experience } from './experience'
import { education } from './education'
import { journey } from './journey'
import { activities } from './activities'
import { performances } from './music'
import { favoriteBand } from './favorites'
import { languages } from './languages'
import { profile } from './profile'

const keys = (o: object, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]))

describe('i18n', () => {
  it('ja.json has exactly the same keys as en.json', () => {
    expect(keys(ja).sort()).toEqual(keys(en).sort())
  })

  it('placeholders like {name} match between languages', () => {
    const flat = (o: object) => Object.fromEntries(keys(o).map((k) => [k, k.split('.').reduce<any>((a, p) => a[p], o)]))
    const e = flat(en)
    const j = flat(ja)
    for (const k of Object.keys(e)) {
      const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort()
      expect(vars(j[k]), k).toEqual(vars(e[k]))
    }
  })
})

describe('content', () => {
  it('project slugs are unique and URL-safe', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/)
  })

  it('exactly one featured project', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(1)
  })

  it('every caseStudy project has an .mdx file', () => {
    const files = readdirSync(path.resolve(__dirname, 'case-studies'))
    for (const p of projects.filter((x) => x.caseStudy)) expect(files, p.slug).toContain(`${p.slug}.mdx`)
  })

  it('exactly one current entry across experience + education (the NOW badge)', () => {
    expect([...experience, ...education].filter((e) => e.current)).toHaveLength(1)
  })

  it('journey coordinates are valid', () => {
    for (const j of journey) {
      expect(Math.abs(j.lat)).toBeLessThanOrEqual(90)
      expect(Math.abs(j.lon)).toBeLessThanOrEqual(180)
    }
  })

  // Missing files render nothing on the site, so this is what catches a typo'd path.
  it('every media file the content points at exists in /public', () => {
    const paths = [
      profile.hero.portrait,
      profile.resume.pdf,
      profile.resume.preview,
      profile.resume.swe.pdf,
      profile.resume.swe.preview,
      favoriteBand.image,
      languages.duolingoCard.src,
      languages.kanji.image,
      ...projects.map((p) => p.cover?.src),
      ...experience.flatMap((e) => [e.logo, e.photo?.src]),
      ...education.map((e) => e.logo),
      ...journey.map((j) => j.photo?.src),
      ...activities.map((a) => a.photo?.src),
      ...performances.flatMap((p) => [p.thumbnail, p.video]),
    ].filter(Boolean) as string[]
    for (const p of paths) expect(existsSync(path.resolve(__dirname, '../../public', p)), p).toBe(true)
  })
})
