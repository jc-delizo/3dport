import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ProofBar } from './components/ProofBar'
import { Initiatives } from './components/Initiatives'
import { Principles } from './components/Principles'
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
      <main id="main">
        <Hero />
        <ProofBar />
        <Initiatives />
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
