import {
  Workflow,
  GitBranch,
  Sparkles,
  Target,
  Database,
  Users,
  Layers,
  Briefcase,
  Handshake,
  LineChart,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

const ICONS = {
  Workflow,
  GitBranch,
  Sparkles,
  Target,
  Database,
  Users,
  Layers,
  Briefcase,
  Handshake,
  LineChart,
  RefreshCw,
  ShieldAlert,
}

function CapabilityGrid({ items, offset = 0 }) {
  return (
    <ul className="capability-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon, label, proof }, i) => {
        const Icon = ICONS[icon]
        return (
          <Reveal as="li" key={label} delay={Math.min(i + offset, 3) * 60}>
            <Card className="capability-card flex h-full items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairline bg-canvas">
                <Icon size={16} aria-hidden="true" className="text-accent" />
              </span>
              <div>
                <p className="text-label font-semibold leading-5">{label}</p>
                <p className="mt-1 text-[12px] leading-5 text-muted">{proof}</p>
              </div>
            </Card>
          </Reveal>
        )
      })}
    </ul>
  )
}

export function Capabilities() {
  const primary = site.capabilities.slice(0, 6)
  const more = site.capabilities.slice(6)

  return (
    <Section surface="capabilities">
      <Container>
        <SectionHeading id="capabilities" label="Where I operate" title="Capabilities." />
        <CapabilityGrid items={primary} />
        <details className="capability-more mt-5 rounded-card border border-hairline bg-card">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted marker:content-none">
            <span>More operating areas</span>
            <span className="text-accent">+ {more.length} capabilities</span>
          </summary>
          <div className="border-t border-hairline p-3 md:p-4">
            <CapabilityGrid items={more} offset={primary.length} />
          </div>
        </details>
      </Container>
    </Section>
  )
}
