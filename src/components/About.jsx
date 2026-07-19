import { site } from '../content/site'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'

// Public assets must go through BASE_URL. Vite rewrites asset paths in HTML and CSS
// but not in JS strings, so a bare "/head.avif" would 404 under the /3dport/ deploy
// base. This is the first component in the project to reference a public asset.
const asset = (file) => `${import.meta.env.BASE_URL}${file}`

export function About() {
  return (
    <section className="border-b border-hairline section-gap">
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
            <p className="measure text-body text-muted">{site.about}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
