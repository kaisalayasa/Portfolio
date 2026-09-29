import { useEffect, useState } from 'react'
import { profile } from '@/content/profile'
import { GOATCOUNTER, REPO_URL } from '../../site.config.ts'
import { useI18n } from '@/lib/i18n'
import { scrollToTop } from '@/lib/scroll'
import { track } from '@/lib/analytics'
import { Seal } from '@/components/ui/Seal'
import { IconArrowUp, IconGitHub, IconLinkedIn } from '@/components/ui/Icons'
import { LocalNow } from './LocalNow'

/** Public GoatCounter total (needs "Allow adding visitor counts on your website" in GoatCounter settings). */
function Visitors() {
  const { t } = useI18n()
  const [count, setCount] = useState<string | null>(null)
  useEffect(() => {
    if (!GOATCOUNTER) return
    fetch(`https://${GOATCOUNTER}.goatcounter.com/counter/TOTAL.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { count: string }) => setCount(j.count))
      .catch(() => {})
  }, [])
  if (!count) return null
  return <span className="font-mono text-xs text-muted">{t('footer.visitors', { n: count })}</span>
}

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="border-t border-line py-10" data-print="hide">
      <div className="container-page flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Seal size={36} />
            <p className="text-sm">
              © {new Date().getFullYear()} {profile.name} · Palestine → Richmond, IN → Morioka, <span lang="ja">岩手</span>
            </p>
          </div>
          <p className="text-sm text-muted">{t('footer.built')}</p>
          <LocalNow />
          <Visitors />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink" aria-label="GitHub">
            <IconGitHub />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('linkedin_click', { from: 'footer' })}
            className="grid size-11 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
            aria-label="LinkedIn"
          >
            <IconLinkedIn />
          </a>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="link-draw mx-2 inline-flex min-h-11 items-center text-sm text-muted hover:text-ink">
            {t('footer.source')}
          </a>
          <button type="button" onClick={scrollToTop} className="grid size-11 place-items-center rounded-full border border-line text-muted hover:border-line-strong hover:text-ink" aria-label={t('footer.top')}>
            <IconArrowUp />
          </button>
        </div>
      </div>
    </footer>
  )
}
