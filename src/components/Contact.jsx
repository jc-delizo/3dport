import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'
import { SiViber, SiWhatsapp } from 'react-icons/si'
import { ArrowUpRight } from 'lucide-react'

export function Contact() {
  const { heading, body } = site.availability
  const { email, linkedin, whatsapp, viber, resume, resumeFilename } = site.contact

  return (
    <Section surface="contact" divider={false}>
      <Container>
        <SectionHeading id="contact" label="Contact" title={heading} />
        <Reveal>
          <div className="contact-grid grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-14">
            <div>
              <p className="measure text-body leading-7 text-muted">{body}</p>
              <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Direct channels · no contact form
              </p>
            </div>

            <div>
              <Button href={`mailto:${email}`} className="w-full justify-between sm:w-auto sm:min-w-[20rem]">
                {email}
                <ArrowUpRight aria-hidden="true" className="ml-3 h-4 w-4" />
              </Button>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Button href={linkedin} variant="ghost" external className="justify-start">
                  LinkedIn <ArrowUpRight aria-hidden="true" className="ml-auto h-3.5 w-3.5" />
                </Button>
                <Button href={resume} variant="ghost" download={resumeFilename} className="justify-start">
                  Résumé <span aria-hidden="true" className="ml-auto">↓</span>
                </Button>
                <Button href={whatsapp.href} variant="ghost" external className="justify-start">
                  <SiWhatsapp aria-hidden="true" className="mr-2 h-4 w-4" />
                  WhatsApp {whatsapp.display}
                </Button>
                <Button href={viber.href} variant="ghost" className="justify-start">
                  <SiViber aria-hidden="true" className="mr-2 h-4 w-4" />
                  Viber {viber.display}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
