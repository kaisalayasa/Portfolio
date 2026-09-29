import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en from '@/content/i18n/en.json'
import ja from '@/content/i18n/ja.json'
import type { L, Lang } from '@/content/types'
import { track } from './analytics'

type Dict = typeof en
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>
}[keyof T & string]
export type TKey = Leaves<Dict>

const dicts: Record<Lang, unknown> = { en, ja }

function lookup(dict: unknown, key: string): string | undefined {
  let cur: unknown = dict
  for (const part of key.split('.')) {
    if (cur && typeof cur === 'object' && part in cur) cur = (cur as Record<string, unknown>)[part]
    else return undefined
  }
  return typeof cur === 'string' ? cur : undefined
}

const interpolate = (s: string, vars?: Record<string, string | number>) =>
  vars ? s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`)) : s

/** Resolve a content value (`string | { en, ja }`) for a language. */
const resolve = (v: L | undefined, lang: Lang) => (v == null ? '' : typeof v === 'string' ? v : (v[lang] ?? v.en))

interface I18n {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
  /** UI string from en.json / ja.json */
  t: (key: TKey, vars?: Record<string, string | number>) => string
  /** Content value (string | { en, ja }) */
  r: (v: L | undefined) => string
}

const Ctx = createContext<I18n | null>(null)

const initialLang = (): Lang => (typeof document !== 'undefined' && document.documentElement.lang === 'ja' ? 'ja' : 'en')

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('qa-lang', lang)
    } catch {
      /* private mode */
    }
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    track('language_toggle', { lang: l })
  }, [])

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === 'en' ? 'ja' : 'en'),
      t: (key, vars) => interpolate(lookup(dicts[lang], key) ?? lookup(dicts.en, key) ?? key, vars),
      r: (v) => resolve(v, lang),
    }),
    [lang, setLang],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
