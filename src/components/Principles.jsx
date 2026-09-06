import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Principles() {
  return (
    <Section surface="principles">
      <Container>
        <SectionHeading id="principles" label="How I work" title="Principles." />
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {site.principles.map((principle, i) => (
            <Reveal key={principle} delay={i * 60}>
              <Card className="principle-card flex h-full items-start gap-5">
                <span className="font-mono text-[10px] text-accent">0{i + 1}</span>
                <p className="font-display text-card-title font-medium tracking-display">{principle}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
