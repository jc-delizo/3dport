import { site } from '../content/site'
import { useTheme } from '../theme/ThemeContext'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

function Pipeline({ centered }) {
  return (
    <Reveal delay={200} className="mt-16">
      <ol
        className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-label uppercase tracking-widest text-muted ${
          centered ? 'justify-center' : ''
        }`}
      >
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
  // Tiles rhythm (Cupertino) centers the hero like a product-page headline.
  const centered = useTheme().grammar.rhythm === 'tiles'

  return (
    <Section id="top" surface="hero">
      <Container className={centered ? 'flex flex-col items-center text-center' : ''}>
        <Reveal>
          <h1 className="font-display text-hero font-semibold tracking-display md:text-hero-lg">{name}</h1>
          <p className="mt-3 text-section font-medium text-muted">{title}</p>
        </Reveal>

        <Reveal delay={80}>
          <p className={`measure mt-8 text-body md:text-card-title ${centered ? 'mx-auto' : ''}`}>
            {claim}
          </p>
          <p className={`measure mt-4 text-body text-muted ${centered ? 'mx-auto' : ''}`}>
            {support}
          </p>
        </Reveal>

        <Reveal
          delay={140}
          className={`mt-10 flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}
        >
          <Button href={primaryCta.href}>{primaryCta.label}</Button>
          {secondaryCtas.map((cta) => (
            <Button
              key={cta.label}
              href={cta.href}
              variant="ghost"
              external={!cta.download}
              download={cta.download}
            >
              {cta.label}
            </Button>
          ))}
        </Reveal>

        <Pipeline centered={centered} />
      </Container>
    </Section>
  )
}
