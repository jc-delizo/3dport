import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'

// 65 is not a decoration: it is the figure the ProofBar already claims —
// "Projects delivered end to end in 3 years". The rail ships exactly that many
// by the time the reader reaches the footer, so the motion carries real data.
export const TOTAL = 65
const LANES = ['Intake', 'Build', 'Review', 'Shipped']

// Where each project sits at a given scroll progress. Work enters staggered
// and advances lane by lane, so mid-page the board looks like a real pipeline
// — some queued, some in flight, some done — rather than a progress bar.
//
// The last item must ship at COMPLETE (0.85), not at 1.0: tying the payoff to
// absolute scroll bottom means a reader who stops at the footer's top never
// sees 65 of 65, which is the whole point of the rail.
const LAST_ENTRY = 0.6
const TRANSIT = 0.25
export const COMPLETE = LAST_ENTRY + TRANSIT

export function laneFor(index, progress) {
  const entry = (index / TOTAL) * LAST_ENTRY
  const advanced = (progress - entry) / TRANSIT
  if (advanced <= 0) return -1
  if (advanced >= 1) return 3
  return Math.min(2, Math.floor(advanced * 3))
}

export function ThroughputRail() {
  const { theme } = useTheme()
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (theme !== 'throughput') return undefined

    const read = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1)
    }

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Reduced motion: the board is already full and the count already landed.
    // Composed, not broken — the reader sees the finished pipeline.
    if (reduced) {
      setProgress(1)
      return undefined
    }

    // rAF-coalesced so a fast scroll costs one layout read per frame, not one
    // per event.
    const onScroll = () => {
      if (frame.current) return
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0
        read()
      })
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current) window.cancelAnimationFrame(frame.current)
    }
  }, [theme])

  if (theme !== 'throughput') return null

  // The rail is a fixed bar over the page foot, so it would sit across the
  // hero's proof figures on first paint. It arrives with the reader's first
  // scroll instead — which also reads better: the pipeline starts moving
  // because they moved.
  const armed = progress > 0.015

  const lanes = [[], [], [], []]
  for (let i = 0; i < TOTAL; i += 1) {
    const lane = laneFor(i, progress)
    if (lane >= 0) lanes[lane].push(i)
  }
  const shipped = lanes[3].length

  return (
    <div
      className="throughput-rail"
      data-testid="throughput-rail"
      data-armed={armed ? 'true' : 'false'}
    >
      {/* aria-hidden: the same figures are already stated as text in the proof
          bar, so announcing a moving duplicate would only add noise. */}
      <div className="mx-auto w-full max-w-[80rem] px-4 py-2 md:px-6" aria-hidden="true">
        <div className="flex items-stretch gap-2 md:gap-4">
          {LANES.map((label, lane) => (
            <div key={label} className="min-w-0 flex-1">
              {/* Count sits immediately after its own label: right-aligned
                  across a wide lane, it reads as belonging to the next one. */}
              <div className="mb-1 flex items-baseline gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {label}
                </span>
                <span
                  className={`font-mono text-[10px] tabular-nums ${
                    lane === 3 ? 'font-semibold text-accent' : 'text-muted'
                  }`}
                >
                  {lanes[lane].length}
                </span>
              </div>
              <div className="flex h-4 flex-wrap content-start gap-[2px] overflow-hidden md:h-5">
                {lanes[lane].map((id) => (
                  <span
                    key={id}
                    data-shipped={lane === 3 ? 'true' : 'false'}
                    className="throughput-card h-[6px] w-[6px] md:h-2 md:w-2"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-1.5 font-mono text-[10px] text-muted">
          <span className="font-semibold text-accent tabular-nums">{shipped}</span> of {TOTAL}{' '}
          projects delivered end to end
        </p>
      </div>
    </div>
  )
}
