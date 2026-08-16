import { useEffect, useRef, useState } from 'react'
import { site } from '../content/site'
import { useTheme } from '../theme/ThemeContext'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

const { approach } = site

// Blend descriptions for assistive tech and for the caption crossfade zones.
function valueText(v) {
  if (v <= 5) return 'Fully project manager'
  if (v < 40) return `Project manager leaning — ${100 - v}% delivery, ${v}% engineering`
  if (v <= 60) return 'Balanced — where delivery meets engineering'
  if (v < 95) return `Engineer leaning — ${v}% engineering, ${100 - v}% delivery`
  return 'Fully engineer'
}

// A vertical chain of flow steps with hairline connectors between them.
// `strength` (0..1) drives emphasis via opacity/scale; `accent` marks the
// bridge chain, whose middle links light up in the accent color at center.
function Chain({ steps, strength, accent = false, join = '↓' }) {
  return (
    <ol
      className="flex flex-col items-center transition-[opacity,transform] duration-150"
      style={{ opacity: 0.35 + 0.65 * strength, transform: `scale(${0.96 + 0.04 * strength})` }}
    >
      {steps.map((step, i) => (
        <li key={step} className="flex flex-col items-center">
          {i > 0 ? (
            <span
              aria-hidden="true"
              className={`py-0.5 font-mono text-label ${
                accent && strength > 0.6 ? 'text-accent' : 'text-muted'
              }`}
            >
              {accent && i === 3 ? '↕' : join}
            </span>
          ) : null}
          <span
            className={`rounded-button border px-3.5 py-1.5 font-mono text-label uppercase tracking-widest transition-colors duration-150 ${
              accent && strength > 0.6
                ? 'border-accent bg-card text-ink'
                : 'border-hairline bg-card text-muted'
            }`}
          >
            {step}
          </span>
        </li>
      ))}
    </ol>
  )
}

// Caption layers crossfade in place; the tallest sets the height so the
// section never jumps as the slider moves.
function CaptionStack({ layers }) {
  return (
    <div className="relative mx-auto max-w-xl text-center">
      {layers.map(({ key, text, strength, accent }, i) => (
        <p
          key={key}
          aria-hidden={strength < 0.5}
          className={`${i === 0 ? '' : 'absolute inset-0'} text-body font-medium transition-opacity duration-150 ${
            accent ? 'text-accent' : ''
          }`}
          style={{ opacity: Math.max(0, strength) }}
        >
          {text}
        </p>
      ))}
    </div>
  )
}

// The slider rests only on three detents — PM, balanced center, engineer.
// Dragging stays continuous so the content interpolates live; release settles
// on the nearest detent, and arrow keys step detent-to-detent.
const DETENTS = [0, 50, 100]

