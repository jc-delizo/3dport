import { site } from '../content/site'
import { slug } from '../lib/slug'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Portfolio() {
  return (
    <Section surface="portfolio">
      <Container>
        <SectionHeading id="portfolio" label="Full portfolio" title="Projects Delivered.">
          {site.portfolio.intro}
        </SectionHeading>

        <div className="space-y-12">
          {site.portfolio.groups.map(({ group, items }, i) => (
            <Reveal key={group} delay={Math.min(i, 3) * 60}>
              <p className="text-label uppercase tracking-widest text-accent">
                {group} · {items.length}
              </p>
              <div className="mt-4 grid gap-x-10 gap-y-6 border-t border-hairline pt-6 md:grid-cols-2">
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
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
