import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function About() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="about" label="Background" title="About." />
        <Reveal>
          <p className="measure text-body text-muted">{site.about}</p>
        </Reveal>
      </Container>
    </section>
  )
}