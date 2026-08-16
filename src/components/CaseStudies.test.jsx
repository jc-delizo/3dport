import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import userEvent from '@testing-library/user-event'
import { CaseStudies } from './CaseStudies'
import { site } from '../content/site'
import { findForbidden } from '../content/forbidden'

describe('CaseStudies cards', () => {
  it('shows each study as a teaser: title, summary, stat tiles, View details', () => {
    render(<CaseStudies />)
    site.caseStudies.forEach(({ title, summary, stats }) => {
      expect(screen.getByRole('heading', { name: title, level: 3 })).toBeInTheDocument()
      expect(screen.getByText(summary)).toBeInTheDocument()
      stats.forEach(({ label }) => expect(screen.getByText(label)).toBeInTheDocument())
    })
    expect(screen.getAllByRole('button', { name: /view diagram/i })).toHaveLength(2)
    // Side-by-side on desktop.
    expect(document.querySelector('.grid').className).toMatch(/md:grid-cols-2/)
    // Deep content lives only in the overlay now.
    expect(screen.queryByText(site.caseStudies[0].timeline[0].title)).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('CaseStudies overlay', () => {
  it('opens as a full-screen reader with the deep dive, themed backdrop behind', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    const [first] = screen.getAllByRole('button', { name: /view diagram/i })
    await user.click(first)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    const study = site.caseStudies[0]
    study.timeline.forEach(({ title }) => expect(screen.getByText(title)).toBeInTheDocument())
    expect(screen.getByText(study.story[0])).toBeInTheDocument()
    expect(screen.getByText('Where it nearly derailed')).toBeInTheDocument()
    // Only the opened study's content renders.
    expect(screen.queryByText(site.caseStudies[1].timeline[0].title)).toBeNull()
    // The backdrop floods with the section's themed surface (lilac in Studio,
    // the default theme under test).
    expect(dialog.querySelector('[data-surface]')).not.toBeNull()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    const [first] = screen.getAllByRole('button', { name: /view diagram/i })
    await user.click(first)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    // Focus returns via requestAnimationFrame — wait a frame before asserting.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    expect(first).toHaveFocus()
  })

  it('closes via the close button', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    await user.click(screen.getAllByRole('button', { name: /view diagram/i })[0])
    await user.click(screen.getByRole('button', { name: /back to portfolio/i }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('gives the reader panel the main page width, with screen-corner controls', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    await user.click(screen.getAllByRole('button', { name: /view diagram/i })[0])
    // Panel matches .container-page (72rem) and must NOT sit inside the lilac
    // block's token scope — it portals to <body>, so its canvas is the page
    // white, not the section surface. (Regression: the panel rendered purple.)
    const panel = document.querySelector('.case-overlay-panel')
    expect(panel.className).toMatch(/max-w-\[72rem\]/)
    expect(panel.closest('section')).toBeNull()
    expect(panel.closest('[data-surface]')).toBeNull()
    // Back arrow pinned top-LEFT with an instant tooltip; prev/next bottom corners.
    const back = screen.getByRole('button', { name: /back to portfolio/i })
    expect(back.className).toMatch(/fixed/)
    expect(back.className).toMatch(/left-4/)
    expect(back.querySelector('span').textContent).toBe('Back to Portfolio')
    expect(screen.getByRole('button', { name: /previous case study/i }).className).toMatch(/fixed/)
    expect(screen.getByRole('button', { name: /next case study/i }).className).toMatch(/fixed/)
  })

  it('steps between studies with the next and previous controls, wrapping around', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    await user.click(screen.getAllByRole('button', { name: /view diagram/i })[0])
    expect(
      screen.getByRole('heading', { name: site.caseStudies[0].title, level: 2 })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next case study/i }))
    expect(
      screen.getByRole('heading', { name: site.caseStudies[1].title, level: 2 })
    ).toBeInTheDocument()
    expect(screen.queryByText(site.caseStudies[0].timeline[0].title)).toBeNull()

    // Two studies: next wraps back to the first.
    await user.click(screen.getByRole('button', { name: /next case study/i }))
    expect(
      screen.getByRole('heading', { name: site.caseStudies[0].title, level: 2 })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /previous case study/i }))
    expect(
      screen.getByRole('heading', { name: site.caseStudies[1].title, level: 2 })
    ).toBeInTheDocument()
  })

  it('renders the commit chart with peak label and accessible table in the AI study', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    await user.click(screen.getAllByRole('button', { name: /view diagram/i })[1])
    // The overlay portals to <body>, so query the document, not the container.
    expect(document.querySelector('.case-overlay-panel svg')).not.toBeNull()
    expect(screen.getAllByText('365').length).toBeGreaterThan(0)
    const table = document.querySelector('.case-overlay-panel table')
    expect(table).not.toBeNull()
    expect(table.querySelectorAll('tbody tr')).toHaveLength(7)
  })

  it('shows the inlined draw.io diagram with its native flow animation', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    await user.click(screen.getAllByRole('button', { name: /view diagram/i })[0])
    const diagramLabel = screen.getByText('System diagram')
    expect(diagramLabel).toBeInTheDocument()
    // The diagram leads the deep dive — the button promised one, so it is the
    // first thing after the stat tiles, before the timeline.
    const timelineLabel = screen.getByText('Timeline')
    expect(
      diagramLabel.compareDocumentPosition(timelineLabel) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    // The export ships its own ge-flow-animation inline styles.
    expect(
      document.querySelector('.case-overlay-panel [style*="ge-flow-animation"]')
    ).not.toBeNull()
    // Wide diagrams scroll in their own frame, on a fixed white ground.
    const frame = document.querySelector('.case-overlay-panel .diagram-frame')
    expect(frame.className).toMatch(/overflow-x-auto/)
    expect(frame.className).toMatch(/bg-white/)

    // Expandable: full-screen lightbox opens, Escape peels only that layer.
    await user.click(screen.getByRole('button', { name: /view full screen/i }))
    expect(screen.getByRole('dialog', { name: /system diagram/i })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: /system diagram/i })).toBeNull()
    expect(
      screen.getByRole('heading', { name: site.caseStudies[0].title, level: 2 })
    ).toBeInTheDocument()
  })

  it('leaks no internal codenames in either overlay', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    for (const i of [0, 1]) {
      await user.click(screen.getAllByRole('button', { name: /view diagram/i })[i])
      expect(findForbidden(document.body.textContent)).toEqual([])
      await user.keyboard('{Escape}')
    }
  })
})
