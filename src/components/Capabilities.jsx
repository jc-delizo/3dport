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
          {site.capabilities.map(({ icon, label }, i) => {
            const Icon = ICONS[icon]
            return (
              <Reveal key={label} delay={Math.min(i, 3) * 60}>
                <Card className="flex h-full items-center gap-3">
                  <Icon size={18} aria-hidden="true" className="shrink-0 text-muted" />
                  <span className="text-body font-medium">{label}</span>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
