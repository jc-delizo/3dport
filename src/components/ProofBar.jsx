import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { Reveal } from './ui/Reveal'

export function ProofBar() {
  return (
    <section aria-label="Impact at a glance" className="border-b border-hairline section-gap">
      <Container wide>
        <div className="grid gap-4 sm:grid-cols-3">
          {site.proof.map(({ value, label }, i) => (
            <Reveal key={label} delay={i * 80}>
              <Card className="h-full">
                <p data-stat className="text-hero font-semibold tracking-tight text-accent">
                  {value}
                </p>
                <p className="measure mt-3 text-label uppercase tracking-widest text-muted">{label}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
