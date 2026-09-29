import { Marquee } from '@/components/ui/Primitives'

const WORDS: [string, string, string][] = [
  ['Build', '作る', 'ابنِ'],
  ['Learn', '学ぶ', 'تعلّم'],
  ['Ship', '届ける', 'أطلق'],
  ['Listen', '聴く', 'استمع'],
  ['Iterate', '磨く', 'حسّن'],
  ['Connect', 'つなぐ', 'تواصل'],
]

/** The trilingual word belt under the hero. */
export function Belt() {
  return (
    <section aria-label="Build · Learn · Ship" className="py-6 md:py-10">
      <Marquee
        className="border-y border-line py-5"
        items={WORDS.map(([en, ja, ar]) => (
          <span key={en} className="flex items-baseline gap-5 font-display text-3xl whitespace-nowrap md:text-5xl">
            <span>{en}</span>
            <span className="font-mincho text-2xl text-accent md:text-4xl" lang="ja">
              {ja}
            </span>
            <span className="text-2xl text-muted md:text-4xl" lang="ar" dir="rtl" style={{ fontFamily: 'var(--font-arabic)' }}>
              {ar}
            </span>
          </span>
        ))}
      />
    </section>
  )
}
