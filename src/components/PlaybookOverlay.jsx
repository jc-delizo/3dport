import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { playbook } from '../content/playbook'
import processDiagram from '../content/diagrams/process.svg?raw'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { BackButton } from './ui/BackButton'
import { DiagramFrame } from './ui/DiagramFrame'
import { pushModal, popModal, isTopModal } from './ui/modalStack'

function SectionHead({ heading, sub, intro }) {
  return (
    <div className="mt-16">
      <p className="font-mono text-label uppercase tracking-widest text-muted">{heading}</p>
      <h3 className="font-display mt-2 text-section font-semibold tracking-display">{sub}</h3>
      {intro ? <p className="measure mt-3 text-body text-muted">{intro}</p> : null}
    </div>
  )
}

// The Delivery Playbook as a full-screen themed modal: it renders from the
// site's tokens, so it follows whichever theme the visitor chose. The title
// bar is position:sticky inside the scrolling root — it pins while reading
// and returns to its slot when scrolled back to the top.
export function PlaybookOverlay({ onClose }) {
  const rootRef = useRef(null)
  const modalId = useId()

  useEffect(() => {
    rootRef.current?.focus()
    pushModal(modalId)
    const onKey = (e) => {
      // The modal stack routes Escape: only the top layer closes.
      if (e.key === 'Escape' && isTopModal(modalId)) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      popModal(modalId)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose, modalId])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Delivery Playbook"
      ref={rootRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 overflow-y-auto bg-canvas outline-none"
    >
      <header className="sticky top-0 z-10 border-b border-hairline bg-canvas/90 backdrop-blur">
        <Container className="flex h-14 items-center gap-4">
          <BackButton
            onClick={onClose}
            className="relative rounded-button border border-hairline p-2 text-muted hover:bg-card hover:text-ink"
          />
          <p className="text-body font-semibold tracking-display">The Delivery Playbook</p>
        </Container>
      </header>

      <Container className="pb-20 pt-12">
        {/* Hero */}
        <p className="font-mono text-label uppercase tracking-widest text-accent">
          {playbook.kicker}
        </p>
        <h2 className="font-display mt-3 text-hero font-semibold tracking-display">
          {playbook.title}
        </h2>
        <p className="measure mt-4 text-body md:text-card-title">{playbook.tagline}</p>
        <p className="measure mt-4 text-label text-muted">{playbook.provenance}</p>

        {/* Lifecycle + the process-flow diagram, which is part of it */}
        <SectionHead {...playbook.lifecycle} />
        <DiagramFrame
          svg={processDiagram}
          ariaLabel="Project management process flow — process diagram"
          className="mt-6"
          expandable
        />
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {playbook.stages.map(({ n, title, body, artifacts }) => (
            <li key={n}>
              <Card className="h-full">
                <p className="font-mono text-label uppercase tracking-widest text-accent">
                  Stage {n}
                </p>
                <p className="mt-2 text-body font-medium">{title}</p>
                <p className="mt-2 text-label text-muted">{body}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {artifacts.map((a) => (
                    <li
                      key={a}
                      className="rounded-button border border-hairline bg-canvas px-3 py-1 text-label text-muted"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ol>

        {/* The per-project instrument */}
        <SectionHead {...playbook.instrument} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playbook.instrument.groups.map(({ name, items }) => (
            <Card key={name} className="h-full">
              <p className="font-mono text-label uppercase tracking-widest text-muted">{name}</p>
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={item} className="text-label text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <p className="measure mt-6 text-body font-medium">{playbook.instrument.pull}</p>

        {/* Portfolio layer */}
        <SectionHead {...playbook.portfolioLayer} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {playbook.ceremonies.map(({ cadence, title, body, evidence }) => (
            <Card key={title} className="h-full">
              <p className="font-mono text-label uppercase tracking-widest text-accent">{cadence}</p>
              <p className="mt-2 text-body font-medium">{title}</p>
              <p className="mt-2 text-label text-muted">{body}</p>
              <p className="mt-3 text-label">
                <span className="font-mono uppercase tracking-widest text-muted">Evidence: </span>
                {evidence}
              </p>
            </Card>
          ))}
        </div>

        {/* Governance */}
        <SectionHead {...playbook.governance} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {playbook.governance.steps.map(({ n, title, body }) => (
            <Card key={n} className="h-full">
              <p className="font-mono text-label uppercase tracking-widest text-accent">{n}</p>
              <p className="mt-2 text-body font-medium">{title}</p>
              <p className="mt-2 text-label text-muted">{body}</p>
            </Card>
          ))}
        </div>
        <p className="measure mt-6 text-body font-medium">{playbook.governance.closing}</p>

        {/* Delivery models */}
        <SectionHead {...playbook.modelsIntro} />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {playbook.models.map(({ title, body }) => (
            <Card key={title} className="h-full">
              <p className="text-body font-medium">{title}</p>
              <p className="mt-2 text-label text-muted">{body}</p>
            </Card>
          ))}
        </div>
        <p className="measure mt-6 text-label text-muted">{playbook.modelsClosing}</p>

        {/* Automation layer */}
        <SectionHead {...playbook.automation} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {playbook.automation.items.map(({ tag, title, body }) => (
            <Card key={title} className="h-full">
              <p className="font-mono text-label uppercase tracking-widest text-accent">{tag}</p>
              <p className="mt-2 text-body font-medium">{title}</p>
              <p className="mt-2 text-label text-muted">{body}</p>
            </Card>
          ))}
        </div>
        <p className="measure mt-6 text-body font-medium">{playbook.automation.closing}</p>

        {/* Results */}
        <SectionHead {...playbook.results} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {playbook.results.stats.map(({ value, label }) => (
            <Card key={label} className="h-full">
              <p className="font-display text-section font-semibold tracking-display text-accent">
                {value}
              </p>
              <p className="mt-1 text-label uppercase tracking-widest text-muted">{label}</p>
            </Card>
          ))}
        </div>
        <p className="measure mt-6 text-body text-muted">{playbook.results.closing}</p>

        <p className="mt-16 border-t border-hairline pt-6 text-label text-muted">{playbook.footer}</p>
      </Container>
    </div>,
    document.body
  )
}
