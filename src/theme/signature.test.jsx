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
