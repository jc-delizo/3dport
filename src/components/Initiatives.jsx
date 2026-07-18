import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

function Block({ label, children }) {
  return (
    <div className="mt-6">
      <p className="text-label uppercase tracking-widest text-muted">{label}</p>
      <div className="measure mt-2 text-body">{children}</div>
    </div>
  )
}

export function Initiatives() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="initiatives" label="Selected work" title="Initiatives." />

        <div className="grid gap-4">
          {site.initiatives.map(({ id, category, title, problem, approach, outcome }, i) => (
            <Reveal key={id} delay={Math.min(i, 3) * 60}>
              <Card as="article">
                <p className="text-label uppercase tracking-widest text-accent">{category}</p>
                <h3 className="mt-2 text-card-title font-semibold tracking-tight">{title}</h3>

                <Block label="Problem">{problem}</Block>

                <Block label="Approach">
                  <ul className="list-disc space-y-2 pl-5 text-muted">
                    {approach.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </Block>

                <Block label="Outcome">{outcome}</Block>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
