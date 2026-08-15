import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { site } from '../content/site'
import approvalDiagram from '../content/diagrams/approval.svg?raw'
import aiDiagram from '../content/diagrams/ai.svg?raw'
import { useTheme } from '../theme/ThemeContext'
import { DiagramFrame } from './ui/DiagramFrame'
import { ReaderOverlay } from './ui/ReaderOverlay'

// JC's own draw.io exports, inlined verbatim (sanitized by the converter that
// lives outside this repo). They ship their own flow animation.
const DIAGRAM_SVGS = {
  'approval-platform-case': approvalDiagram,
  'ai-delivery-platform-case': aiDiagram,
}
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

function StatTiles({ stats }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ value, label }) => (
        <div key={label} className="rounded-lg border border-hairline bg-canvas p-4">
          <p className="text-section font-semibold tracking-display text-accent">{value}</p>
          <p className="mt-1 text-label uppercase tracking-widest text-muted">{label}</p>
        </div>
      ))}
    </div>
  )
}

function Timeline({ entries }) {
  return (
    <ol className="mt-4 border-l border-hairline">
      {entries.map(({ date, title, detail }) => (
        <li key={`${date}-${title}`} className="relative pb-8 pl-6 last:pb-0">
          {/* Marker: 8px accent dot with a 2px surface ring so it reads over the line. */}
          <span
            aria-hidden="true"
            className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent"
          />
          <p className="font-mono text-label uppercase tracking-widest text-muted">{date}</p>
          <p className="mt-1 text-body font-medium">{title}</p>
          <p className="measure mt-1 text-label text-muted">{detail}</p>
        </li>
      ))}
    </ol>
  )
}

