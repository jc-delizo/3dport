import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { site } from '../content/site'
import { slug } from '../lib/slug'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Portfolio() {
  // Categories collapse to a nine-line table of contents; a reader expands
  // only the domains they care about.
  const [open, setOpen] = useState(() => new Set())

  // Deep links into a collapsed group must still land: if the page loads with
  // a hash pointing at an entry, open the group that contains it.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (!hash) return
    const target = site.portfolio.groups.find((g) =>
      g.items.some((item) => slug(item.title) === hash)
    )
    if (target) setOpen((prev) => new Set(prev).add(target.group))
  }, [])

  const toggle = (group) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })

  return (
    <Section surface="portfolio">
      <Container>
        <SectionHeading id="portfolio" label="Full portfolio" title="Projects Delivered.">
          {site.portfolio.intro}
        </SectionHeading>

        <div className="border-b border-hairline">
          {site.portfolio.groups.map(({ group, items }, i) => {
            const expanded = open.has(group)
            const panelId = `portfolio-group-${slug(group)}`
            return (
              <Reveal key={group} delay={Math.min(i, 3) * 60}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(group)}
                  className="flex w-full items-center justify-between gap-4 border-t border-hairline py-5 text-left"
                >
                  <span className="text-label uppercase tracking-widest text-accent">
                    {group}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-label uppercase tracking-widest text-muted">
                    {items.length} projects
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>
                {expanded ? (
                  <div id={panelId} className="grid gap-x-10 gap-y-6 pb-8 pt-1 md:grid-cols-2">
                    {items.map(({ title, role, desc }) => (
                      // The slug id makes each entry individually linkable.
                      <article key={title} id={slug(title)} className="scroll-mt-24">
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="text-body font-medium">{title}</h3>
                          <span className="shrink-0 text-label uppercase tracking-widest text-muted">
                            {role}
                          </span>
                        </div>
                        <p className="mt-1 text-label text-muted">{desc}</p>
                      </article>
                    ))}
                  </div>
                ) : null}
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
