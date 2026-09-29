import type { ReactNode } from 'react'
import { useI18n } from '@/lib/i18n'
import { Media } from './ui/Media'

// Components available inside every case-study .mdx file without an import.

function Figure({ src, alt, caption, aspect = '16/9' }: { src: string; alt: string; caption?: string; aspect?: string }) {
  return (
    <figure className="not-prose my-10">
      <Media src={src} alt={alt} aspect={aspect} className="rounded-2xl border border-line" sizes="(min-width: 1024px) 760px, 100vw" />
      {caption && <figcaption className="mt-3 text-center font-mono text-xs text-muted">{caption}</figcaption>}
    </figure>
  )
}

function Stats({ children }: { children: ReactNode }) {
  return <div className="my-10 grid grid-cols-2 gap-3 md:grid-cols-3">{children}</div>
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-5">
      <p className="font-display text-5xl leading-none text-accent">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  )
}

function Callout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <aside className="my-8 rounded-2xl border border-accent/30 bg-accent-soft p-5 text-[0.98rem] text-ink [&_a]:text-ink">
      {title && <p className="kicker mb-2 text-ink">{title}</p>}
      {children}
    </aside>
  )
}

function Tradeoff({ chose, over, because }: { chose: string; over: string; because: string }) {
  const { lang } = useI18n()
  return (
    <div className="my-5 grid gap-2 rounded-2xl border border-line p-5 md:grid-cols-[1fr_1fr]">
      <p>
        <span className="kicker block text-accent">{lang === 'ja' ? '選択' : 'Chose'}</span>
        {chose}
      </p>
      <p>
        <span className="kicker block">{lang === 'ja' ? '見送り' : 'Over'}</span>
        <span className="text-muted">{over}</span>
      </p>
      <p className="text-sm text-muted md:col-span-2">{because}</p>
    </div>
  )
}

export const mdxComponents = { Figure, Stats, Stat, Callout, Tradeoff }
