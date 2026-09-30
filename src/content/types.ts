export type Lang = 'en' | 'ja'
/** Plain string (same in both languages) or per-language text. */
export type L = string | { en: string; ja: string }

export interface MediaRef {
  /** Path inside /public, e.g. 'media/photos/x.jpg' */
  src: string
  alt: L
  /** CSS object-position for crops, e.g. '50% 12%' */
  focus?: string
}

export interface Project {
  slug: string
  title: L
  kicker: L
  summary: L
  result?: L
  tags: string[]
  featured?: boolean
  year?: string
  cover?: MediaRef
  links: { live?: string; code?: string }
  /** Requires src/content/case-studies/<slug>.mdx */
  caseStudy?: boolean
  /** 'owner/repo', for the star count */
  repo?: string
  /** 'card' (default) = main grid; 'mention' = the small "More work" list */
  variant?: 'card' | 'mention'
}

export interface Experience {
  id: string
  org: L
  role: L
  dates: L
  location: L
  current?: boolean
  logo: string
  photo?: MediaRef
  bullets: L[]
  tags: string[]
}

export interface Education {
  id: string
  school: L
  program: L
  dates: L
  location: L
  current?: boolean
  logo: string
  gpa?: string
  courses?: { name: L; note?: L }[]
  bullets?: L[]
  roles?: { title: L; org: L; description: L }[]
}

export interface Performance {
  id: string
  title: L
  date?: L
  venue: L
  role: L
  thumbnail: string
  video: string
  featured?: boolean
}

export interface Activity {
  id: string
  title: L
  org: L
  stat?: { value: string; label: L }
  description: L
  photo?: MediaRef
}
