import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { site } from '../content/site'
import { strips } from '../content/strips'
import { slug } from '../lib/slug'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { BackButton } from './ui/BackButton'
import { pushModal, popModal, isTopModal } from './ui/modalStack'

// Flattened list of every entry that has a strip, in page order — the modal's
// prev/next walks this sequence with wrap-around. Entries without a strip
// (payroll, on hold) stay plain rows.
const STRIP_ENTRIES = site.portfolio.groups.flatMap(({ group, items }) =>
  items
    .filter((item) => strips[slug(item.title)])
    .map((item) => ({ ...item, group, strip: strips[slug(item.title)] }))
)

const STRIP_ROWS = [
  { label: 'Problem', key: 'problem' },
  { label: 'PM Action', key: 'actions' },
  { label: 'System', key: 'system' },
  { label: 'Outcome', key: 'outcome' },
]

// Compact centered modal — the executive-friendly delivery path of one
// project. Portaled to <body> so the panel escapes the section's sky surface
// scope; Escape routes through the modal stack.
function StripModal({ index, onClose, onNavigate }) {
  const entry = STRIP_ENTRIES[index]
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
  }, [index])

  const NAV_BTN =
    'rounded-button border border-hairline px-3 py-1.5 font-mono text-label font-medium uppercase tracking-widest text-muted transition-colors hover:bg-card hover:text-ink'

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
        className="case-overlay-panel relative my-auto w-full max-w-[34rem] rounded-card border border-hairline bg-canvas p-6 shadow-2xl shadow-ink/20 outline-none md:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <BackButton onClick={onClose} className="relative -ml-1 p-1 text-muted hover:text-ink" />
          <p className="font-mono text-label uppercase tracking-widest text-muted">
            {entry.group} · {entry.role}
          </p>
        </div>

        <h3 id={titleId} className="font-display mt-4 text-card-title font-semibold tracking-display">
          {entry.title}
        </h3>

        <dl className="mt-5">
          {STRIP_ROWS.map(({ label, key }, i) => (
            <div
              key={key}
              className={`grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 ${
                i > 0 ? 'border-t border-hairline' : ''
              }`}
            >
              <dt
                className={`font-mono text-label uppercase tracking-widest ${
                  key === 'outcome' ? 'text-accent' : 'text-muted'
                }`}
              >
                {label}
              </dt>
              {key === 'actions' ? (
                <dd className="flex flex-wrap gap-1.5">
                  {entry.strip.actions.map((action) => (
                    <span
                      key={action}
                      className="rounded-button border border-hairline bg-card px-2.5 py-1 font-mono text-label text-muted"
                    >
                      {action}
                    </span>
                  ))}
                </dd>
              ) : (
                <dd className={`text-body ${key === 'outcome' ? 'font-medium' : 'text-muted'}`}>
                  {entry.strip[key]}
                </dd>
              )}
            </div>
          ))}
        </dl>

        <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
          <button type="button" aria-label="Previous project" onClick={() => onNavigate(-1)} className={NAV_BTN}>
            ← Prev
          </button>
          <p className="font-mono text-label uppercase tracking-widest text-muted">
            {index + 1} / {STRIP_ENTRIES.length}
          </p>
          <button type="button" aria-label="Next project" onClick={() => onNavigate(1)} className={NAV_BTN}>
            Next →
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export function Portfolio() {
  // Categories collapse to a nine-line table of contents; a reader expands
  // only the domains they care about.
  const [open, setOpen] = useState(() => new Set())
  const [stripIndex, setStripIndex] = useState(null)

  // Deep links into a collapsed group must still land: if the page loads with
  // a hash pointing at an entry, open the group that contains it.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (!hash) return
    const target = site.portfolio.groups.find((g) =>
      g.items.some((item) => slug(item.title) === hash)
    )
    if (target) setOpen((prev) => new Set(prev).add(target.group))
  }, [])

  const toggle = (group) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })

  const stripIndexOf = (title) => STRIP_ENTRIES.findIndex((e) => e.title === title)

  return (
    <Section surface="portfolio">
      <Container>
        <SectionHeading id="portfolio" label="Full portfolio" title="Projects Delivered.">
          {site.portfolio.intro}
        </SectionHeading>

        {/* White sheet on the colored block, mirroring the Approach envelope. */}
        <div className="rounded-card bg-card px-5 pb-1 pt-1 md:px-8">
          {site.portfolio.groups.map(({ group, items }, i) => {
            const expanded = open.has(group)
            const panelId = `portfolio-group-${slug(group)}`
            return (
              <Reveal key={group} delay={Math.min(i, 3) * 60}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(group)}
                  className={`flex w-full items-center justify-between gap-4 py-5 text-left ${
                    i > 0 ? 'border-t border-hairline' : ''
                  }`}
                >
                  <span className="text-label uppercase tracking-widest text-accent">
                    {group}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-label uppercase tracking-widest text-muted">
                    {items.length} projects
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>
                {expanded ? (
                  <div id={panelId} className="grid gap-x-10 gap-y-6 pb-8 pt-1 md:grid-cols-2">
                    {items.map(({ title, role, desc }) => {
                      const idx = stripIndexOf(title)
                      return (
                        // The slug id makes each entry individually linkable.
                        <article key={title} id={slug(title)} className="scroll-mt-24">
                          <div className="flex items-baseline justify-between gap-4">
                            {idx >= 0 ? (
                              <h3 className="text-body font-medium">
                                <button
                                  type="button"
                                  onClick={() => setStripIndex(idx)}
                                  className="group/strip inline-flex items-center gap-1 text-left transition-colors hover:text-accent focus-visible:text-accent"
                                >
                                  {title}
                                  <ChevronRight
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5 shrink-0 text-muted transition-colors group-hover/strip:text-accent"
                                  />
                                </button>
                              </h3>
                            ) : (
                              <h3 className="text-body font-medium">{title}</h3>
                            )}
                            <span className="shrink-0 text-label uppercase tracking-widest text-muted">
                              {role}
                            </span>
                          </div>
                          <p className="mt-1 text-label text-muted">{desc}</p>
                        </article>
                      )
                    })}
                  </div>
                ) : null}
              </Reveal>
            )
          })}
        </div>
      </Container>

      {stripIndex !== null ? (
        <StripModal
          index={stripIndex}
          onClose={() => setStripIndex(null)}
          onNavigate={(dir) =>
            setStripIndex((v) => (v + dir + STRIP_ENTRIES.length) % STRIP_ENTRIES.length)
          }
        />
      ) : null}
    </Section>
  )
}
