import { useState } from 'react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { ListMore } from './ui/InlineDisclosure'

export function Experience() {
  // Collapsed, only the current role shows; earlier roles sit behind See more.
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? site.experience : site.experience.slice(0, 1)

  return (
    <Section surface="experience">
      <Container>
        <SectionHeading id="experience" label="Track record" title="Experience." />
        <div id="experience-list" className="grid gap-4">
          {visible.map(({ company, role, period, points }, i) => (
            <Reveal key={company} delay={Math.min(i, 3) * 60}>
              <Card as="article">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-display text-card-title font-semibold tracking-display">{company}</h3>
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
        <ListMore
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
          controls="experience-list"
          moreLabel={`${site.experience.length - 1} earlier roles`}
          className="mt-5"
        />
      </Container>
    </Section>
  )
}
