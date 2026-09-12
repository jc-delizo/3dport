import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'

// Every series below is a real, stated figure from the site's own content —
// no invented telemetry. A console that displays numbers it cannot source is
// exactly the credibility risk this audience notices.
const INSTRUMENTS = [
  { label: 'Projects / yr', series: [2, 3, 6, 11, 18, 24, 28], value: '20–28' },
  { label: 'Delivered E2E', series: [4, 9, 17, 28, 41, 54, 65], value: '65' },
  { label: 'Systems live', series: [1, 3, 5, 7, 10, 13, 15], value: '15' },
]

function path(series, w, h) {
  const max = Math.max(...series)
  const min = Math.min(...series)
  const span = max - min || 1
  return series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * w
      const y = h - ((v - min) / span) * h
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

// The instrument rail: a fixed strip of sparklines that draw themselves once
// as the reader arrives, then hold. CSS hides it below the wide breakpoint
// (see .signal-rail) so it never crowds a phone.
export function SignalRail() {
  const { theme } = useTheme()
  const [drawn, setDrawn] = useState(false)
  const timer = useRef(0)

  useEffect(() => {
    if (theme !== 'signal') return undefined
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDrawn(true)
      return undefined
    }
    timer.current = window.setTimeout(() => setDrawn(true), 260)
    return () => window.clearTimeout(timer.current)
  }, [theme])

  if (theme !== 'signal') return null

  // R of the end dot, kept as padding on both axes so it is never clipped by
  // the SVG edge.
  const DOT = 2.5
  const W = 104
  const H = 30

  return (
    <aside className="signal-rail" data-testid="signal-rail" aria-hidden="true">
      <div className="flex h-full flex-col justify-center gap-5 px-3 py-4">
        {INSTRUMENTS.map(({ label, series, value }) => (
          <div
            key={label}
            className="rounded-card border border-hairline bg-card px-3 py-2 shadow-sm"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
              {label}
            </div>
            <div className="font-display text-lg font-semibold leading-tight tabular-nums">
              {value}
            </div>
            <svg
              width={W}
              height={H + DOT * 2}
              viewBox={`0 0 ${W} ${H + DOT * 2}`}
              focusable="false"
              className="mt-1"
            >
              <path
                className="signal-spark"
                d={path(series, W - DOT, H) }
                transform={`translate(0 ${DOT})`}
                strokeDasharray="260"
                strokeDashoffset={drawn ? 0 : 260}
                style={{ transition: 'stroke-dashoffset 1100ms ease-out' }}
              />
              <circle
                className="signal-dot"
                r={DOT}
                cx={W - DOT}
                cy={
                  DOT +
                  H -
                  ((series.at(-1) - Math.min(...series)) /
                    (Math.max(...series) - Math.min(...series) || 1)) *
                    H
                }
                opacity={drawn ? 1 : 0}
                style={{ transition: 'opacity 400ms ease 900ms' }}
              />
            </svg>
          </div>
        ))}
      </div>
    </aside>
  )
}
