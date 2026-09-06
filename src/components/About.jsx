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
          <div className="grid gap-9 md:grid-cols-[15rem_1fr] md:items-start md:gap-14">
            <div className="about-identity grid grid-cols-[8.25rem_1fr] items-start gap-3 md:sticky md:top-28 md:block">
              {/* The portrait and fast facts form a compact identity card; the
                  evidence-led story still keeps biography near the end. */}
              <figure className="about-portrait self-start overflow-hidden rounded-card border border-hairline bg-card">
                <picture>
                  <source srcSet={asset('head.avif')} type="image/avif" />
                  <img
                    src={asset('head.jpg')}
                    alt="JC Delizo"
                    width="240"
                    height="320"
                    className="block h-[190px] w-full object-contain object-bottom md:h-[320px]"
                  />
                </picture>
              </figure>

              <ul className="grid gap-2 md:mt-4">
                {site.about.facts.map((fact) => (
                  <li
                    key={fact}
                    className="rounded-lg border border-hairline bg-card px-3 py-2 font-mono text-[10px] leading-4 text-muted"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            <div className="about-story relative min-w-0 border-l border-hairline pl-7 md:pl-9">
              {site.about.story.map(({ title, body }, index) => (
                <div key={title} className="relative mb-9 last:mb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.15rem] top-0 grid h-6 w-6 place-items-center rounded-full border border-hairline bg-canvas font-mono text-[9px] text-accent md:-left-[2.95rem]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="font-mono text-label uppercase tracking-widest text-muted">
                    {title}
                  </p>
                  <p className="measure mt-3 text-body leading-7 text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
