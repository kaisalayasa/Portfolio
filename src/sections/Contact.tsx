import { profile } from '@/content/profile'
import { useI18n } from '@/lib/i18n'
import { asset, hasAsset } from '@/lib/media'
import { track } from '@/lib/analytics'
import { scrollToId } from '@/lib/scroll'
import { sectionNumber } from '@/lib/sections'
import { useCopy } from '@/hooks/useCopy'
import { Emph, btn } from '@/components/ui/Primitives'
import { Magnetic, Reveal, RevealItem } from '@/components/ui/Motion'
import { IconCopy, IconFile, IconGitHub, IconLinkedIn, IconMail } from '@/components/ui/Icons'

export default function Contact() {
  const { t } = useI18n()
  const copy = useCopy()
  const { email } = profile
  const { linkedin } = profile.links
  const resume = hasAsset(profile.resume.pdf)

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute bottom-[-30%] left-1/2 size-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]" />
      </div>
      <div className="container-page relative lg:pl-24">
        <div aria-hidden className="pointer-events-none absolute top-1 left-8 hidden lg:block">
          <div className="vertical-jp text-[1.35rem] text-accent">連絡</div>
        </div>
        <Reveal>
          <RevealItem className="kicker mb-6 flex items-center gap-3">
            <span className="text-accent">{sectionNumber('contact')}</span>
            <span className="h-px w-8 bg-line-strong" />
            {t('contact.kicker')}
          </RevealItem>
          <RevealItem as="h2" className="max-w-5xl font-display text-[clamp(2.8rem,8vw,7.2rem)] leading-[0.95] tracking-[-0.03em] text-balance-pretty">
            <span id="contact-title">
              <Emph text={t('contact.title')} />
            </span>
          </RevealItem>
          <RevealItem as="p" className="mt-6 font-mincho text-2xl text-muted md:text-3xl">
            <span lang="ja">お気軽にご連絡ください。</span>
          </RevealItem>

          <RevealItem className="mt-12 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a href={`mailto:${email}`} className={btn('primary', 'h-14 px-8 text-base')}>
                <IconMail size={18} /> {t('contact.email')}
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => {
                copy(email, t('contact.copied'))
                track('email_copy', { from: 'contact' })
              }}
              className={btn('ghost', 'h-14')}
              aria-label={`${t('contact.copy')}: ${email}`}
            >
              <IconCopy size={16} /> <span className="font-mono text-sm">{email}</span>
            </button>
            <a href={linkedin} target="_blank" rel="noreferrer" onClick={() => track('linkedin_click', { from: 'contact' })} className={btn('ghost', 'h-14')}>
              <IconLinkedIn size={16} /> LinkedIn
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className={btn('ghost', 'h-14')}>
              <IconGitHub size={16} /> GitHub
            </a>
            <a
              href={resume ? asset(profile.resume.pdf) : '#resume'}
              {...(resume ? { target: '_blank', rel: 'noreferrer' } : {})}
              onClick={(e) => {
                if (resume) track('resume_download', { from: 'contact' })
                else {
                  e.preventDefault()
                  scrollToId('resume')
                }
              }}
              className={btn('ghost', 'h-14')}
            >
              <IconFile size={16} /> {t('nav.resume')}
            </a>
          </RevealItem>

        </Reveal>
      </div>
    </section>
  )
}
