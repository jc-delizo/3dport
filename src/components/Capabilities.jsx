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

export function Capabilities() {
  return (
    <Section surface="capabilities">
      <Container>
        <SectionHeading id="capabilities" label="Where I operate" title="Capabilities." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.capabilities.map(({ icon, label, proof }, i) => {
            const Icon = ICONS[icon]
            return (
              <Reveal key={label} delay={Math.min(i, 3) * 60}>
                <Card className="flex h-full items-start gap-3">
                  <Icon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-muted" />
                  <div>
                    <p className="text-body font-medium">{label}</p>
                    {/* The receipt: a sourced fact, not an adjective. */}
                    <p className="mt-1 text-label text-muted">{proof}</p>
                  </div>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