// Single-series column chart, hand-rolled. Colors come from the active theme's
// grammar (validated per theme with the palette validator) because SVG
// presentation attributes can't read CSS var(). Single series → no legend; the
// peak is the only direct label; the visually-hidden table carries every value.
function CommitsChart({ chart }) {
  const [hover, setHover] = useState(null)
  const { grammar } = useTheme()
  const c = grammar.chart

  const W = 560
  const H = 240
  const PAD = { top: 26, right: 8, bottom: 26, left: 40 }
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const yMax = 400
  const ticks = [0, 100, 200, 300, 400]
  const band = plotW / chart.points.length
  // 14 viewBox units ≈ 24 rendered px at the container's desktop width — the
  // mark-thickness cap applies to what the reader sees, not the SVG coordinates.
  const barW = Math.min(14, band - 8)
  const peak = chart.points.reduce((a, b) => (b.value > a.value ? b : a))

  const barPath = (x, h) => {
    // 4px rounded data-end, square at the baseline; radius shrinks on tiny bars.
    const r = Math.min(4, h)
    const y0 = PAD.top + plotH
    return `M${x},${y0} v${-(h - r)} q0,${-r} ${r},${-r} h${barW - 2 * r} q${r},0 ${r},${r} v${h - r} z`
  }

  return (
    <figure className="mt-8">
      <figcaption>
        <p className="text-body font-medium">{chart.title}</p>
        <p className="measure mt-1 text-label text-muted">{chart.note}</p>
      </figcaption>

      <div className="relative mt-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
          {ticks.map((t) => {
            const y = PAD.top + plotH - (t / yMax) * plotH
            return (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke={c.grid} strokeWidth="1" />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="12" fill={c.textMuted}>
                  {t}
                </text>
              </g>
            )
          })}

          {chart.points.map(({ label, value }, i) => {
            const h = Math.max((value / yMax) * plotH, 1)
            const x = PAD.left + i * band + (band - barW) / 2
            return (
              <g key={label}>
                <path d={barPath(x, h)} fill={c.accent} opacity={hover === null || hover === i ? 1 : 0.45} />
                {label === peak.label ? (
                  <text
                    x={x + barW / 2}
                    y={PAD.top + plotH - h - 8}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="600"
                    fill={c.textStrong}
                  >
                    {peak.value}
                  </text>
                ) : null}
                <text
                  x={PAD.left + i * band + band / 2}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fill={c.textMuted}
                >
                  {label}
                </text>
                {/* Hover/focus hit target: the whole band, far bigger than the mark. */}
                <rect
                  x={PAD.left + i * band}
                  y={PAD.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  tabIndex={-1}
                />
              </g>
            )
          })}
        </svg>

        {hover !== null ? (
          <div
            className="pointer-events-none absolute -top-1 rounded-md bg-ink px-2.5 py-1 text-label text-canvas"
            style={{
              left: `${((PAD.left + hover * band + band / 2) / W) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {chart.points[hover].label} · {chart.points[hover].value} {chart.unit}
          </div>
        ) : null}
      </div>

      {/* The accessible data view: every value, not just the labeled peak. */}
      <table className="sr-only">
        <caption>{chart.title}</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Commits</th>
          </tr>
        </thead>
        <tbody>
          {chart.points.map(({ label, value }) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

function StudyDetail({ study }) {
  return (
    <>
      {/* The diagram leads: the card button promises one, so it is the first
          thing the reader sees after opening. */}
      {DIAGRAM_SVGS[study.id] ? (
        <div className="mt-10">
          <p className="text-label uppercase tracking-widest text-muted">System diagram</p>
          <DiagramFrame
            svg={DIAGRAM_SVGS[study.id]}
            ariaLabel={`${study.title} — system diagram`}
            className="mt-4"
            expandable
          />
        </div>
      ) : null}

      <div className="mt-10">
        <p className="text-label uppercase tracking-widest text-muted">Timeline</p>
        <Timeline entries={study.timeline} />
      </div>

      <div className="mt-10">
        <p className="text-label uppercase tracking-widest text-muted">How it was run</p>
        {study.story.map((paragraph) => (
          <p key={paragraph} className="measure mt-4 text-body text-muted">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-10">
        <p className="text-label uppercase tracking-widest text-muted">Where it nearly derailed</p>
        <ul className="mt-4 space-y-4">
          {study.moments.map(({ title, body }) => (
            <li key={title}>
              <p className="text-body font-medium">{title}</p>
              <p className="measure mt-1 text-label text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>

      {study.chart ? <CommitsChart chart={study.chart} /> : null}

      <p className="mt-10 text-label text-muted">{study.sources}</p>
    </>
  )
}

// Full-screen reader that behaves like its own page: the backdrop floods the
// viewport with the case-studies surface for the active theme (lilac in
// Studio, navy in Paper, dark tile in Cupertino — via data-surface scoping),
// and the content panel rises into it. Escape / ✕ / backdrop click close it.
function StudyOverlay({ study, onClose, onNavigate }) {
  return (
    <ReaderOverlay
      surfaceKey="case-studies"
      ariaLabelledBy={`${study.id}-overlay-title`}
      onClose={onClose}
      onNavigate={onNavigate}
      navNoun="case study"
      resetKey={study.id}
    >
      <p className="text-label uppercase tracking-widest text-accent">Case study</p>
      <h2
        id={`${study.id}-overlay-title`}
        className="font-display mt-2 text-section font-semibold tracking-display"
      >
        {study.title}
      </h2>

      <p className="measure mt-4 text-body text-muted">{study.summary}</p>
      <StatTiles stats={study.stats} />
      <StudyDetail study={study} />
    </ReaderOverlay>
  )
}

function StudyCard({ study, index, onOpen }) {
  return (
    <Card as="article">
      <p className="text-label uppercase tracking-widest text-accent">
        Case study {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="font-display mt-2 text-card-title font-semibold tracking-display">{study.title}</h3>
      <p className="measure mt-4 text-body text-muted">{study.summary}</p>

      <StatTiles stats={study.stats} />

      <button
        type="button"
        data-btn=""
        onClick={onOpen}
        className="mt-8 inline-flex items-center gap-1.5 rounded-button border border-hairline px-4 py-2 font-mono text-label font-medium uppercase tracking-widest text-muted transition-colors hover:bg-card hover:text-ink"
      >
        View diagram &amp; full story
        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </Card>
  )
}

export function CaseStudies() {
  const [openId, setOpenId] = useState(null)
  const openStudy = site.caseStudies.find((s) => s.id === openId)

  // Returning focus to the trigger keeps keyboard users anchored after close.
  const close = () => {
    const trigger = document.getElementById(`${openId}-trigger`)
    setOpenId(null)
    requestAnimationFrame(() => trigger?.querySelector('button')?.focus())
  }

  // Prev/next wrap around, so both controls always lead somewhere.
  const navigate = (delta) => {
    const n = site.caseStudies.length
    const idx = site.caseStudies.findIndex((s) => s.id === openId)
    setOpenId(site.caseStudies[(idx + delta + n) % n].id)
  }

  return (
    <Section surface="case-studies">
      <Container>
        <SectionHeading id="case-studies" label="Deep dives" title="Case Studies.">
          Two builds unpacked — the timeline, how delivery was actually run, and the moments that
          nearly derailed them. Every figure comes from delivery records or production data.
        </SectionHeading>

        <div className="grid gap-4">
          {site.caseStudies.map((study, i) => (
            <Reveal key={study.id} delay={Math.min(i, 3) * 60} id={`${study.id}-trigger`}>
              <StudyCard study={study} index={i} onOpen={() => setOpenId(study.id)} />
            </Reveal>
          ))}
        </div>
      </Container>

      {openStudy ? <StudyOverlay study={openStudy} onClose={close} onNavigate={navigate} /> : null}
    </Section>
  )
}
