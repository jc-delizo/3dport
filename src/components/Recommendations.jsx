import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Recommendations() {
  const scrollerRef = useRef(null)
  const [active, setActive] = useState(0)

  const move = (direction) => {
    const scroller = scrollerRef.current
    const first = scroller?.firstElementChild
    if (!scroller || !first) return
    const step = first.getBoundingClientRect().width + 16
    scroller.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  const track = (event) => {
    const scroller = event.currentTarget
    const first = scroller.firstElementChild
    if (!first) return
    const step = first.getBoundingClientRect().width + 16
    setActive(Math.min(site.recommendations.length - 1, Math.max(0, Math.round(scroller.scrollLeft / step))))
  }

  return (
    <Section surface="recommendations">
      <Container>
        <SectionHeading id="recommendations" label="What others say" title="Recommendations." />
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted" aria-live="polite">
            <span className="text-accent">{String(active + 1).padStart(2, '0')}</span>
            {' / '}{String(site.recommendations.length).padStart(2, '0')}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous recommendation"
              onClick={() => move(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-hairline text-muted transition-colors hover:border-accent hover:text-ink"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next recommendation"
              onClick={() => move(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-hairline text-muted transition-colors hover:border-accent hover:text-ink"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Horizontal scroll row, scrollbar hidden, cards snapping. tabIndex
            keeps it keyboard-scrollable since there is no visible bar. */}
        <div
          ref={scrollerRef}
          onScroll={track}
          tabIndex={0}
          role="region"
          aria-label="Recommendations"
          // overflow-y must be pinned: with overflow-x auto alone, the browser
          // computes overflow-y as auto too, and the row gains a few px of
          // internal vertical scroll.
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-5 py-3 md:-mx-6 md:px-6"
        >
          {site.recommendations.map(({ quote, name, context, date }, i) => (
            <Reveal
              key={name}
              delay={i * 60}
              data-recommendation-card=""
              className="min-w-[85%] snap-start sm:min-w-[26rem] lg:min-w-[30rem]"
            >
              <Card as="figure" className="recommendation-card flex h-full flex-col">
                <span aria-hidden="true" className="font-display text-[3rem] leading-none text-accent">“</span>
                <blockquote className="measure -mt-2 text-body">{quote}</blockquote>
                <figcaption className="mt-6 border-t border-hairline pt-4">
                  <p className="text-body font-medium">{name}</p>
                  <p className="mt-1 text-label text-muted">
                    {context} · {date}
                  </p>
                </figcaption>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
