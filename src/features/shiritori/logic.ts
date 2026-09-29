import { toHiragana } from 'wanakana'
import { WORDS } from './words'

const SMALL: Record<string, string> = { ぁ: 'あ', ぃ: 'い', ぅ: 'う', ぇ: 'え', ぉ: 'お', ゃ: 'や', ゅ: 'ゆ', ょ: 'よ', っ: 'つ', ゎ: 'わ', ゕ: 'か', ゖ: 'け' }

/** Romaji / katakana / hiragana → hiragana, spaces removed. */
export function normalize(input: string) {
  return toHiragana(input.trim().replace(/\s+/g, ''), { passRomaji: false }).replace(/[。、！!？?]/g, '')
}

const isKana = (s: string) => /^[ぁ-ゖー]+$/.test(s)

/** Last playable kana: ignores trailing ー and enlarges small kana (でんしゃ → や). */
export function lastKana(word: string) {
  const w = word.replace(/ー+$/, '')
  const ch = w.at(-1) ?? ''
  return SMALL[ch] ?? ch
}

const firstKana = (word: string) => word[0] ?? ''

/** The kana plus its voiced/semi-voiced siblings: は → は, ば, ぱ. */
export function variants(kana: string) {
  const base = kana.normalize('NFD')[0]
  return [base, `${base}゙`, `${base}゚`].map((k) => k.normalize('NFC')).filter((k) => k.length === 1)
}

type Verdict =
  | { ok: true; word: string }
  | { ok: false; reason: 'notKana' | 'tooShort' | 'mustStart' | 'used' | 'endsN'; word: string }

/** Validates the player's word against the previous one. Starting kana is matched leniently (た ≈ だ). */
export function judge(raw: string, previous: string | null, used: Set<string>): Verdict {
  const word = normalize(raw)
  if (!isKana(word)) return { ok: false, reason: 'notKana', word }
  if (word.replace(/ー/g, '').length < 2) return { ok: false, reason: 'tooShort', word }
  if (previous && !variants(lastKana(previous)).includes(firstKana(word))) return { ok: false, reason: 'mustStart', word }
  if (used.has(word)) return { ok: false, reason: 'used', word }
  if (lastKana(word) === 'ん') return { ok: false, reason: 'endsN', word }
  return { ok: true, word }
}

/** The computer's reply: an unused dictionary word starting with the needed kana. */
export function reply(previous: string, used: Set<string>, random = Math.random): string | null {
  const need = lastKana(previous)
  const exact = WORDS.filter((w) => firstKana(w) === need && !used.has(w))
  const pool = exact.length ? exact : WORDS.filter((w) => variants(need).includes(firstKana(w)) && !used.has(w))
  return pool.length ? pool[Math.floor(random() * pool.length)] : null
}
