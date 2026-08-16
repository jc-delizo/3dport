import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { site } from '../content/site'
import processDiagram from '../content/diagrams/process.svg?raw'
import intakeDiagram from '../content/diagrams/intake.svg?raw'
import erpDiagram from '../content/diagrams/erp.svg?raw'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { DiagramFrame } from './ui/DiagramFrame'
import { ReaderOverlay } from './ui/ReaderOverlay'
import { PlaybookOverlay } from './PlaybookOverlay'

// Initiative-level diagrams (same sanitized draw.io pipeline as the case
// studies). More arrive as JC draws them — one line each here.
const INITIATIVE_DIAGRAMS = {
  'scaling-delivery': processDiagram,
  'erp-rollout': erpDiagram,
  'ai-intake': intakeDiagram,
}

function Block({ label, children }) {
  return (
    <div className="mt-8">
      <p className="text-label uppercase tracking-widest text-muted">{label}</p>
      <div className="measure mt-2 text-body">{children}</div>
    </div>
  )
}

// Full-screen reader, same interaction model as the case studies: themed
// backdrop, page-width panel, back arrow, wrap-around prev/next.
function InitiativeOverlay({ initiative, onClose, onNavigate }) {
  const { id, category, title, problem, approach, outcome } = initiative
  const [playbookOpen, setPlaybookOpen] = useState(false)

  return (
    <ReaderOverlay
      surfaceKey="initiatives"
      ariaLabelledBy={`${id}-overlay-title`}
      onClose={onClose}
      onNavigate={onNavigate}
      navNoun="initiative"
      resetKey={id}
    >
      <p className="text-label uppercase tracking-widest text-accent">{category}</p>
      <h2
        id={`${id}-overlay-title`}
        className="font-display mt-2 text-section font-semibold tracking-display"
      >
        {title}
      </h2>

      <Block label="Problem">{problem}</Block>

      {INITIATIVE_DIAGRAMS[id] ? (
        <div className="mt-8">
          <p className="text-label uppercase tracking-widest text-muted">Process diagram</p>
          <DiagramFrame
            svg={INITIATIVE_DIAGRAMS[id]}
            ariaLabel={`${title} — process diagram`}
            className="mt-2"
            expandable
          />
        </div>
      ) : null}

      <Block label="Approach">
        <ul className="list-disc space-y-2 pl-5 text-muted">
          {approach.map((point, index) => (
            <li key={`${id}-${index}`}>{point}</li>
          ))}
        </ul>
      </Block>

      <Block label="Outcome">{outcome}</Block>

      {id === 'scaling-delivery' ? (
        <button
          type="button"
          data-btn=""
          onClick={() => setPlaybookOpen(true)}
          className="mt-8 inline-flex items-center gap-1.5 rounded-button border border-hairline px-4 py-2 font-mono text-label font-medium uppercase tracking-widest text-muted transition-colors hover:bg-card hover:text-ink"
        >
          Read the Delivery Playbook →
        </button>
      ) : null}
      {playbookOpen ? <PlaybookOverlay onClose={() => setPlaybookOpen(false)} /> : null}
    </ReaderOverlay>
  )
}

function InitiativeCard({ initiative, index, onOpen }) {
  const { id, category, title, problem } = initiative
  return (
    <Card as="article">
      <p className="text-label uppercase tracking-widest text-accent">{category}</p>
      <h3 className="font-display mt-2 text-card-title font-semibold tracking-display">{title}</h3>
      <p className="measure mt-4 text-body text-muted">{problem}</p>

      <button
        type="button"
        data-btn=""
        onClick={onOpen}
        className="mt-6 inline-flex items-center gap-1.5 rounded-button border border-hairline px-4 py-2 font-mono text-label font-medium uppercase tracking-widest text-muted transition-colors hover:bg-card hover:text-ink"
      >
        {INITIATIVE_DIAGRAMS[id] ? 'View diagram & story' : 'View full story'}
        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </Card>
  )
}

export function Initiatives() {
  const [openId, setOpenId] = useState(null)
  const openInitiative = site.initiatives.find((i) => i.id === openId)

  // Returning focus to the trigger keeps keyboard users anchored after close.
  const close = () => {
    const trigger = document.getElementById(`${openId}-trigger`)
    setOpenId(null)
    requestAnimationFrame(() => trigger?.querySelector('button')?.focus())
  }

  // Prev/next wrap around, so both controls always lead somewhere.
  const navigate = (delta) => {
    const n = site.initiatives.length
    const idx = site.initiatives.findIndex((i) => i.id === openId)
    setOpenId(site.initiatives[(idx + delta + n) % n].id)
  }

  return (
    <Section surface="initiatives">
      <Container>
        <SectionHeading id="initiatives" label="Selected work" title="Initiatives." />

        <div className="grid gap-4">
          {site.initiatives.map((initiative, i) => (
            <Reveal
              key={initiative.id}
              delay={Math.min(i, 3) * 60}
              id={`${initiative.id}-trigger`}
              className="min-w-0"
            >
              <InitiativeCard
                initiative={initiative}
                index={i}
                onOpen={() => setOpenId(initiative.id)}
              />
            </Reveal>
          ))}
        </div>
      </Container>

      {openInitiative ? (
        <InitiativeOverlay initiative={openInitiative} onClose={close} onNavigate={navigate} />
      ) : null}
    </Section>
  )
}
