import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'

const COLUMNS = 12
// Twelve cards: one per project slot in a typical delivery quarter. They start
// scattered and land on the grid — the theme's whole argument in one gesture.
const CARDS = [
  { x: 18, y: 22, w: 16, h: 9 },
  { x: 62, y: 14, w: 20, h: 11 },
  { x: 34, y: 58, w: 18, h: 10 },
  { x: 72, y: 62, w: 14, h: 8 },
  { x: 10, y: 70, w: 15, h: 9 },
  { x: 48, y: 30, w: 17, h: 10 },
  { x: 26, y: 40, w: 13, h: 8 },
  { x: 80, y: 36, w: 12, h: 7 },
  { x: 56, y: 76, w: 16, h: 9 },
  { x: 14, y: 46, w: 14, h: 8 },
  { x: 68, y: 48, w: 15, h: 9 },
  { x: 40, y: 12, w: 13, h: 8 },
]

// Deterministic scatter — a seeded pseudo-random so the entrance is identical
// on every load. A different scatter each visit would read as noise, not as a
// deliberate opening move.
function scatter(i) {
  const f = (n) => n - Math.floor(n)
  return {
    dx: (f(Math.sin(i * 12.9898) * 43758.5453) - 0.5) * 34,
    dy: (f(Math.sin(i * 78.233) * 43758.5453) - 0.5) * 30,
    rot: (f(Math.sin(i * 39.425) * 43758.5453) - 0.5) * 26,
  }
}

// The persistent drafting grid plus the one-time scatter -> snap. Both are
// purely decorative: the page content renders and is interactive underneath
// from first paint, so nothing here can gate the reader.
export function OrderGrid() {
  const { theme } = useTheme()
  const [snapped, setSnapped] = useState(false)
  const [gone, setGone] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    if (theme !== 'order') return undefined
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Reduced motion gets the composed resting state, not a failed effect:
    // the grid stays, the cards were never scattered, and nothing animates.
    if (reduced) {
      setSnapped(true)
      setGone(true)
      return undefined
    }
    timers.current = [
      window.setTimeout(() => setSnapped(true), 420),
      window.setTimeout(() => setGone(true), 1750),
    ]
    const scheduled = timers.current
    return () => scheduled.forEach(window.clearTimeout)
  }, [theme])

  if (theme !== 'order') return null

  const step = 100 / COLUMNS

  return (
    <div className="order-grid" aria-hidden="true" data-testid="order-grid">
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        {Array.from({ length: COLUMNS - 1 }, (_, i) => (
          <line
            key={`c${i}`}
            className={`order-rule${(i + 1) % 3 === 0 ? ' order-rule-major' : ''}`}
            x1={(i + 1) * step}
            y1="0"
            x2={(i + 1) * step}
            y2="100"
          />
        ))}
      </svg>

      {/* Registration marks — the drawing-set tell. Fixed-size SVGs pinned to
          the real corners: a single scaled viewBox would letterbox and drop
          them mid-content instead of into the gutters. */}
      {[
        ['left-3 top-20', 'tl'],
        ['right-3 top-20', 'tr'],
        ['left-3 bottom-4', 'bl'],
        ['right-3 bottom-4', 'br'],
      ].map(([pos, key]) => (
        <svg
          key={key}
          className={`absolute hidden h-4 w-4 xl:block ${pos}`}
          viewBox="0 0 16 16"
          focusable="false"
        >
          <g className="order-mark">
            <circle cx="8" cy="8" r="3.2" />
            <line x1="0" y1="8" x2="16" y2="8" />
            <line x1="8" y1="0" x2="8" y2="16" />
          </g>
        </svg>
      ))}

      {/* The opening move. Removed from the DOM once it has landed. */}
      {!gone && (
        <div className="absolute inset-0" data-testid="order-cards">
          {CARDS.map((card, i) => {
            const s = scatter(i)
            return (
              <div
                key={i}
                className="order-item absolute"
                style={{
                  left: `${card.x}%`,
                  top: `${card.y}%`,
                  width: `${card.w}%`,
                  height: `${card.h}%`,
                  background: 'rgb(var(--color-card))',
                  border: '1px solid rgb(var(--color-hairline))',
                  borderLeft: '2px solid rgb(var(--color-accent) / 0.55)',
                  borderRadius: '2px',
                  opacity: snapped ? 0 : 1,
                  transform: snapped
                    ? 'translate(0,0) rotate(0deg)'
                    : `translate(${s.dx}%, ${s.dy}%) rotate(${s.rot}deg)`,
                  transition: `transform 900ms cubic-bezier(0.16,1,0.3,1) ${i * 28}ms, opacity 520ms ease ${420 + i * 28}ms`,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
