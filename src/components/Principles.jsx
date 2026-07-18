import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Principles() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="principles" label="How I work" title="Principles." />
        <div className="grid gap-4 sm:grid-cols-2">
          {site.principles.map((principle, i) => (
            <Reveal key={principle} delay={i * 60}>
              <Card className="h-full">
                <p className="text-card-title font-medium tracking-tight">{principle}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
