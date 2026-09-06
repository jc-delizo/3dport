import { useEffect } from 'react'
import { Backdrop } from './components/backdrop/Backdrop'
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

      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
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

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Backdrop />
      <Nav />
      <SectionNavigator />
      <main id="main">
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
