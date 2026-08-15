import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { ListMore } from './ui/InlineDisclosure'

// How many certifications the collapsed view shows. The featured set leads the
// content array (see the comment above site.certifications), so slicing is enough.
const FEATURED_COUNT = 6

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
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? site.certifications : site.certifications.slice(0, FEATURED_COUNT)

  return (
    <Section surface="certifications">
      <Container>
        <SectionHeading id="certifications" label="Verified" title="Certifications." />
        <Reveal>
          <ul id="certifications-list" className="border-t border-hairline">
            {visible.map(({ name, issuer, date, note, url }) => (
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
          <ListMore
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
            controls="certifications-list"
            moreLabel={`${site.certifications.length - FEATURED_COUNT} more certifications`}
            className="mt-5"
          />
        </Reveal>
      </Container>
    </Section>
  )
}
