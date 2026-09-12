import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, act } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import App from '../App'
import { AtriumPlane } from '../components/ui/AtriumPlane'

const useTheme = (id) => {
  localStorage.setItem('3dport-theme-v2', id)
  delete document.documentElement.dataset.theme
}

// Each signature layer mounts only under its own theme. Asserting the absence
// as well as the presence is the point: four overlays live in App at once, and
// a leak would put a delivery rail on somebody else's theme.
describe('signature layers are mutually exclusive', () => {
  const layers = {
    order: 'order-grid',
    throughput: 'throughput-rail',
    signal: 'signal-rail',
  }

  Object.entries(layers).forEach(([theme, testId]) => {
    it(`mounts only the ${theme} layer under the ${theme} theme`, () => {
      useTheme(theme)
      render(<App />)
      expect(screen.getByTestId(testId)).toBeInTheDocument()
      Object.values(layers)
        .filter((other) => other !== testId)
        .forEach((other) => expect(screen.queryByTestId(other)).toBeNull())
    })
  })

  it('mounts no signature layer under an original theme', () => {
    useTheme('quiet')
    render(<App />)
    Object.values(layers).forEach((id) => expect(screen.queryByTestId(id)).toBeNull())
  })
})

describe('Order experience', () => {
  beforeEach(() => {
    useTheme('order')
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('draws the drafting grid and opens with the scattered cards', () => {
    render(<App />)
    expect(screen.getByTestId('order-grid')).toBeInTheDocument()
    expect(screen.getByTestId('order-cards')).toBeInTheDocument()
  })

  it('clears the opening cards once they have landed, leaving the grid', () => {
    render(<App />)
    act(() => vi.advanceTimersByTime(2000))
    // The gesture is transient by design: it must not stay in the DOM over the
    // reader for the rest of the visit.
    expect(screen.queryByTestId('order-cards')).toBeNull()
    expect(screen.getByTestId('order-grid')).toBeInTheDocument()
  })

  it('keeps sections bordered — the grid supplies structure, not the rhythm', () => {
    render(<App />)
    expect(document.getElementById('experience').closest('section').className).toMatch(/border-b/)
  })
})

describe('Throughput experience', () => {
  beforeEach(() => useTheme('throughput'))

  it('states the real delivered-projects figure, not an invented one', () => {
    render(<App />)
    const rail = screen.getByTestId('throughput-rail')
    expect(rail.textContent).toMatch(/of 65 projects delivered end to end/)
  })

  it('labels all four delivery lanes', () => {
    render(<App />)
    const rail = screen.getByTestId('throughput-rail')
    ;['Intake', 'Build', 'Review', 'Shipped'].forEach((lane) =>
      expect(rail.textContent).toContain(lane)
    )
  })

  it('hides the rail from assistive tech — the proof bar already states the numbers', () => {
    render(<App />)
    expect(screen.getByTestId('throughput-rail').querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})

describe('Signal experience', () => {
  beforeEach(() => useTheme('signal'))

  it('raises every mapped section onto a lit panel or a recessed deck', () => {
    render(<App />)
    const surfaceOf = (id) => document.getElementById(id).closest('[data-surface]').dataset.surface
    expect(surfaceOf('initiatives')).toBe('panel')
    expect(surfaceOf('case-studies')).toBe('panel')
    expect(surfaceOf('portfolio')).toBe('deck')
    expect(surfaceOf('contact')).toBe('deck')
  })

  it('shows only figures the site already claims elsewhere', () => {
    render(<App />)
    const rail = screen.getByTestId('signal-rail')
    expect(rail.textContent).toContain('20–28')
    expect(rail.textContent).toContain('65')
    expect(rail.textContent).toContain('15')
  })
})

describe('Atrium experience', () => {
  beforeEach(() => useTheme('atrium'))

  it('puts every section on a plane inside one shared 3D stage', () => {
    render(<App />)
    // One stage: separate perspectives would read as unrelated tilting cards.
    expect(document.getElementById('main').className).toMatch(/atrium-stage/)
    expect(document.getElementById('experience').closest('.atrium-plane')).not.toBeNull()
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
