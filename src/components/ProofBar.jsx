import { useRef } from 'react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { Reveal } from './ui/Reveal'
import { parseStat, useCountUp } from './ui/useCountUp'

function Stat({ value, label }) {
  const ref = useRef(null)
  useCountUp(value, ref)
  return (
    <Card className="h-full">
      <p
        ref={ref}
        data-stat
        data-countup-target={parseStat(value)?.target}
        className="text-hero font-semibold tracking-display text-accent"
      >
        {value}
      </p>
      <p className="measure mt-3 text-label uppercase tracking-widest text-muted">{label}</p>
    </Card>
  )
}

export function ProofBar() {
  return (
    <Section surface="proof" aria-label="Impact at a glance">
      <Container wide>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {site.proof.map(({ value, label }, i) => (
            <Reveal key={label} delay={i * 80}>
              <Stat value={value} label={label} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
