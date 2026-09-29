import { useEffect } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from '@/lib/router'
import { useI18n } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import { ui } from '@/lib/store'
import { track } from '@/lib/analytics'
import { asset, hasAsset } from '@/lib/media'
import { toggleSound } from '@/lib/sound'
import { getLenis } from '@/lib/scroll'
import { useCopy } from '@/hooks/useCopy'
import { profile } from '@/content/profile'
import { projectBySlug, projects } from '@/content/projects'
import { NAV_ITEMS, useGoToSection } from './Nav'
import { IconArrowRight, IconCopy, IconFile, IconGitHub, IconLinkedIn, IconMoon, IconSearch, IconSoundOn, IconSpark } from './ui/Icons'

const SHIRITORI_URL = projectBySlug('shiritori')!.links.live!

const itemCls =
  'flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm text-muted data-[selected=true]:bg-ink/7 data-[selected=true]:text-ink'
const groupCls =
  '[&_[cmdk-group-heading]]:kicker [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[0.65rem]!'

/** ⌘K / Ctrl+K — jump anywhere, toggle things, copy email, play shiritori. */
export default function CommandPalette() {
  const open = ui.use().palette
  const { t, r, toggleLang } = useI18n()
  const { toggle } = useTheme()
  const go = useGoToSection()
  const navigate = useNavigate()
  const copy = useCopy()
  const { email } = profile
  const { linkedin } = profile.links
  const resume = hasAsset(profile.resume.pdf)

  const setOpen = (v: boolean) => ui.set((s) => ({ ...s, palette: v }))
  const run = (fn: () => void) => () => {
    setOpen(false)
    // let the dialog close before scrolling/navigating
    requestAnimationFrame(fn)
  }

  useEffect(() => {
    if (open) {
      track('palette_open')
      getLenis()?.stop()
    } else getLenis()?.start()
  }, [open])

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label={t('nav.palette')}
      loop
      overlayClassName="fixed inset-0 z-75 bg-black/50 backdrop-blur-sm"
      contentClassName="fixed top-[12vh] left-1/2 z-76 w-[min(640px,calc(100vw-24px))] -translate-x-1/2"
      className="card overflow-hidden bg-surface/95! backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <IconSearch className="text-muted" />
        <Command.Input
          placeholder={t('palette.placeholder')}
          className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted/80"
        />
        <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
      </div>
      <Command.List className="max-h-[min(60vh,440px)] overflow-y-auto overscroll-contain p-2" data-lenis-prevent>
        <Command.Empty className="px-3 py-8 text-center text-sm text-muted">{t('palette.empty')}</Command.Empty>

        <Command.Group heading={t('palette.sections')} className={groupCls}>
          {NAV_ITEMS.map((n) => (
            <Command.Item key={n.id} value={`section ${n.id} ${t(n.key)} ${n.jp}`} onSelect={run(() => go(n.id))} className={itemCls}>
              <IconArrowRight size={15} />
              {t(n.key)}
              <span className="ml-auto font-mincho text-xs" aria-hidden>
                {n.jp}
              </span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={t('palette.projects')} className={groupCls}>
          {projects.map((p) => (
            <Command.Item
              key={p.slug}
              value={`project ${r(p.title)} ${p.tags.join(' ')}`}
              onSelect={run(() => (p.caseStudy ? navigate(`/projects/${p.slug}`, { viewTransition: true }) : go('projects')))}
              className={itemCls}
            >
              <IconSpark size={15} />
              {r(p.title)}
              <span className="ml-auto truncate font-mono text-[10px] tracking-wider uppercase">{p.caseStudy ? t('work.case') : ''}</span>
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={t('palette.actions')} className={groupCls}>
          <Command.Item value="play shiritori しりとり game" onSelect={run(() => {
              track('shiritori_play', { from: 'palette' })
              window.open(SHIRITORI_URL, '_blank', 'noopener')
            })} className={itemCls}>
            <span className="w-[15px] text-center font-jp text-xs text-accent">し</span>
            {t('palette.shiritori')}
          </Command.Item>
          <Command.Item value="toggle theme dark light paper" onSelect={run(toggle)} className={itemCls}>
            <IconMoon size={15} />
            {t('palette.theme')}
          </Command.Item>
          <Command.Item value="language japanese english 日本語" onSelect={run(toggleLang)} className={itemCls}>
            <span className="w-[15px] text-center font-jp text-xs">あ</span>
            {t('palette.lang')}
          </Command.Item>
          <Command.Item
            value={`copy email ${email}`}
            onSelect={run(() => {
              copy(email, t('contact.copied'))
              track('email_copy', { from: 'palette' })
            })}
            className={itemCls}
          >
            <IconCopy size={15} />
            {t('palette.copyEmail')}
          </Command.Item>
          {resume && (
            <Command.Item
              value="open resume cv pdf 履歴書"
              onSelect={run(() => {
                track('resume_download', { from: 'palette' })
                window.open(asset(profile.resume.pdf), '_blank', 'noopener')
              })}
              className={itemCls}
            >
              <IconFile size={15} />
              {t('palette.resume')}
            </Command.Item>
          )}
          <Command.Item value="github code source" onSelect={run(() => window.open(profile.links.github, '_blank', 'noopener'))} className={itemCls}>
            <IconGitHub size={15} />
            {t('palette.github')}
          </Command.Item>
          <Command.Item
            value="linkedin"
            onSelect={run(() => {
              track('linkedin_click', { from: 'palette' })
              window.open(linkedin, '_blank', 'noopener')
            })}
            className={itemCls}
          >
            <IconLinkedIn size={15} />
            {t('palette.linkedin')}
          </Command.Item>
          <Command.Item value="sound audio toggle" onSelect={run(toggleSound)} className={itemCls}>
            <IconSoundOn size={15} />
            {t('palette.sound')}
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}
