import { describe, it, expect, vi, afterEach } from 'vitest'
import { scrollToSection } from './scrollToSection'

const build = ({ sectionTop = 500, headerHeight = 73, scrollY = 200 } = {}) => {
  document.body.innerHTML = `
    <header class="site-header"></header>
    <section><div><h2 id="tools">Tools</h2></div></section>`
  Object.defineProperty(document.querySelector('.site-header'), 'offsetHeight', {
    value: headerHeight,
    configurable: true,
  })
  document.querySelector('section').getBoundingClientRect = () => ({ top: sectionTop })
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true })
  window.scrollTo = vi.fn()
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('scrollToSection', () => {
  it('lands the enclosing section under the measured header, from layout position', () => {
    build()
    expect(scrollToSection('tools')).toBe(true)
    // 500 (section top) + 200 (scrollY) - (73 header + 12 gap) = 615
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 615, behavior: 'auto' })
  })

  it('never scrolls to a negative position', () => {
    build({ sectionTop: -400, scrollY: 0 })
    scrollToSection('tools')
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('uses instant behavior for hash loads', () => {
    build()
    scrollToSection('tools', { instant: true })
    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'instant' }))
  })

  it('reports a missing target so callers can fall back to native behavior', () => {
    build()
    expect(scrollToSection('nope')).toBe(false)
  })
})
