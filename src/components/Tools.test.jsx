import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { Tools, TOOL_BRANDS, brandForeground } from './Tools'
import { site } from '../content/site'

const ALL_TOOLS = site.tools.flatMap((g) => g.items)

describe('Tools', () => {
  it('renders every group and every tool chip', () => {
    render(<Tools />)
    site.tools.forEach(({ group }) => expect(screen.getByText(group)).toBeInTheDocument())
    ALL_TOOLS.forEach((tool) => expect(screen.getByText(tool)).toBeInTheDocument())
  })

  it('gives every tool a hover brand color via per-chip custom properties', () => {
    render(<Tools />)
    ALL_TOOLS.forEach((tool) => {
      expect(TOOL_BRANDS[tool], tool).toMatch(/^#[0-9A-F]{6}$/i)
      const chip = screen.getByText(tool).closest('li')
      expect(chip.className).toMatch(/tool-chip/)
      expect(chip.style.getPropertyValue('--brand')).toBe(TOOL_BRANDS[tool])
      expect(chip.style.getPropertyValue('--brand-fg')).toBe(brandForeground(TOOL_BRANDS[tool]))
    })
    // No orphan brand entries for tools that no longer exist.
    Object.keys(TOOL_BRANDS).forEach((k) => expect(ALL_TOOLS).toContain(k))
  })

  it('picks a readable foreground: dark on light brands, white on dark brands', () => {
    expect(brandForeground('#61DAFB')).toBe('#0D0D0D') // React cyan
    expect(brandForeground('#FF9900')).toBe('#0D0D0D') // AWS orange
    expect(brandForeground('#0052CC')).toBe('#FFFFFF') // Jira blue
    expect(brandForeground('#000000')).toBe('#FFFFFF')
  })
})
