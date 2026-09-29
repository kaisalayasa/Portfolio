import { useId } from 'react'
import { cn } from '@/lib/cn'

/**
 * 判子 — the hanko seal. Used as logo, favicon, loader and the カイス先生 stamp.
 * `text` renders vertically when it's more than 2 characters of Japanese.
 */
export function Seal({
  text = 'Q',
  size = 40,
  rotate = -6,
  className,
  variant = 'solid',
  label,
}: {
  text?: string
  size?: number
  rotate?: number
  className?: string
  variant?: 'solid' | 'outline'
  label?: string
}) {
  const fid = `seal-${useId().replace(/:/g, '')}`
  const vertical = text.length > 2
  const chars = [...text]
  const solid = variant === 'solid'
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        {/* Slightly rough ink edge */}
        <filter id={fid} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.4" />
        </filter>
      </defs>
      <g filter={`url(#${fid})`}>
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="15"
          fill={solid ? 'var(--accent)' : 'none'}
          stroke="var(--accent)"
          strokeWidth={solid ? 0 : 3}
        />
        <rect x="8" y="8" width="48" height="48" rx="10.5" fill="none" stroke={solid ? 'var(--on-accent)' : 'var(--accent)'} strokeOpacity={solid ? 0.5 : 0.7} strokeWidth="1.3" />
        {vertical ? (
          <text
            fill={solid ? 'var(--on-accent)' : 'var(--accent)'}
            fontFamily="'Zen Old Mincho', serif"
            fontWeight="700"
            fontSize={chars.length > 3 ? 11.5 : 14}
            textAnchor="middle"
          >
            {/* Two columns, right-to-left, like a real seal */}
            {(() => {
              const half = Math.ceil(chars.length / 2)
              const cols = [chars.slice(0, half), chars.slice(half)]
              const step = chars.length > 3 ? 12.5 : 15
              return cols.map((col, ci) =>
                col.map((ch, i) => (
                  <tspan key={`${ci}-${i}`} x={ci === 0 ? 41 : 23} y={21 + i * step + (half - col.length) * (step / 2)}>
                    {ch}
                  </tspan>
                )),
              )
            })()}
          </text>
        ) : (
          <text
            x="32"
            y={text === 'Q' ? 44 : 42}
            textAnchor="middle"
            fill={solid ? 'var(--on-accent)' : 'var(--accent)'}
            fontFamily={text === 'Q' ? "'Instrument Serif', Georgia, serif" : "'Zen Old Mincho', serif"}
            fontStyle={text === 'Q' ? 'italic' : 'normal'}
            fontWeight={text === 'Q' ? 400 : 700}
            fontSize={text.length === 1 ? 34 : 22}
          >
            {text}
          </text>
        )}
      </g>
    </svg>
  )
}
