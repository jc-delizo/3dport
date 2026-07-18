import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Recommendations() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="recommendations" label="What others say" title="Recommendations." />
        <div className="grid gap-4 lg:grid-cols-2">
          {site.recommendations.map(({ quote, name, context, date }, i) => (
            <Reveal key={name} delay={i * 60}>
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
    </section>
  )
}
