import { Workflow, GitBranch, Sparkles, Target, Database, Users } from 'lucide-react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

const ICONS = { Workflow, GitBranch, Sparkles, Target, Database, Users }

export function Capabilities() {
  return (
    <section className="border-b border-hairline section-gap">
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
    </section>
  )
}
