import { ExternalLink } from 'lucide-react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

// The name is the accessible link; the icon is only the visual cue that it leaves the page.
// Entries without a credential URL (Alison) render as plain text — never a dead link.
function CredentialName({ name, url, className = '' }) {
  if (!url) return <span className={className}>{name}</span>
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} transition-colors hover:text-accent`}
    >
      {name}
      <ExternalLink size={14} aria-hidden="true" className="ml-1.5 inline-block text-muted" />
    </a>
  )
}

export function Certifications() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="certifications" label="Verified" title="Certifications." />
        <Reveal>
          <ul className="border-t border-hairline">
            {site.certifications.map(({ name, issuer, date, note, url }) => (
              <li
                key={name}
                className="flex flex-col gap-1 border-b border-hairline py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <div className="min-w-0">
                  <CredentialName name={name} url={url} className="text-body font-medium" />
                  {note ? <p className="mt-1 text-label text-accent">{note}</p> : null}
                </div>
                <p className="flex shrink-0 items-baseline gap-3 text-label text-muted">
                  <span>{issuer}</span>
                  <span className="uppercase tracking-widest">{date}</span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
