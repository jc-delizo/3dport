import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme as render } from '../test/render'
import { ScenarioPlaybook } from './ScenarioPlaybook'
import { scenarios } from '../content/scenarios'
import { site } from '../content/site'
import { findForbidden } from '../content/forbidden'

describe('scenario content', () => {
  it('gives every scenario plays, risks, and an evidence pointer to a real section', () => {
    expect(scenarios.items).toHaveLength(3)
    scenarios.items.forEach((s) => {
      expect(s.plays.length, s.id).toBeGreaterThanOrEqual(3)
      expect(s.risks.length, s.id).toBeGreaterThanOrEqual(3)
      // Evidence must point at a section the page actually has.
      expect(['#case-studies', '#initiatives']).toContain(s.evidence.href)
    })
  })

  it('carries no internal names', () => {
    expect(findForbidden(JSON.stringify(scenarios))).toEqual([])
    expect(findForbidden(JSON.stringify(site.now))).toEqual([])
  })
})

describe('ScenarioPlaybook', () => {
  it('renders as an accessible tablist with the first scenario open', () => {
    render(<ScenarioPlaybook />)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Greenfield build' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(scenarios.items[0].plays[0].title)
  })

  it('switches scenario on click and shows its plays, risks, and receipt', async () => {
    const user = userEvent.setup()
    render(<ScenarioPlaybook />)
    await user.click(screen.getByRole('tab', { name: 'Rescue mission' }))
    const rescue = scenarios.items.find((s) => s.id === 'rescue')
    const panel = screen.getByRole('tabpanel')
    rescue.plays.forEach(({ title }) => expect(panel).toHaveTextContent(title))
    rescue.risks.forEach(({ title }) => expect(panel).toHaveTextContent(title))
    expect(screen.getByRole('link', { name: new RegExp(rescue.evidence.label) })).toHaveAttribute(
      'href',
      rescue.evidence.href
    )
  })

  it('supports arrow-key navigation across tabs', async () => {
    const user = userEvent.setup()
    render(<ScenarioPlaybook />)
    screen.getByRole('tab', { name: 'Greenfield build' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Legacy replacement' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Legacy replacement' })).toHaveFocus()
  })

  it('opens the full delivery playbook overlay from the panel', async () => {
    const user = userEvent.setup()
    render(<ScenarioPlaybook />)
    await user.click(screen.getByRole('button', { name: /read the full playbook/i }))
    // The overlay repeats its title in the header bar; presence anywhere is the point.
    expect(screen.getAllByText('The Delivery Playbook').length).toBeGreaterThan(0)
  })
})
