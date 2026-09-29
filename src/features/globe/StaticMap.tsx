import { journey } from '@/content/journey'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/cn'

// Equirectangular window: lon -110…160, lat 60…10
const W = 1000
const H = 420
const px = (lon: number) => ((lon + 110) / 270) * W
const py = (lat: number) => ((60 - lat) / 50) * H

/** Stylized static route map — the fallback when WebGL, motion or screen size says no globe. */
export function StaticMap({ active, onSelect }: { active: string; onSelect: (id: string, rotate: boolean) => void }) {
  const { r, t } = useI18n()
  const pts = journey.map((s) => ({ ...s, x: px(s.lon), y: py(s.lat) }))
  const label: Record<string, 'above' | 'below'> = { tokyo: 'below', morioka: 'above' }

  return (
    <div className="card overflow-hidden p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label={t('journey.title')}>
        <defs>
          <pattern id="map-dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="currentColor" className="text-ink/10" />
          </pattern>
          <linearGradient id="route" x1="0" x2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--indigo)" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#map-dots)" rx="18" />
        {/* Graticule */}
        {[-90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => (
          <line key={lon} x1={px(lon)} x2={px(lon)} y1="0" y2={H} stroke="var(--border)" strokeDasharray="2 6" />
        ))}
        {[50, 40, 30, 20].map((lat) => (
          <g key={lat}>
            <line x1="0" x2={W} y1={py(lat)} y2={py(lat)} stroke="var(--border)" strokeDasharray="2 6" />
            <text x="8" y={py(lat) - 5} className="fill-muted font-mono" fontSize="11">
              {lat}°N
            </text>
          </g>
        ))}
        {/* Route arcs */}
        {pts.slice(1).map((b, i) => {
          const a = pts[i]
          const mx = (a.x + b.x) / 2
          const my = Math.min(a.y, b.y) - Math.max(40, Math.abs(b.x - a.x) * 0.22)
          return <path key={b.id} d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`} fill="none" stroke="url(#route)" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
        })}
        {pts.map((p, i) => (
          <g
            key={p.id}
            role="button"
            tabIndex={0}
            aria-label={r(p.place)}
            aria-pressed={active === p.id}
            onClick={() => onSelect(p.id, true)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(p.id, true)}
            className="cursor-pointer outline-none"
          >
            <circle cx={p.x} cy={p.y} r="22" fill="transparent" />
            <circle cx={p.x} cy={p.y} r={active === p.id ? 12 : 8} className={cn('transition-all', active === p.id ? 'fill-accent/25' : 'fill-transparent')} />
            <circle cx={p.x} cy={p.y} r="5.5" fill="var(--accent)" />
            <text
              x={p.x + (p.id === 'richmond' ? 14 : p.x > 800 ? -14 : 14)}
              y={p.y + (label[p.id] === 'below' ? 26 : label[p.id] === 'above' ? -14 : 5)}
              textAnchor={p.x > 800 ? 'end' : 'start'}
              className={cn('font-sans', active === p.id ? 'fill-ink' : 'fill-muted')}
              fontSize="17"
            >
              {i + 1}. {r(p.place)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
