import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

// The Lab is a lazy view: visitors who never open it never download it.
// The loader is shared so the router can WARM the chunk before switching —
// a sync view change that suspends on an unloaded lazy component withholds
// React's whole commit, which froze the first switch's choreography until
// the import resolved. An idle prefetch below makes first clicks instant in
// practice.
let labModulePromise
const loadLab = () => (labModulePromise ??= import('./components/lab/LabView'))
const LabView = lazy(loadLab)

const HOME_TITLE = 'JC Delizo | Technical Project Manager'
const LAB_TITLE = 'JC Delizo | Personal Lab'
// Two sequential acts (JC, 2026-09-17): the outgoing view exits fully
// (360ms), THEN the incoming one slides in (560ms, delayed to start as the
// exit ends). The window covers both.
const VIEW_TRANSITION_MS = 950

const BASE = import.meta.env.BASE_URL

export const viewFromLocation = () =>
  /\/lab\/?$/.test(window.location.pathname) ? 'lab' : 'home'

const reducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The view router (2026-09-17): the Lab stopped being a second page and
// became a second ROOM of this one. Real URLs survive — /lab/ still exists
// (its html boots this same app straight into the Lab view), switching
// pushes history so the browser's Back works, and popstate drives the view.
// Under Atrium the transition is depth (the old view recedes into the stage,
// the new one dollies forward — the site's own motion language); other
// themes slide, per JC's original sketch; reduced motion swaps instantly.
function useViewRouter() {
  const [view, setView] = useState(viewFromLocation)
  // {from, scrollY} for the length of the switch. Always set — the side
  // rails and back chip choreograph off it even under reduced motion — but
  // the full-screen snapshot layer only mounts when motion is welcome.
  const [transition, setTransition] = useState(null)
  const homeScroll = useRef(0)
  const timer = useRef(0)
  const pendingScroll = useRef(null)

  // Title and scroll land in a LAYOUT effect — after the DOM swap, before
  // paint — so the incoming view never shows a frame at the old scroll
  // position (which read as content jumping upward before the slide).
  const firstRender = useRef(true)
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    document.title = view === 'lab' ? LAB_TITLE : HOME_TITLE
    const target = pendingScroll.current
    pendingScroll.current = null
    if (target) scrollToSection(target, { instant: true })
    else window.scrollTo({ top: view === 'home' ? homeScroll.current : 0, behavior: 'instant' })
  }, [view])

  const go = useCallback(
    (next, { push = true, thenScroll = null } = {}) => {
      setView((current) => {
        if (next === current) {
          if (thenScroll) scrollToSection(thenScroll)
          return current
        }
        if (current === 'home') homeScroll.current = window.scrollY
        pendingScroll.current = thenScroll
        if (push) {
          window.history.pushState({ view: next }, '', next === 'lab' ? `${BASE}lab/` : BASE)
        }
        setTransition({ from: current, scrollY: window.scrollY })
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setTransition(null), VIEW_TRANSITION_MS)
        return next
      })
    },
    []
  )

  // Warm the Lab chunk once the landing view has had its moment.
  useEffect(() => {
    const t = window.setTimeout(loadLab, 2500)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const onPop = () => {
      const next = viewFromLocation()
      if (next === 'lab') loadLab().finally(() => go('lab', { push: false }))
      else go('home', { push: false })
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.clearTimeout(timer.current)
    }
  }, [go])

  return {
    view,
    transition,
    // Chunk first, then the switch: the choreography only starts once the
    // incoming view can actually render.
    openLab: () => loadLab().finally(() => go('lab')),
    backHome: (opts) => go('home', opts),
  }
}

// Every same-page anchor — trail, nav, footer sitemap, hero CTAs — lands via
// scrollToSection instead of the native jump, from one document-level
// listener. A target that lives in the other view switches the view first,
// then scrolls. The skip link keeps its native behavior (its job is moving
// focus); a target that exists nowhere falls back to the browser.
function useAnchorInterception(view, go) {
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
      if (!id) return
      if (document.getElementById(id)) {
        if (scrollToSection(id)) {
          e.preventDefault()
          window.history.pushState(null, '', `#${id}`)
        }
      } else if (view === 'lab') {
        // Home-section link clicked from inside the Lab: come back first.
        e.preventDefault()
        go('home', { thenScroll: id })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [view, go])
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

function HomeView({ stage, stageProps }) {
  return (
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
  )
}

export default function App() {
  const { view, transition, openLab, backHome } = useViewRouter()
  const snapshot = transition && !reducedMotion() ? transition : null
  // The side rails ride the switch: out to their own edges when the Lab
  // opens, back in when the portfolio returns. Deliberately not gated on
  // reduced motion — they are small peripheral strips, and the chip and
  // rails sliding is the requested design (the full-screen swap stays
  // instant under reduce).
  const railsMounted = view === 'home' || transition?.from === 'home'
  const railMotion = (side) =>
    transition ? (view === 'home' ? `rail-in-${side}` : `rail-out-${side}`) : ''
  // The back chip's phase: sliding in while the Lab is (becoming) the view,
  // sliding out — still mounted — while the portfolio returns.
  const backChip = view === 'lab' ? 'in' : transition?.from === 'lab' ? 'out' : null
  useHashNavigation()
  useAnchorInterception(view, (next, opts) =>
    next === 'home' ? backHome(opts) : openLab()
  )
  // The stage class scopes Atrium's arrival state; perspective itself lives
  // per-section on .atrium-cell (see the projection safety contract).
  const isAtrium = useTheme().grammar.rhythm === 'planes'
  const stage = isAtrium ? 'atrium-stage' : ''
  const stageProps = useAtriumStage(isAtrium && view === 'home')

  const activeView =
    view === 'home' ? (
      <HomeView stage={stage} stageProps={stageProps} />
    ) : (
      <Suspense fallback={<main id="main" className="min-h-screen" />}>
        <LabView />
      </Suspense>
    )

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {railsMounted && !prefersLiteData() ? <Backdrop motionClass={railMotion('right')} /> : null}
      <Nav currentPage={view} backChip={backChip} onOpenLab={openLab} onBackHome={() => backHome()} />
      {railsMounted ? <SectionNavigator motionClass={railMotion('left')} /> : null}

      <div
        key={view}
        className={snapshot ? 'view-enter' : undefined}
        data-view={view}
        data-dir={view === 'lab' ? 'to-lab' : 'to-home'}
      >
        {activeView}
        <Footer />
      </div>

      {/* The outgoing view, frozen at its scroll position, animating out on a
          fixed layer above the incoming one. Rendered AFTER the live view so
          its duplicated ids never win getElementById during the transition.
          aria-hidden: it is a picture of the past, not content. */}
      {snapshot ? (
        <div
          className="view-layer-leaving"
          aria-hidden="true"
          data-testid="view-leaving"
          data-dir={view === 'lab' ? 'to-lab' : 'to-home'}
        >
          <div
            className="view-freeze"
            style={{ '--freeze-y': `${snapshot.scrollY}px` }}
          >
            {snapshot.from === 'home' ? (
              <HomeView stage={stage} stageProps={{}} />
            ) : (
              <Suspense fallback={null}>
                <LabView />
              </Suspense>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
