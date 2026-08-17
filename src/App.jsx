import { Nav } from './components/Nav'
import { SectionNavigator } from './components/SectionNavigator'
import { Hero } from './components/Hero'
import { ProofBar } from './components/ProofBar'
import { Initiatives } from './components/Initiatives'
import { CaseStudies } from './components/CaseStudies'
import { Portfolio } from './components/Portfolio'
import { Principles } from './components/Principles'
import { Approach } from './components/Approach'
import { Experience } from './components/Experience'
import { Recommendations } from './components/Recommendations'
import { Capabilities } from './components/Capabilities'
import { Tools } from './components/Tools'
import { Certifications } from './components/Certifications'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <SectionNavigator />
      <main id="main">
        <Hero />
        <ProofBar />
        <Approach />
        <Initiatives />
        <CaseStudies />
        <Portfolio />
        <Principles />
        <Experience />
        <Recommendations />
        <Capabilities />
        <Tools />
        <Certifications />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
