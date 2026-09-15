import { version as reactVersion } from 'react'
import { site } from '../content/site'
import { useTheme } from '../theme/ThemeContext'
import { Container } from './ui/Container'

// Injected by vite.config.js at build time; the fallback only exists so the
// component can render in tools that bypass the Vite pipeline.
const info =
  typeof __BUILD_INFO__ !== 'undefined'
    ? __BUILD_INFO__
    : { sha: '0000000', tests: 0, date: '1970-01-01' }

export function Footer({ currentPage }) {
  const { grammar } = useTheme()
  // The footer also renders on the Lab page, where bare #hashes would point
  // at nothing — mirror the Nav's cross-page routing.
  const sectionHref = (id) => (currentPage === 'lab' ? `${import.meta.env.BASE_URL}#${id}` : `#${id}`)
  // Any surface-mapped rhythm can claim the footer (Cupertino: parchment;
  // Paper: the dark close that never inverts).
  const footerSurface =
    grammar.rhythm === 'tiles' ? grammar.tiles?.footer ?? 'parchment' : grammar.tiles?.footer
  const surfaceProps = footerSurface ? { 'data-surface': footerSurface } : {}

  return (
    <footer {...surfaceProps} className="border-t border-hairline bg-canvas py-10">
      {/* The sitemap row: everything the flat nav demoted (2026-09-15). On
          wide screens the trail duplicates this; below 1680px it is the only
          route to these sections besides scrolling. */}
      <Container>
        <nav aria-label="All sections" className="mb-6 border-b border-hairline pb-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.footerNav.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={sectionHref(id)}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-label text-muted">{site.footer}</p>
        <p data-testid="build-info" className="font-mono text-label text-muted">
          React {reactVersion.split('.')[0]} · Vite · Tailwind CSS · GSAP · draw.io · {info.tests}{' '}
          tests · {info.sha}
        </p>
      </Container>
    </footer>
  )
}
