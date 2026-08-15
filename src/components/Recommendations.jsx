import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Recommendations() {
  return (
    <Section surface="recommendations">
      <Container>
        <SectionHeading id="recommendations" label="What others say" title="Recommendations." />
        {/* Horizontal scroll row, scrollbar hidden, cards snapping. tabIndex
            keeps it keyboard-scrollable since there is no visible bar. */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Recommendations"
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2"
        >
          {site.recommendations.map(({ quote, name, context, date }, i) => (
            <Reveal
              key={name}
              delay={i * 60}
              className="min-w-[85%] snap-start sm:min-w-[26rem] lg:min-w-[30rem]"
            >
              <Card as="figure" className="flex h-full flex-col">
                <blockquote className="measure text-body">{quote}</blockquote>
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
