import { describe, it, expect } from 'vitest'
import { screen, act } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { SectionNavigator, SECTIONS } from './SectionNavigator'

// The navigator looks sections up in the document, so give it real anchors.
function Page() {
  return (
    <div>
      {SECTIONS.map(({ id }) => (
        <section key={id}>
          <p id={id} />
        </section>
      ))}
      <SectionNavigator />
    </div>
  )
}

describe('SectionNavigator', () => {
  it('maps every real section as a numbered link — a 2-second overview of the page', () => {
    render(<Page />)
    const nav = screen.getByRole('navigation', { name: /section/i })
    const links = nav.querySelectorAll('a')
    expect(links.length).toBe(SECTIONS.length)
    SECTIONS.forEach(({ id, label }, i) => {
      const link = screen.getByRole('link', { name: new RegExp(label, 'i') })
      expect(link).toHaveAttribute('href', `#${id}`)
      expect(link.textContent).toContain(String(i + 1).padStart(2, '0'))
    })
  })

  it('stays a subtle desktop-only layer — hidden where it would overlap content', () => {
    render(<Page />)
    const nav = screen.getByRole('navigation', { name: /section/i })
    expect(nav.className).toMatch(/hidden/)
    // Compact (numbers-only) from 1440px — a 15.6" laptop at 125% scaling is
    // a 1536px viewport and must still get the trail; full labels from 1680px.
    expect(nav.className).toMatch(/min-\[1440px\]:block/)
    const label = nav.querySelector('.section-rail-label')
    expect(label.className).toMatch(/\bhidden\b/)
    expect(label.className).toMatch(/min-\[1680px\]:inline/)
    // Numbers-only stops stay identifiable to assistive tech and on hover.
    expect(nav.querySelector('a[aria-label]')).not.toBeNull()
    expect(nav.className).toMatch(/fixed/)
    nav.querySelectorAll('.section-rail-label').forEach((label) => {
      expect(label.className).not.toMatch(/max-w-0|opacity-0/)
    })
  })

  it('marks the visible section as current when the observer reports it', () => {
    render(<Page />)
    const io = global.IntersectionObserverInstances.at(-1)
    const target = document.getElementById('experience').closest('section')
    act(() => io.callback([{ isIntersecting: true, target }]))
    const active = screen.getByRole('link', { name: /experience/i })
    expect(active).toHaveAttribute('aria-current', 'true')
    // The active link shifts slightly left without hiding any map labels.
    expect(active.className).toMatch(/(^|\s)translate-x-1(\s|$)/)
    // Exactly one current item — and no indicator dash (removed by request).
    expect(document.querySelectorAll('[aria-current="true"]').length).toBe(1)
    expect(document.querySelector('[data-rail-indicator]')).toBeNull()
    expect(active.querySelector('.section-rail-label').className).toMatch(/border-accent/)
  })

  it('moves aria-current when another section takes over — no duplicates, no flicker', () => {
    render(<Page />)
    const io = global.IntersectionObserverInstances.at(-1)
    const sec = (id) => document.getElementById(id).closest('section')
    act(() => io.callback([{ isIntersecting: true, target: sec('initiatives') }]))
    act(() =>
      io.callback([
        { isIntersecting: false, target: sec('initiatives') },
        { isIntersecting: true, target: sec('portfolio') },
      ])
    )
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('aria-current', 'true')
    expect(document.querySelectorAll('[aria-current="true"]').length).toBe(1)
  })
})
