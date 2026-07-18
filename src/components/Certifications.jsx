import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Certifications() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="certifications" label="Verified" title="Certifications." />
        <div className="grid gap-4 sm:grid-cols-2">
          {site.certifications.map(({ name, issuer, date, note }, i) => (
            <Reveal key={name} delay={Math.min(i, 3) * 60}>
              <Card className="h-full">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-card-title font-semibold tracking-tight">{name}</h3>
                  <p className="shrink-0 text-label uppercase tracking-widest text-muted">{date}</p>
                </div>
                <p className="mt-2 text-body text-muted">{issuer}</p>
                {note ? <p className="mt-3 text-label text-accent">{note}</p> : null}
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
