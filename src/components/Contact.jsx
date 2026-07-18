import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

export function Contact() {
  const { heading, body } = site.availability
  const { email, linkedin, resume } = site.contact

  return (
    <section className="section-gap">
      <Container>
        <SectionHeading id="contact" label="Availability" title={heading} />
        <Reveal>
          <p className="measure text-body text-muted">{body}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`mailto:${email}`}>{email}</Button>
            <Button href={linkedin} variant="ghost" external>
              LinkedIn
            </Button>
            <Button href={resume} variant="ghost" external>
              Résumé
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}