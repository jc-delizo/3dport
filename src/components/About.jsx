import { site } from '../content/site'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

// Public assets must go through BASE_URL. Vite rewrites asset paths in HTML and CSS
// but not in JS strings, so a bare "/head.avif" would 404 under the /3dport/ deploy
// base. This is the first component in the project to reference a public asset.
const asset = (file) => `${import.meta.env.BASE_URL}${file}`

export function About() {
  return (
    <Section surface="about">
      <Container>
        <SectionHeading id="about" label="Background" title="About." />
        <Reveal>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            {/* Not the Card primitive: Card hard-codes p-6 md:p-8, and a p-0 override
                is resolved by Tailwind's stylesheet order, not class order. The
                portrait needs zero padding so it can bleed off the bottom edge. */}
            <figure className="self-start shrink-0 overflow-hidden rounded-xl border border-hairline bg-card">
              <picture>
                <source srcSet={asset('head.avif')} type="image/avif" />
                <img
                  src={asset('head.jpg')}
                  alt="JC Delizo"
                  width="240"
                  height="320"
                  className="block h-[240px] w-[180px] object-cover object-bottom md:h-[320px] md:w-[240px]"
                />
              </picture>
            </figure>
            <div className="min-w-0">
              {site.about.story.map(({ title, body }) => (
                <div key={title} className="mb-8 last:mb-0">
                  <p className="font-mono text-label uppercase tracking-widest text-muted">
                    {title}
                  </p>
                  <p className="measure mt-2 text-body text-muted">{body}</p>
                </div>
              ))}

              <ul className="mt-10 flex flex-wrap gap-2">
                {site.about.facts.map((fact) => (
                  <li
                    key={fact}
                    className="rounded-button border border-hairline bg-card px-3.5 py-1.5 text-label"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
