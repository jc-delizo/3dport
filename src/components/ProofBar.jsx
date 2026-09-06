import { useRef } from 'react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { parseStat, useCountUp } from './ui/useCountUp'

function Stat({ value, label, delay }) {
  const ref = useRef(null)
  useCountUp(value, ref, delay)
  return (
    <div className="proof-stat group relative h-full overflow-hidden border-l border-hairline px-4 py-2 sm:px-5 md:px-6">
      <span aria-hidden="true" className="absolute left-0 top-0 h-8 w-px bg-accent transition-[height] duration-300 group-hover:h-full" />
      <p
        ref={ref}
        data-stat
        data-countup-target={parseStat(value)?.target}
        data-countup-delay={delay}
        aria-label={value}
        className="font-display tabular-nums text-[2.5rem] font-semibold leading-none tracking-display text-ink md:text-[3.25rem]"
      >
        {value}
      </p>
      <p className="measure mt-3 font-mono text-[10px] uppercase leading-4 tracking-[0.14em] text-muted">{label}</p>
    </div>
  )
}

export function ProofBar() {
  return (
    <Section surface="proof" compact aria-label="Impact at a glance" className="proof-section">
      <Container wide>
        <div className="mb-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-hairline" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            Verified delivery record
          </p>
          <span className="h-px flex-1 bg-hairline" />
        </div>
        <div className="grid grid-cols-2 gap-y-7 lg:grid-cols-4 lg:gap-y-0">
          {site.proof.map(({ value, label }, i) => (
            <Reveal key={label} delay={i * 80}>
              <Stat value={value} label={label} delay={i * 120} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
