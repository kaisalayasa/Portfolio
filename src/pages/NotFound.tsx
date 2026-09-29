import { useEffect } from 'react'
import { Link } from '@/lib/router'
import { useI18n } from '@/lib/i18n'
import { profile } from '@/content/profile'
import { btn } from '@/components/ui/Primitives'
import { Seal } from '@/components/ui/Seal'
import { IconArrowLeft } from '@/components/ui/Icons'
import { ShiritoriGame } from '@/features/shiritori/ShiritoriGame'

/** 迷子になりました — themed 404 with a round of shiritori. */
export default function NotFound() {
  const { t } = useI18n()
  useEffect(() => {
    document.title = `迷子になりました — ${profile.name}`
  }, [])
  return (
    <main id="main" className="container-page flex min-h-[100svh] flex-col justify-center py-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Seal text="迷子" size={72} className="mb-8" />
          <p className="kicker">404</p>
          <h1 className="mt-3 font-mincho text-[clamp(3rem,9vw,6.5rem)] leading-[1.05]" lang="ja">
            {t('notFound.title')}
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">{t('notFound.sub')}</p>
          <Link to="/" className={btn('primary', 'mt-8')}>
            <IconArrowLeft size={16} /> {t('notFound.home')}
          </Link>
        </div>
        <div className="card p-6 md:p-8">
          <p className="mb-4 font-display text-3xl">
            {t('shiritori.title')} <span className="font-mincho text-lg text-muted">しりとり</span>
          </p>
          <ShiritoriGame />
        </div>
      </div>
    </main>
  )
}
