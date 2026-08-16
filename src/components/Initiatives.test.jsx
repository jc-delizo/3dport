import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import userEvent from '@testing-library/user-event'
import { Initiatives } from './Initiatives'
import { site } from '../content/site'
import { findForbidden } from '../content/forbidden'

const cardButtons = () =>
  screen.getAllByRole('button', { name: /view (diagram & story|full story)/i })

describe('Initiatives cards', () => {
  it('renders all four as teasers — category, title, problem, view button; no accordion', () => {
    render(<Initiatives />)
    site.initiatives.forEach(({ title, category, problem }) => {
      expect(screen.getByRole('heading', { name: title, level: 3 })).toBeInTheDocument()
      expect(screen.getByText(category)).toBeInTheDocument()
      expect(screen.getByText(problem)).toBeInTheDocument()
    })
    expect(cardButtons()).toHaveLength(site.initiatives.length)
    // Three cards now carry diagrams and promise them in their button labels.
    expect(screen.getAllByRole('button', { name: /view diagram & story/i })).toHaveLength(3)
    // Nothing deep renders until an overlay opens.
    expect(screen.queryByText('Approach')).toBeNull()
    expect(screen.queryByText('Outcome')).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('Initiatives overlay', () => {
  it('shows the back arrow top-left with its instant tooltip', async () => {
    const user = userEvent.setup()
    render(<Initiatives />)
    await user.click(cardButtons()[0])
    const back = screen.getByRole('button', { name: /back to portfolio/i })
    expect(back.className).toMatch(/left-4/)
    expect(back.querySelector('span').textContent).toBe('Back to Portfolio')
  })

  it('opens the full story like a case study — diagram leading, then approach and outcome', async () => {
    const user = userEvent.setup()
    render(<Initiatives />)
    await user.click(cardButtons()[0])

    const first = site.initiatives[0]
    expect(screen.getByRole('heading', { name: first.title, level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Problem')).toBeInTheDocument()
    expect(screen.getByText('Approach')).toBeInTheDocument()
    expect(screen.getByText('Outcome')).toBeInTheDocument()
    first.approach.forEach((point) => expect(screen.getByText(point)).toBeInTheDocument())
    expect(screen.getByText(first.outcome)).toBeInTheDocument()
    // scaling-delivery carries the process diagram inside its overlay.
    expect(document.querySelector('.case-overlay-panel .diagram-frame')).not.toBeNull()
  })

  it('shows the ERP rollout diagram inside its overlay', async () => {
    const user = userEvent.setup()
    render(<Initiatives />)
    await user.click(cardButtons()[1])
    expect(
      screen.getByRole('heading', { name: site.initiatives[1].title, level: 2 })
    ).toBeInTheDocument()
    expect(document.querySelector('.case-overlay-panel .diagram-frame')).not.toBeNull()
  })

  it('steps between initiatives with wrap-around prev/next', async () => {
    const user = userEvent.setup()
    render(<Initiatives />)
    await user.click(cardButtons()[0])

    await user.click(screen.getByRole('button', { name: /next initiative/i }))
    expect(
      screen.getByRole('heading', { name: site.initiatives[1].title, level: 2 })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /previous initiative/i }))
    await user.click(screen.getByRole('button', { name: /previous initiative/i }))
    expect(
      screen.getByRole('heading', { name: site.initiatives.at(-1).title, level: 2 })
    ).toBeInTheDocument()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<Initiatives />)
    const [first] = cardButtons()
    await user.click(first)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    expect(first).toHaveFocus()
  })

  it('expands the diagram full screen; Escape peels only that layer', async () => {
    const user = userEvent.setup()
    render(<Initiatives />)
    await user.click(cardButtons()[0])
    await user.click(screen.getByRole('button', { name: /view full screen/i }))
    expect(screen.getByRole('dialog', { name: /process diagram/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: /process diagram/i })).toBeNull()
    // The initiative overlay underneath is still open.
    expect(
      screen.getByRole('heading', { name: site.initiatives[0].title, level: 2 })
    ).toBeInTheDocument()
  })

  it('opens the Delivery Playbook above the overlay; Escape unwinds one layer at a time', async () => {
    const user = userEvent.setup()
    render(<Initiatives />)
    await user.click(cardButtons()[0])
    await user.click(screen.getByRole('button', { name: /read the delivery playbook/i }))
    expect(screen.getByRole('dialog', { name: /delivery playbook/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: /delivery playbook/i })).toBeNull()
    expect(
      screen.getByRole('heading', { name: site.initiatives[0].title, level: 2 })
    ).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('leaks no internal entity codenames across every overlay', async () => {
    const user = userEvent.setup()
    render(<Initiatives />)
    for (let i = 0; i < site.initiatives.length; i++) {
      await user.click(cardButtons()[i])
      expect(findForbidden(document.body.textContent)).toEqual([])
      await user.keyboard('{Escape}')
    }
  })
})
