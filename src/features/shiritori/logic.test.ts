import { describe, expect, it } from 'vitest'
import { judge, lastKana, normalize, reply, variants } from './logic'
import { WORDS } from './words'

describe('shiritori logic', () => {
  it('normalizes romaji and katakana to hiragana', () => {
    expect(normalize('ringo')).toBe('りんご')
    expect(normalize('ネコ')).toBe('ねこ')
    expect(normalize(' su shi ')).toBe('すし')
  })

  it('handles small kana and long vowels at the end', () => {
    expect(lastKana('でんしゃ')).toBe('や')
    expect(lastKana('ぎたー')).toBe('た')
    expect(lastKana('ちょう')).toBe('う')
  })

  it('matches voiced variants leniently', () => {
    expect(variants('は')).toEqual(['は', 'ば', 'ぱ'])
    expect(variants('た')).toContain('だ')
    expect(judge('だんご', 'ぶた', new Set()).ok).toBe(true)
  })

  it('rejects ん endings, repeats, wrong starts and non-kana', () => {
    const used = new Set(['ねこ'])
    expect(judge('こはん', 'ねこ', used)).toMatchObject({ ok: false, reason: 'endsN' })
    expect(judge('ねこ', 'すね', used)).toMatchObject({ ok: false, reason: 'used' })
    expect(judge('いぬ', 'ねこ', used)).toMatchObject({ ok: false, reason: 'mustStart' })
    expect(judge('cat!', null, used)).toMatchObject({ ok: false, reason: 'notKana' })
    expect(judge('か', null, used)).toMatchObject({ ok: false, reason: 'tooShort' })
  })

  it('computer replies with a valid, unused word', () => {
    const used = new Set(['りんご'])
    const w = reply('りんご', used, () => 0)
    expect(w && w[0]).toBe('ご')
    expect(reply('ぬぬぬ', new Set(WORDS), () => 0)).toBeNull()
  })

  it('dictionary never ends in ん and is all kana', () => {
    for (const w of WORDS) {
      expect(lastKana(w)).not.toBe('ん')
      expect(w).toMatch(/^[ぁ-ゖー]+$/)
    }
  })
})
