import { describe, it, expect, beforeEach } from 'vitest'
import { screen, act } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import App from '../App'
import { AtriumPlane } from '../components/ui/AtriumPlane'

const useTheme = (id) => {
  localStorage.setItem('3dport-theme-v2', id)
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
    expect(root.style.getPropertyValue('--par-ry')).not.toBe('')
    // Unmount must sweep the vars — they are stage props, not page state.
    unmount()
    expect(root.style.getPropertyValue('--par-ry')).toBe('')
  })
})
