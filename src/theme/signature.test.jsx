import { describe, it, expect, beforeEach } from 'vitest'
import { screen, act } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import App from '../App'
import { AtriumPlane } from '../components/ui/AtriumPlane'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const useTheme = (id) => {
  localStorage.setItem('3dport-theme-v3', id)
  delete document.documentElement.dataset.theme
}

describe('Atrium experience', () => {
  beforeEach(() => useTheme('atrium'))

  it('puts every section on a plane inside one shared 3D stage', () => {
    render(<App />)
    // One stage: separate perspectives would read as unrelated tilting cards.
    expect(document.getElementById('main').className).toMatch(/atrium-stage/)
    expect(document.getElementById('experience').closest('.atrium-plane')).not.toBeNull()
  })

  it('adds no stage class under other themes', () => {
    useTheme('quiet')
    render(<App />)
    expect(document.getElementById('main').className).not.toMatch(/atrium-stage/)
    expect(document.querySelector('.atrium-plane')).toBeNull()
  })

  it('starts a plane tipped away and settles it flat once it intersects', () => {
    render(<AtriumPlane data-testid="plane">content</AtriumPlane>)
    const plane = screen.getByTestId('plane')
    expect(plane.dataset.depth).toBe('far')

    const io = global.IntersectionObserverInstances.at(-1)
    act(() => io.callback([{ isIntersecting: true }]))
    expect(plane.dataset.depth).toBe('near')
  })

  it('settles to the resting depth where IntersectionObserver is unavailable', () => {
    // Progressive enhancement: without the observer the reader must get flat,
    // readable planes rather than a page permanently tipped away from them.
    const saved = global.IntersectionObserver
    delete global.IntersectionObserver
    try {
      render(<AtriumPlane data-testid="plane">content</AtriumPlane>)
      expect(screen.getByTestId('plane').dataset.depth).toBe('near')
    } finally {
      global.IntersectionObserver = saved
    }
  })
})

describe('Atrium depth hierarchy', () => {
  beforeEach(() => useTheme('atrium'))

  it('raises the selling sections and recesses the utility ones', () => {
    render(<App />)
    const planeOf = (id) => document.getElementById(id).closest('.atrium-plane')
    expect(planeOf('case-studies').dataset.elev).toBe('raised')
    expect(planeOf('initiatives').dataset.elev).toBe('raised')
    expect(planeOf('certifications').dataset.elev).toBe('recessed')
    // Unmapped sections rest at zero — no attribute at all.
    expect(planeOf('experience').dataset.elev).toBeUndefined()
  })
})

describe('Atrium projection safety (the hover-divergence regression)', () => {
  // Root cause of 2026-09-14's broken tool hover: perspective declared on the
  // page-height stage put the vanishing point ~6,000px off-screen, and planes
  // resting at non-zero Z diverged visually from hit-test geometry. The
  // contract: perspective is per-section, and every persistent (resting)
  // effect is 2D — 3D transforms may only be transient.
  const css = readFileSync(resolve(__dirname, '../index.css'), 'utf-8')

  it('declares perspective on the per-section cell, never on the page-height stage', () => {
    expect(css).toMatch(/\.atrium-cell\s*{[^}]*perspective:/)
    const stage = css.match(/\[data-theme='atrium'\] \.atrium-stage\s*{([^}]*)}/)
    if (stage) expect(stage[1]).not.toMatch(/perspective/)
  })

  it('expresses elevation as 2D scale — wide screens only — and never translateZ', () => {
    const blocks = [...css.matchAll(/\[data-elev='(?:raised|recessed)'\]\s*{([^}]*)}/g)].map((m) => m[1])
    expect(blocks.length).toBeGreaterThanOrEqual(2)
    expect(blocks.join('')).not.toMatch(/translateZ|--elev:/)
    // The width differential is a >=1680px effect; smaller screens keep all
    // planes one width (JC, 2026-09-15) — so the scale vars must live inside
    // the min-width media query, not in the base rules.
    const wide = css.slice(css.indexOf('@media (min-width: 1680px)'))
    expect(wide).toMatch(/\[data-elev='raised'\]\s*{[^}]*--elev-scale:\s*1\.015/)
    expect(wide).toMatch(/\[data-elev='recessed'\]\s*{[^}]*--elev-scale:\s*0\.985/)
    const base = css.slice(0, css.indexOf('@media (min-width: 1680px)'))
    const baseValues = [...base.matchAll(/--elev-scale:\s*([\d.]+)/g)].map((m) => m[1])
    baseValues.forEach((v) => expect(v, 'base elevation scale must be neutral').toBe('1'))
  })
})

describe('Atrium stage direction', () => {
  beforeEach(() => {
    useTheme('atrium')
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    )
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
    delete navigator.connection
  })

  it('plays the entrance dolly: one deep frame, then arrival releases the planes', () => {
    vi.useFakeTimers()
    render(<App />)
    expect(document.getElementById('main').dataset.arrived).toBe('false')
    act(() => vi.advanceTimersByTime(200))
    expect(document.getElementById('main').dataset.arrived).toBe('true')
  })

  it('skips the dolly for reduced motion — the room starts composed', () => {
    matchMedia.mockImplementation((q) => ({
      matches: q.includes('prefers-reduced-motion'),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    render(<App />)
    expect(document.getElementById('main').dataset.arrived).toBe('true')
  })

  it('skips the dolly and the decorative backdrop on data-saver connections', () => {
    Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true })
    render(<App />)
    expect(document.getElementById('main').dataset.arrived).toBe('true')
    expect(document.querySelector('.drafting-layer, [data-testid="backdrop"]')).toBeNull()
  })

  it('drives the cursor parallax vars from pointer position on fine pointers', () => {
    // rAF must be faked explicitly — vitest's default toFake list omits it,
    // and the parallax write is rAF-coalesced.
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'],
    })
    matchMedia.mockImplementation((q) => ({
      matches: q === '(pointer: fine)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    const { unmount } = render(<App />)
    act(() => {
      window.dispatchEvent(new MouseEvent('pointermove', { clientX: window.innerWidth, clientY: 0 }))
      vi.advanceTimersByTime(32) // let the rAF-coalesced write land
    })
    const root = document.documentElement
    expect(root.style.getPropertyValue('--par-x')).not.toBe('')
    // Unmount must sweep the vars — they are stage props, not page state.
    unmount()
    expect(root.style.getPropertyValue('--par-x')).toBe('')
  })
})
