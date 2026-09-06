import { ArrowRight, BriefcaseBusiness } from 'lucide-react'
import { Backdrop } from './components/backdrop/Backdrop'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { DeliveryFlow } from './components/lab/DeliveryFlow'
import { LabConstellation } from './components/lab/LabConstellation'
import { ProjectCard } from './components/lab/ProjectCard'
import { Container } from './components/ui/Container'
import { Reveal } from './components/ui/Reveal'
import { Section } from './components/ui/Section'
import { labPage, labProjects, professionalWork } from './content/lab'

function LabHero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-hairline py-7 md:py-9">
      <Container>
        <div className="grid items-center gap-7 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
          <div>
            <p className="font-mono text-label uppercase tracking-widest text-accent">
              {labPage.hero.label}
            </p>
            <h1 className="font-display mt-3 text-section font-semibold tracking-display md:text-[2.75rem] md:leading-[1.05]">
              {labPage.hero.title}
            </h1>
            <p className="measure mt-3 text-body text-muted">{labPage.hero.body}</p>
          </div>
          <LabConstellation />
        </div>
      </Container>
    </section>
  )
}

function ProfessionalWork() {
  return (
    <Section surface="professional-work">
      <Container>
        <Reveal>
          <div className="rounded-card border border-hairline bg-card p-6 md:p-10">
            <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
              <div>
                <p className="flex items-center gap-2 font-mono text-label uppercase tracking-widest text-accent">
                  <BriefcaseBusiness aria-hidden="true" className="h-4 w-4" />
                  {professionalWork.label}
                </p>
                <h2 className="font-display mt-4 text-section font-semibold tracking-display">
                  {professionalWork.title}
                </h2>
                <p className="measure mt-4 text-body text-muted">{professionalWork.body}</p>
              </div>
              <div className="self-end rounded-xl border border-hairline bg-canvas p-5 md:p-6">
                <p className="text-label leading-6 text-muted">{professionalWork.note}</p>
                <a
                  href={professionalWork.href}
                  className="link-underline mt-6 inline-flex items-center gap-2 text-label font-medium text-ink"
                >
                  Read the anonymized case study{' '}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-hairline pt-8">
              <DeliveryFlow />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

export default function LabApp() {
  return (
    <>
      <a href="#lab-main" className="skip-link">
        Skip to content
      </a>
      <Backdrop />
      <Nav currentPage="lab" />
      <main id="lab-main">
        <LabHero />
        <Section surface="lab" compact>
          <Container>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-9">
              <div>
                <p
                  id="projects"
                  className="scroll-mt-24 font-mono text-label uppercase tracking-widest text-muted"
                >
                  Five independent builds
                </p>
                <h2 className="font-display mt-1 text-section font-semibold tracking-display">
                  Pick one. Poke around.
                </h2>
              </div>
              <p className="max-w-sm text-label leading-6 text-muted">
                Real screens, real status, no production theater.
              </p>
            </div>
            <ul className="grid gap-7 md:grid-cols-2">
              {labProjects.map((project, index) => (
                <Reveal
                  as="li"
                  key={project.id}
                  delay={Math.min(index, 3) * 60}
                  className={index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}
                >
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </Section>
        <ProfessionalWork />
      </main>
      <Footer />
    </>
  )
}
