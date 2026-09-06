import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'
import { SiViber, SiWhatsapp } from 'react-icons/si'

export function Contact() {
  const { heading, body } = site.availability
  const { email, linkedin, whatsapp, viber, resume, resumeFilename } = site.contact

  return (
    <Section surface="contact" divider={false}>
      <Container>
        <SectionHeading id="contact" label="Contact" title={heading} />
        <Reveal>
          <p className="measure text-body text-muted">{body}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`mailto:${email}`}>{email}</Button>
            <Button href={whatsapp.href} variant="ghost" external>
              <SiWhatsapp aria-hidden="true" className="mr-2 h-4 w-4" />
              WhatsApp {whatsapp.display}
            </Button>
            <Button href={viber.href} variant="ghost">
              <SiViber aria-hidden="true" className="mr-2 h-4 w-4" />
              Viber {viber.display}
            </Button>
            <Button href={linkedin} variant="ghost" external>
              LinkedIn
            </Button>
            <Button href={resume} variant="ghost" download={resumeFilename}>
              Résumé
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
