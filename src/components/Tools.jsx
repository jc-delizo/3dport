import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

export function Tools() {
  return (
    <section className="border-b border-hairline section-gap">
      <Container>
        <SectionHeading id="tools" label="Environment" title="Tools." />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {site.tools.map(({ group, items }, i) => (
            <Reveal key={group} delay={Math.min(i, 3) * 60}>
              <p className="text-label uppercase tracking-widest text-muted">{group}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-hairline bg-card px-2.5 py-1 text-label"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
