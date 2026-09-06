import { ArrowRight } from 'lucide-react'
import { featuredLabProjects, labPage } from '../content/lab'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { ProjectCard } from './lab/ProjectCard'

export function LabTeaser() {
  return (
    <Section surface="lab">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="lab" label="Hands-on builds" title="Personal Lab.">
            Products, experiments, and interactive stories I design and build end to end — often
            with AI in the toolchain, always with responsibility for what ships.
          </SectionHeading>
          <a
            href={labPage.url}
            className="link-underline mb-12 inline-flex shrink-0 items-center gap-2 self-start text-label font-medium text-ink sm:self-auto"
          >
            Explore all five projects <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>

        <ul className="grid gap-6 md:grid-cols-2">
          {featuredLabProjects.map((project, index) => (
            <Reveal as="li" key={project.id} delay={index * 70}>
              <ProjectCard project={project} compact headingLevel={3} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
