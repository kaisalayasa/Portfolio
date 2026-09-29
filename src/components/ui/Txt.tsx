import type { L } from '@/content/types'
import { useI18n } from '@/lib/i18n'

/** Renders a content value (`string | { en, ja }`) in the current language. */
export function Txt({ v, className, as: Tag = 'span' }: { v: L | undefined; className?: string; as?: 'span' | 'p' | 'div' }) {
  const { r } = useI18n()
  const s = r(v)
  if (!s) return null
  return <Tag className={className}>{s}</Tag>
}