// Piecewise-linear blend across the theme's three approach colors:
// pm at 0 → mid at 50 → eng at 100.
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
function blendSurface({ pm, mid, eng }, t) {
  const [from, to, k] = t <= 0.5 ? [pm, mid, t * 2] : [mid, eng, (t - 0.5) * 2]
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`
}
const nearestDetent = (v) => DETENTS.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a))

export function Approach() {
  const { grammar } = useTheme()
  const [value, setValue] = useState(50)
  const [interacted, setInteracted] = useState(false)
  const sliderWrapRef = useRef(null)
  const demoRaf = useRef(null)
  const interactedRef = useRef(false)

  const markInteracted = () => {
    interactedRef.current = true
    cancelAnimationFrame(demoRaf.current)
    setInteracted(true)
  }

  // Attract demo: on first scroll into view each page load, the thumb
  // oscillates left–right with decaying amplitude (~5 sweeps) and settles on
  // the center detent — "this is interactive" without a modal or tooltip
  // tour. Cancels the moment the visitor grabs the slider, and is skipped
  // under prefers-reduced-motion (the text hint carries the message instead).
  useEffect(() => {
    const el = sliderWrapRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const start = performance.now()
        const DURATION = 3400
        const tick = (now) => {
          const p = (now - start) / DURATION
          if (p >= 1 || interactedRef.current) {
            if (!interactedRef.current) setValue(50)
            return
          }
          const decay = Math.exp(-2.1 * p)
          setValue(Math.round(50 + 50 * Math.sin(p * Math.PI * 5) * decay))
          demoRaf.current = requestAnimationFrame(tick)
        }
        demoRaf.current = requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(demoRaf.current)
    }
  }, [])

  const t = value / 100
  const pm = 1 - t
  const eng = t
  const center = 1 - Math.abs(t - 0.5) * 2

  const points = t <= 0.5 ? approach.pm.points : approach.eng.points
  const pointsStrength = Math.max(pm, eng)

  return (
    <Section surface="approach">
      <Container>
        {/* The living surface: blends between the theme's three approach
            colors as the slider moves, easing like the text does. */}
        <div
          data-approach-panel
          className="rounded-card px-6 py-10 transition-colors duration-150 md:px-10 md:py-14"
          style={{ backgroundColor: blendSurface(grammar.approach, value / 100) }}
        >
        <SectionHeading id="approach" label="Both sides of the table" title={approach.title}>
          {approach.intro}
        </SectionHeading>

        <Reveal>
          {/* The slider */}
          <div ref={sliderWrapRef} className="mx-auto max-w-2xl">
            <p
              aria-hidden="true"
              className={`mb-2 text-center font-mono text-[11px] uppercase tracking-widest text-accent transition-opacity duration-300 ${
                interacted ? 'opacity-0' : ''
              }`}
            >
              ← slide me →
            </p>
            <div className="flex items-center justify-between font-mono text-label uppercase tracking-widest">
              <span
                className="transition-opacity duration-150"
                style={{ opacity: 0.4 + 0.6 * pm }}
              >
                {approach.pm.label}
              </span>
              <span
                className="transition-opacity duration-150"
                style={{ opacity: 0.4 + 0.6 * eng }}
              >
                {approach.eng.label}
              </span>
            </div>
            <div className="relative mt-3">
              {/* The three resting dots; center is the sweet spot. */}
              {DETENTS.map((d) => (
                <span
                  key={d}
                  aria-hidden="true"
                  className={`absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                    d === 50 ? 'bg-muted' : 'bg-hairline'
                  }`}
                  style={{ left: `${d}%` }}
                />
              ))}
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => {
                  markInteracted()
                  setValue(Number(e.target.value))
                }}
                onPointerDown={markInteracted}
                onPointerUp={() => setValue((v) => nearestDetent(v))}
                onKeyDown={(e) => {
                  markInteracted()
                  const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]
                  if (!step) return // Home/End keep their native behavior
                  e.preventDefault()
                  setValue((v) => {
                    const i = DETENTS.indexOf(nearestDetent(v))
                    return DETENTS[Math.min(DETENTS.length - 1, Math.max(0, i + step))]
                  })
                }}
                aria-label="Blend between project-manager and engineer perspective"
                aria-valuetext={valueText(value)}
                className="pm-slider relative w-full"
              />
            </div>
            <p className="mt-4 text-center font-mono text-label uppercase tracking-widest text-muted">
              {approach.credibility}
            </p>
            <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 text-label text-muted">
              {approach.arc.map((stage, i) => (
                <span key={stage} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden="true">→</span> : null}
                  {stage}
                </span>
              ))}
            </p>
          </div>

          {/* Captions crossfade with the blend */}
          <div className="mt-10">
            <CaptionStack
              layers={[
                { key: 'bridge', text: approach.bridge.caption, strength: center, accent: true },
                { key: 'pm', text: approach.pm.caption, strength: pm - center * 0.5 },
                { key: 'eng', text: approach.eng.caption, strength: eng - center * 0.5 },
              ]}
            />
          </div>

          {/* Desktop: three chains side by side, bridge in the middle. */}
          <div className="mt-10 hidden items-start justify-center gap-10 md:flex lg:gap-16">
            <Chain steps={approach.pm.flow} strength={pm} />
            <div className="flex flex-col items-center">
              <p
                className="mb-3 font-mono text-label uppercase tracking-widest transition-opacity duration-150"
                style={{ opacity: 0.35 + 0.65 * center }}
              >
                <span className={center > 0.6 ? 'text-accent' : 'text-muted'}>
                  {approach.bridge.label}
                </span>
              </p>
              <Chain steps={approach.bridge.flow} strength={center} accent />
            </div>
            <Chain steps={approach.eng.flow} strength={eng} />
          </div>

          {/* Mobile: one column; the three chains crossfade in place. */}
          <div className="relative mt-10 md:hidden">
            {/* Fade the bridge almost out when a side dominates, or its wider
                chips peek from behind the overlaid side chain. */}
            <div
              className="flex justify-center transition-opacity duration-150"
              style={{ opacity: Math.max(pm, eng) > 0.7 ? 0.06 : 1 }}
            >
              <Chain steps={approach.bridge.flow} strength={Math.max(center, 0.15)} accent />
            </div>
            <div
              className="absolute inset-0 flex justify-center transition-opacity duration-150"
              style={{ opacity: pm > 0.7 ? 1 : 0, pointerEvents: 'none' }}
              aria-hidden={pm <= 0.7}
            >
              <div className="px-6">
                <Chain steps={approach.pm.flow} strength={1} />
              </div>
            </div>
            <div
              className="absolute inset-0 flex justify-center transition-opacity duration-150"
              style={{ opacity: eng > 0.7 ? 1 : 0, pointerEvents: 'none' }}
              aria-hidden={eng <= 0.7}
            >
              <div className="px-6">
                <Chain steps={approach.eng.flow} strength={1} />
              </div>
            </div>
          </div>

          {/* Dominant side's working points + evidence line */}
          <div
            className="mx-auto mt-10 max-w-xl transition-opacity duration-150"
            style={{ opacity: 0.35 + 0.65 * Math.max(pointsStrength, 0.3) }}
          >
            <ul className="grid gap-2 sm:grid-cols-2">
              {points.map((point) => (
                <li key={point} className="flex gap-2 text-label text-muted">
                  <span aria-hidden="true" className="text-accent">
                    •
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-widest text-muted">
              {t <= 0.5 ? approach.pm.evidence : approach.eng.evidence}
            </p>
          </div>

          {/* Closing message strengthens toward the center and engineer side. */}
          <div
            className="mt-14 text-center transition-[opacity,transform] duration-200"
            style={{
              opacity: 0.4 + 0.6 * Math.max(center, eng),
              transform: `translateY(${(1 - Math.max(center, eng)) * 6}px)`,
            }}
          >
            <p className="font-display whitespace-pre-line text-card-title font-semibold tracking-display">
              {approach.final.lead}
            </p>
            <p className="measure mx-auto mt-3 text-body text-muted">{approach.final.sub}</p>
          </div>
        </Reveal>
        </div>
      </Container>
    </Section>
  )
}
