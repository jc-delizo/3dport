import { describe, it, expect } from 'vitest'
import { renderWithTheme as render } from '../../test/render'
import { Backdrop, BACKDROP_SETS } from './Backdrop'

describe('Backdrop', () => {
  it('renders a decorative fixed layer that can never intercept the pointer', () => {
    const { container } = render(<Backdrop />)
    const layer = container.querySelector('[data-backdrop]')
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer.className).toMatch(/pointer-events-none/)
    expect(layer.className).toMatch(/\bfixed\b/)
  })

  it('splits responsively: full sets on wide screens, one watermark below 1450px', () => {
    const { container } = render(<Backdrop />)
    container.querySelectorAll('[data-backdrop-set]').forEach((set) => {
      const desktop = set.querySelector('[data-backdrop-desktop]')
      expect(desktop.className).toMatch(/\bhidden\b/)
      expect(desktop.className).toMatch(/min-\[1450px\]:contents/)
      const watermarks = set.querySelectorAll('[data-backdrop-watermark]')
      expect(watermarks).toHaveLength(1)
      expect(watermarks[0].className).toMatch(/min-\[1450px\]:hidden/)
    })
  })

  it('sprinkles a few accent-colored glyphs — red pen marks on the blueprint', () => {
    const { container } = render(<Backdrop />)
    const accented = container.querySelectorAll('[data-glyph].text-accent')
    expect(accented.length).toBeGreaterThanOrEqual(3)
    // Accents stay rare: most glyphs remain ink.
    expect(accented.length).toBeLessThan(container.querySelectorAll('[data-glyph]').length / 3)
  })

  it('wraps every desktop glyph for cursor repel without touching the parallax wrapper', () => {
    const { container } = render(<Backdrop />)
    container.querySelectorAll('[data-backdrop-desktop] [data-glyph]').forEach((glyph) => {
      expect(glyph.querySelector('[data-repel] svg')).not.toBeNull()
    })
  })

  it('sizes every glyph from its wrapper, not the 300×150 svg fallback', () => {
    const { container } = render(<Backdrop />)
    container.querySelectorAll('svg').forEach((svg) => {
      expect(svg.getAttribute('class')).toMatch(/w-full/)
    })
  })

  it('renders one glyph set per configured section anchor', () => {
    const { container } = render(<Backdrop />)
    const sets = [...container.querySelectorAll('[data-backdrop-set]')]
    expect(sets.map((s) => s.dataset.backdropSet)).toEqual(BACKDROP_SETS.map((s) => s.anchor))
    sets.forEach((set) => expect(set.querySelectorAll('svg').length).toBeGreaterThan(0))
  })

  it('anchors are unique and point at real section ids used by the app', () => {
    const anchors = BACKDROP_SETS.map((s) => s.anchor)
    expect(new Set(anchors).size).toBe(anchors.length)
    // Spot-check the load-bearing ones; the full id list lives in the components.
    expect(anchors).toEqual(expect.arrayContaining(['approach', 'lifecycle', 'portfolio', 'contact']))
    // The hero stays clean — its glare sweep is the only motion there (JC's call).
    expect(anchors).not.toContain('top')
  })

  it('keeps every glyph in the left gutter — the right one belongs to the section trail', () => {
    BACKDROP_SETS.forEach(({ items }) =>
      items.forEach(({ className }) => {
        expect(className).toMatch(/left-\[/)
        expect(className).not.toMatch(/right-\[/)
      })
    )
  })

  it('draws every glyph as theme-tintable line art wired for stroke drawing', () => {
    const { container } = render(<Backdrop />)
    const svgs = [...container.querySelectorAll('svg')]
    expect(svgs.length).toBeGreaterThan(0)
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute('fill', 'none')
      expect(svg).toHaveAttribute('stroke', 'currentColor')
      // pathLength=1 normalizes stroke-dash drawing regardless of geometry,
      // so the GSAP draw-in never needs getTotalLength() per path.
      const drawables = svg.querySelectorAll('path, rect, circle, line, polyline, ellipse')
      expect(drawables.length).toBeGreaterThan(0)
      drawables.forEach((el) => expect(el).toHaveAttribute('pathLength', '1'))
    })
  })

  it('starts every set invisible so a no-JS render shows a clean page', () => {
    const { container } = render(<Backdrop />)
    const sets = [...container.querySelectorAll('[data-backdrop-set]')]
    sets.forEach((set) => expect(set.className).toMatch(/opacity-0/))
  })
})
