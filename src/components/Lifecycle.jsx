import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { lifecycle, artifactPreviews } from '../content/lifecycle'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { BackButton } from './ui/BackButton'
import { pushModal, popModal, isTopModal } from './ui/modalStack'

const PHASES = lifecycle.phases
const AUTOPLAY_MS = 2800
const RESUME_AFTER_CLICK_MS = 6000

// Sanitized artifact example — same compact modal grammar as the portfolio
// strips: portaled to <body>, routed through the modal stack.
function ArtifactModal({ name, phase, onClose }) {
  const preview = artifactPreviews[name]
  const panelRef = useRef(null)
  const modalId = useId()
  const titleId = `${modalId}-title`

  useEffect(() => {
    pushModal(modalId)
    const onKey = (e) => {
      if (e.key === 'Escape' && isTopModal(modalId)) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      popModal(modalId)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, modalId])

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="case-overlay-backdrop fixed inset-0 bg-ink/40"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="case-overlay-panel relative my-auto w-full max-w-[30rem] rounded-card border border-hairline bg-canvas p-6 shadow-2xl shadow-ink/20 outline-none md:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <BackButton onClick={onClose} className="relative -ml-1 p-1 text-muted hover:text-ink" />
          <p className="font-mono text-label uppercase tracking-widest text-muted">
            Delivery artifact · {phase}
          </p>
        </div>
        <h3 id={titleId} className="font-display mt-4 text-card-title font-semibold tracking-display">
          {name}
        </h3>
        <dl className="mt-3">
          {preview.sections.map(({ label, lines }, i) => (
            <div key={label} className={`py-3.5 ${i > 0 ? 'border-t border-hairline' : ''}`}>
              <dt className="font-mono text-label uppercase tracking-widest text-muted">{label}</dt>
              <dd className="mt-1.5 space-y-1">
                {lines.map((line) => (
                  <p key={line} className="text-body text-ink">
                    {line}
                  </p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 border-t border-hairline pt-3 font-mono text-[10px] uppercase tracking-widest text-muted">
          Sanitized example — structure, not client data
        </p>
      </div>
    </div>,
    document.body
  )
}

export function Lifecycle() {
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [engaged, setEngaged] = useState(false) // pointer or keyboard focus inside
  const [clickPaused, setClickPaused] = useState(false)
  const [openArtifact, setOpenArtifact] = useState(null)
  const [progressPx, setProgressPx] = useState(0)
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const dotRefs = useRef([])
  const resumeTimer = useRef(null)

  // Autoplay runs only while the section is on screen and the visitor is not
  // engaging with it. No wheel/scroll listeners anywhere — page scrolling is
  // untouched; the lifecycle advances on its own clock.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || engaged || clickPaused || openArtifact) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const t = setInterval(() => setActive((a) => (a + 1) % PHASES.length), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [inView, engaged, clickPaused, openArtifact])

  useEffect(() => () => clearTimeout(resumeTimer.current), [])

  // The progress line ends at the ACTIVE dot's real position — the labels
  // have different widths, so even fractions would drift off the dots.
  useEffect(() => {
    const measure = () => {
      const dot = dotRefs.current[active]
      const track = trackRef.current
      if (!dot || !track) return
      const d = dot.getBoundingClientRect()
      const t = track.getBoundingClientRect()
      setProgressPx(d.left - t.left + d.width / 2)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  const selectPhase = (i) => {
    setActive(i)
    setClickPaused(true)
    clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => setClickPaused(false), RESUME_AFTER_CLICK_MS)
  }

  const phase = PHASES[active]
  const isLast = active === PHASES.length - 1

  return (
    <Section surface="lifecycle">
      <Container>
        <SectionHeading id="lifecycle" label="Delivery system" title={lifecycle.title}>
          {lifecycle.intro}
        </SectionHeading>

        <Reveal>
          <div
            ref={rootRef}
            onMouseEnter={() => setEngaged(true)}
            onMouseLeave={() => setEngaged(false)}
            onFocus={() => setEngaged(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setEngaged(false)
            }}
          >
            {/* Stationary pipeline: every phase stays visible; only the
                active state travels. Desktop is one connected row. */}
            <ol
              ref={trackRef}
              className="relative hidden items-start justify-between lg:flex"
              aria-label="Delivery lifecycle"
            >
              {/* Track + progress, aligned to the dot row. */}
              <div aria-hidden="true" className="absolute left-0 right-0 top-[3px] h-px bg-hairline" />
              <div
                aria-hidden="true"
                className="absolute left-0 top-[3px] h-px bg-ink transition-[width] duration-500 ease-out"
                style={{ width: progressPx }}
              />
              {PHASES.map(({ id, name }, i) => {
                const isActive = i === active
                const isDone = i < active
                return (
                  <li key={id} className="relative flex justify-center first:justify-start last:justify-end">
                    <button
                      type="button"
                      aria-current={isActive ? 'step' : undefined}
                      onClick={() => selectPhase(i)}
                      className="group/phase flex flex-col items-center gap-2.5 first:items-start last:items-end"
                    >
                      <span
                        ref={(el) => (dotRefs.current[i] = el)}
                        aria-hidden="true"
                        className={`h-[7px] w-[7px] rounded-full transition-[transform,background-color] duration-[400ms] ${
                          isActive
                            ? 'scale-125 bg-ink'
                            : isDone
                              ? 'bg-ink'
                              : 'bg-hairline group-hover/phase:bg-muted'
                        }`}
                      />
                      <span
                        className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-widest transition-[color,opacity] duration-[400ms] ${
                          isActive
                            ? 'text-ink'
                            : isDone
                              ? 'text-muted'
                              : 'text-muted opacity-50 group-hover/phase:opacity-90'
                        }`}
                      >
                        {name}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            {/* Below lg the row would crush 11 labels: wrap them as chips
                instead. The page itself still scrolls normally. */}
            <ol className="flex flex-wrap justify-center gap-x-3 gap-y-2 lg:hidden" aria-label="Delivery lifecycle">
              {PHASES.map(({ id, name }, i) => {
                const isActive = i === active
                return (
                  <li key={id}>
                    <button
                      type="button"
                      aria-current={isActive ? 'step' : undefined}
                      onClick={() => selectPhase(i)}
                      className={`rounded-button border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors duration-300 ${
                        isActive
                          ? 'border-ink bg-ink text-canvas'
                          : 'border-hairline text-muted hover:text-ink'
                      }`}
                    >
                      {name}
                    </button>
                  </li>
                )
              })}
            </ol>

            {/* Active phase. Keyed on the phase so the whole block re-enters
                with the same fade-up the artifacts use; the outer wrapper
                reserves height so shorter phases don't make the page jump. */}
            <div className="mt-12 min-h-[17rem] sm:min-h-[13.5rem]">
            <div key={phase.id} className="text-center">
              <p className="lifecycle-enter font-mono text-label uppercase tracking-widest text-muted">
                <span className="text-accent">{String(active + 1).padStart(2, '0')}</span> ·{' '}
                {phase.name}
              </p>
              <p className="lifecycle-enter measure mx-auto mt-3 text-body font-medium" style={{ animationDelay: '60ms' }}>
                {phase.desc}
              </p>

              <p
                className="lifecycle-enter mt-8 font-mono text-[10px] uppercase tracking-widest text-muted"
                style={{ animationDelay: '120ms' }}
              >
                Delivery artifacts
              </p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2.5">
                {phase.artifacts.map((name, i) => {
                  const hasPreview = Boolean(artifactPreviews[name])
                  // Fixed rounded-lg (not the theme's pill button radius):
                  // these should read as documents, not buttons.
                  const cardClass =
                    'lifecycle-enter rounded-lg border border-hairline bg-card px-4 py-2.5 font-mono text-label text-muted transition-[transform,border-color,color] duration-200'
                  return (
                    <li key={name} className="contents">
                      {hasPreview ? (
                        <button
                          type="button"
                          onClick={() => setOpenArtifact(name)}
                          style={{ animationDelay: `${160 + i * 70}ms` }}
                          className={`${cardClass} hover:-translate-y-0.5 hover:border-muted hover:text-ink focus-visible:-translate-y-0.5 focus-visible:text-ink`}
                        >
                          {name}
                          <span aria-hidden="true" className="ml-1.5 text-muted">
                            ↗
                          </span>
                        </button>
                      ) : (
                        <span style={{ animationDelay: `${160 + i * 70}ms` }} className={cardClass}>
                          {name}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
            </div>

            {/* The loop: improvement is not an ending. */}
            <p
              className={`mt-12 text-center font-mono text-label uppercase tracking-widest transition-[color,opacity] duration-500 ${
                isLast ? 'text-accent opacity-100' : 'text-muted opacity-60'
              }`}
            >
              <span aria-hidden="true">↺</span> {lifecycle.loop}
            </p>
          </div>
        </Reveal>
      </Container>

      {openArtifact ? (
        <ArtifactModal name={openArtifact} phase={phase.name} onClose={() => setOpenArtifact(null)} />
      ) : null}
    </Section>
  )
}
