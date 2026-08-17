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
    expect(nav.className).toMatch(/min-\[1450px\]:block/)
    expect(nav.className).toMatch(/fixed/)
  })

  it('marks the visible section as current when the observer reports it', () => {
    render(<Page />)
    const io = global.IntersectionObserverInstances.at(-1)
    const target = document.getElementById('experience').closest('section')
    act(() => io.callback([{ isIntersecting: true, target }]))
    const active = screen.getByRole('link', { name: /experience/i })
    expect(active).toHaveAttribute('aria-current', 'true')
    // Exactly one current item.
    expect(document.querySelectorAll('[aria-current="true"]').length).toBe(1)
    // The travelling indicator exists and is positioned.
    expect(document.querySelector('[data-rail-indicator]')).not.toBeNull()
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
