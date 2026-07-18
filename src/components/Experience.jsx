import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Experience() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="experience" label="Track record" title="Experience." />
        <div className="grid gap-4">
          {site.experience.map(({ company, role, period, points }, i) => (
            <Reveal key={company} delay={Math.min(i, 3) * 60}>
              <Card as="article">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-card-title font-semibold tracking-tight">{company}</h3>
                  <p className="text-label uppercase tracking-widest text-muted">{period}</p>
                </div>
                <p className="mt-1 text-body text-muted">{role}</p>
                <ul className="measure mt-4 list-disc space-y-2 pl-5 text-body text-muted">
                  {points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
