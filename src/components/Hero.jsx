import { site } from '../content/site'
import { Container } from './ui/Container'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

function Pipeline() {
  return (
    <Reveal delay={200} className="mt-16">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-label uppercase tracking-widest text-muted">
        {site.pipeline.map((stage, i) => (
          <li key={stage} className="flex items-center gap-3">
            <span>{stage}</span>
            {i < site.pipeline.length - 1 ? (
              <span aria-hidden="true" className="text-hairline">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </Reveal>
  )
}

export function Hero() {
  const { name, title, claim, support, primaryCta, secondaryCtas } = site.hero

  return (
    <section id="top" className="border-b border-hairline pt-20 pb-16 md:pt-28 md:pb-24">
      <Container>
        <Reveal>
          <h1 className="text-hero font-semibold tracking-tight md:text-hero-lg">{name}</h1>
          <p className="mt-3 text-section font-medium text-muted">{title}</p>
        </Reveal>

        <Reveal delay={80}>
          <p className="measure mt-8 text-body md:text-card-title">{claim}</p>
          <p className="measure mt-4 text-body text-muted">{support}</p>
        </Reveal>

        <Reveal delay={140} className="mt-10 flex flex-wrap gap-3">
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
          {secondaryCtas.map((cta) => (
            <Button key={cta.label} href={cta.href} variant="ghost" external>
              {cta.label}
            </Button>
          ))}
        </Reveal>

        <Pipeline />
      </Container>
    </section>
  )
}
