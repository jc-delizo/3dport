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

export function Footer() {
  const { grammar } = useTheme()
  // Any surface-mapped rhythm can claim the footer (Cupertino: parchment;
  // Paper: the dark close that never inverts).
  const footerSurface =
    grammar.rhythm === 'tiles' ? grammar.tiles?.footer ?? 'parchment' : grammar.tiles?.footer
  const surfaceProps = footerSurface ? { 'data-surface': footerSurface } : {}

  return (
    <footer {...surfaceProps} className="border-t border-hairline bg-canvas py-10">
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="text-label text-muted">{site.footer}</p>
        <p data-testid="build-info" className="font-mono text-label text-muted">
          React {reactVersion.split('.')[0]} · Vite · {info.tests} tests · {info.sha} · {info.date}
        </p>
      </Container>
    </footer>
  )
}
