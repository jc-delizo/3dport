import { useEffect } from 'react'
import { Backdrop } from './components/backdrop/Backdrop'
import { useTheme } from './theme/ThemeContext'
import { useAtriumStage, prefersLiteData } from './components/ui/atriumStage'
import { scrollToSection } from './lib/scrollToSection'
import { Nav } from './components/Nav'
import { SectionNavigator } from './components/SectionNavigator'
import { Hero } from './components/Hero'
import { ProofBar } from './components/ProofBar'
import { Lifecycle } from './components/Lifecycle'
import { Initiatives } from './components/Initiatives'
import { CaseStudies } from './components/CaseStudies'
import { Portfolio } from './components/Portfolio'
import { Principles } from './components/Principles'
import { Experience } from './components/Experience'
import { Recommendations } from './components/Recommendations'
import { Capabilities } from './components/Capabilities'
import { Tools } from './components/Tools'
import { LabTeaser } from './components/LabTeaser'
import { Certifications } from './components/Certifications'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

// Every same-page anchor — trail, nav, footer sitemap, hero CTAs — lands via
// scrollToSection instead of the native jump, from one document-level
// listener. The skip link keeps its native behavior (its job is moving
// focus), and any target that doesn't exist falls back to the browser.
function useAnchorInterception() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return
      const a = e.target.closest?.('a[href^="#"]')
      if (!a || a.classList.contains('skip-link')) return
      let id = a.getAttribute('href').slice(1)
      try {
        id = decodeURIComponent(id)
      } catch {
        /* malformed hash: let the browser have it */
      }
      if (id && scrollToSection(id)) {
        e.preventDefault()
        window.history.pushState(null, '', `#${id}`)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

function useHashNavigation() {
  useEffect(() => {
    const scrollToHash = () => {
      const rawId = window.location.hash.slice(1)
      if (!rawId) return

      let id = rawId
      try {
        id = decodeURIComponent(rawId)
      } catch {
        // A malformed external hash should not stop the rest of the page mounting.
      }

      // scrollToSection, not scrollIntoView: it targets the section's
      // layout position under the measured header (see src/lib).
      scrollToSection(id, { instant: true })
    }

    // Cross-page hashes are resolved before React has mounted its sections.
    // Re-run once the committed DOM exists, then once more after late layout settles.
    const frame = window.requestAnimationFrame(scrollToHash)
    const retry = window.setTimeout(scrollToHash, 180)
    window.addEventListener('hashchange', scrollToHash)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(retry)
      window.removeEventListener('hashchange', scrollToHash)
    }
  }, [])
}

export default function App() {
  useHashNavigation()
  useAnchorInterception()
  // The stage class scopes Atrium's arrival state; perspective itself lives
  // per-section on .atrium-cell (see the projection safety contract).
  const isAtrium = useTheme().grammar.rhythm === 'planes'
  const stage = isAtrium ? 'atrium-stage' : ''
  const stageProps = useAtriumStage(isAtrium)

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {prefersLiteData() ? null : <Backdrop />}
      <Nav />
      <SectionNavigator />
      <main id="main" className={stage} {...stageProps}>
        <Hero />
        <ProofBar />
        <Initiatives />
        <CaseStudies />
        <Experience />
        <Lifecycle />
        <Portfolio />
        <Principles />
        <Recommendations />
        <Capabilities />
        <Tools />
        <LabTeaser />
        <Certifications />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
