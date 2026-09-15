import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { site } from '../content/site'
import { useTheme } from '../theme/ThemeContext'
import { Container } from './ui/Container'
import { Section } from './ui/Section'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'

// On load, a glare sweeps once through the hero's key claims in reading
// order: the two support phrases → the three pipeline roles. One pass only —
// the hero goes still afterwards. The support steps are substrings
// of the support line, matched at render time so copy edits fail soft.
const SUPPORT_GLARES = [
  '2 to 20–28 projects/year',
  'Agile, AI-powered workflows, and scalable delivery systems',
]
const GLARE_STEPS = 5
const GLARE_STEP_MS = 1100
const GLARE_START_DELAY_MS = 900

function supportSegments(support) {
  const segments = []
  let rest = support
  SUPPORT_GLARES.forEach((target, i) => {
    const at = rest.indexOf(target)
    if (at === -1) return
    if (at > 0) segments.push({ text: rest.slice(0, at) })
    segments.push({ text: target, step: i })
    rest = rest.slice(at + target.length)
  })
  if (rest) segments.push({ text: rest })
  return segments
}

const glareClass = (active) => (active ? 'text-glare glare-muted' : undefined)

function Pipeline({ centered, glareStep }) {
  return (
    <Reveal delay={200} className="hero-pipeline mt-8 w-full border-t border-hairline pt-5">
      <ol
        className={`flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-label uppercase tracking-widest text-muted ${
          centered ? 'justify-center' : ''
        }`}
      >
        {site.pipeline.map((stage, i) => (
          <li key={stage} className="flex items-center gap-3">
            <span className={glareClass(glareStep === 2 + i)}>{stage}</span>
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
  const { claim, support, primaryCta, secondaryCtas } = site.hero
  // Tiles rhythm (Cupertino) centers the hero like a product-page headline.
  const centered = useTheme().grammar.rhythm === 'tiles'
  const [glareStep, setGlareStep] = useState(-1)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let interval
    const start = setTimeout(() => {
      let step = 0
      setGlareStep(0)
      interval = setInterval(() => {
        step += 1
        if (step >= GLARE_STEPS) {
          clearInterval(interval)
          setGlareStep(-1) // done — one pass per load
        } else {
          setGlareStep(step)
        }
      }, GLARE_STEP_MS)
    }, GLARE_START_DELAY_MS)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [])

  return (
    <Section id="top" surface="hero" className="hero-section">
      <Container className={centered ? 'flex flex-col items-center text-center' : ''}>
        <div className="hero-layout mx-auto w-full max-w-5xl">
          <Reveal delay={80}>
            <h1
              className={`hero-statement measure font-display font-semibold tracking-display ${
                centered ? 'mx-auto' : ''
              }`}
            >
              {claim}
            </h1>
            <p className={`measure mt-5 text-body text-muted ${centered ? 'mx-auto' : ''}`}>
              {supportSegments(support).map(({ text, step }, i) =>
                Number.isInteger(step) ? (
                  // inline-block: a glare phrase wraps to the next line as a
                  // unit instead of breaking mid-phrase (which cut the sweep
                  // at the line boundary). Where the phrase is wider than the
                  // viewport itself — phones — it still breaks internally.
                  <span key={i} className={`inline-block ${glareClass(glareStep === step) ?? ''}`}>
                    {text}
                  </span>
                ) : (
                  <span key={i}>{text}</span>
                )
              )}
            </p>
          </Reveal>

          <Reveal
            delay={140}
            className={`mt-8 flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}
          >
            <Button href={primaryCta.href}>
              {primaryCta.label}
              <ArrowUpRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </Button>
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

          <Pipeline centered={centered} glareStep={glareStep} />
        </div>
      </Container>
    </Section>
  )
}
