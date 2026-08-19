import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Award, BookOpen, Code, GraduationCap } from 'lucide-react'
import { SiAnthropic } from 'react-icons/si'
import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Card } from './ui/Card'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { ListMore } from './ui/InlineDisclosure'

// The three most role-relevant credentials lead the content array and render
// as featured cards; the rest stay a compact list.
const FEATURED_COUNT = 3
// How many list rows the collapsed view shows below the cards.
const LIST_COLLAPSED_COUNT = 3

// Issuer marks: Anthropic has a real brand icon; the others use a consistent
// neutral glyph per institution (no fabricated logos).
const ISSUER_MARKS = {
  Anthropic: SiAnthropic,
  'The Open University': GraduationCap,
  'Philippine Instrumentation and Control Society': Award,
  'Zuitt Coding Bootcamp': Code,
  Alison: BookOpen,
}

function IssuerMark({ issuer, className = '' }) {
  const Mark = ISSUER_MARKS[issuer]
  if (!Mark) return null
  return <Mark aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 text-muted ${className}`} />
}

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
  const featured = site.certifications.slice(0, FEATURED_COUNT)
  const rest = site.certifications.slice(FEATURED_COUNT)
  const visible = expanded ? rest : rest.slice(0, LIST_COLLAPSED_COUNT)

  return (
    <Section surface="certifications">
      <Container>
        <SectionHeading id="certifications" label="Verified" title="Certifications." />

        <Reveal>
          <ul className="grid gap-4 sm:grid-cols-3">
            {featured.map(({ name, issuer, date, url }) => (
              <li key={name} className="h-full">
                <Card className="flex h-full flex-col">
                  <div className="flex items-center gap-2 text-label text-muted">
                    <IssuerMark issuer={issuer} />
                    <span>{issuer}</span>
                  </div>
                  <p className="mt-3 text-body font-medium">{name}</p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-label uppercase tracking-widest text-muted">{date}</span>
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Verify ${name}`}
                        className="rounded-button border border-hairline px-2.5 py-1 font-mono text-label text-muted transition-colors hover:border-muted hover:text-ink"
                      >
                        Verify ↗
                      </a>
                    ) : null}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={60}>
          <ul id="certifications-list" className="mt-8 border-t border-hairline">
            {visible.map(({ name, issuer, date, note, url }) => (
              <li
                key={name}
                className="flex flex-col gap-1 border-b border-hairline py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <div className="min-w-0">
                  <CredentialName name={name} url={url} className="text-body font-medium" />
                  {note ? <p className="mt-1 text-label text-accent">{note}</p> : null}
                </div>
                <p className="flex shrink-0 items-center gap-3 text-label text-muted">
                  <IssuerMark issuer={issuer} />
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
            moreLabel={`${rest.length - LIST_COLLAPSED_COUNT} more certifications`}
            className="mt-5"
          />
        </Reveal>
      </Container>
    </Section>
  )
}
