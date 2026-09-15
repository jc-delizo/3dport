import { useId, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { scenarios } from '../content/scenarios'
import { PlaybookOverlay } from './PlaybookOverlay'
import { Reveal } from './ui/Reveal'

// "How I'd run your project" — the interactive half of the Principles
// section. Proper tabs (roving tabindex, arrow keys) because scenario
// switching IS the feature; the panel re-keys on selection so its fade-in
// replays. Full-detail depth stays in the PlaybookOverlay, reused here.
export function ScenarioPlaybook() {
  const [activeId, setActiveId] = useState(scenarios.items[0].id)
  const [playbookOpen, setPlaybookOpen] = useState(false)
  const tabRefs = useRef([])
  const baseId = useId()
  const active = scenarios.items.find((s) => s.id === activeId)

  const onKeyDown = (e, index) => {
    const last = scenarios.items.length - 1
    let next = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = index === last ? 0 : index + 1
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = index === 0 ? last : index - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    setActiveId(scenarios.items[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <Reveal delay={120} className="mt-14 border-t border-hairline pt-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
        {scenarios.kicker}
      </p>
      <h3 className="font-display mt-2 text-card-title font-semibold tracking-display">
        {scenarios.title}
      </h3>
      <p className="measure mt-3 text-label leading-6 text-muted">{scenarios.intro}</p>

      <div role="tablist" aria-label="Project scenarios" className="mt-6 flex flex-wrap gap-2">
        {scenarios.items.map(({ id, label }, i) => {
          const selected = id === activeId
          return (
            <button
              key={id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              data-btn=""
              onClick={() => setActiveId(id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`min-h-11 rounded-button border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                selected
                  ? 'border-accent bg-accent text-accent-contrast'
                  : 'border-hairline text-muted hover:border-accent hover:text-ink'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div
        key={active.id}
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        className="scenario-panel mt-6"
      >
        <p className="text-body font-medium">{active.hook}</p>

        <div className="mt-5 grid gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              The opening plays
            </p>
            <ol className="mt-3 space-y-4">
              {active.plays.map(({ title, body }, i) => (
                <li key={title} className="flex gap-4">
                  <span className="font-mono text-[10px] leading-6 text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-label font-medium">{title}</p>
                    <p className="measure mt-1 text-label leading-5 text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Risks flagged before work starts
            </p>
            <ul className="mt-3 space-y-4">
              {active.risks.map(({ title, body }) => (
                <li key={title} className="border-l-2 border-accent/50 pl-4">
                  <p className="text-label font-medium">{title}</p>
                  <p className="mt-1 text-label leading-5 text-muted">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-hairline pt-5">
          <a
            href={active.evidence.href}
            className="group inline-flex items-center gap-1.5 text-label font-medium text-accent"
          >
            {active.evidence.label}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <span className="font-mono text-[10px] text-muted">{active.evidence.note}</span>
          <button
            type="button"
            data-btn=""
            onClick={() => setPlaybookOpen(true)}
            className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-button border border-hairline px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-ink"
          >
            Read the full playbook
          </button>
        </div>
      </div>

      {playbookOpen ? <PlaybookOverlay onClose={() => setPlaybookOpen(false)} /> : null}
    </Reveal>
  )
}
