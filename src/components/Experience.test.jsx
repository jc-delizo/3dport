import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import userEvent from '@testing-library/user-event'
import { Experience } from './Experience'
import { site } from '../content/site'

describe('Experience', () => {
  it('shows only the current Oak Drive role when collapsed', () => {
    render(<Experience />)
    const [current, ...earlier] = site.experience
    expect(screen.getByRole('heading', { name: current.company })).toBeInTheDocument()
    expect(screen.getByText(current.role)).toBeInTheDocument()
    earlier.forEach(({ company }) => {
      expect(screen.queryByRole('heading', { name: company })).toBeNull()
    })
  })

  it('reveals every earlier role via See more and hides them again via See less', async () => {
    const user = userEvent.setup()
    render(<Experience />)

    const toggle = screen.getByRole('button', { name: /\+ 4 earlier roles/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    site.experience.forEach(({ company, role, period }) => {
      expect(screen.getByRole('heading', { name: company })).toBeInTheDocument()
      expect(screen.getByText(role)).toBeInTheDocument()
      expect(screen.getByText(period)).toBeInTheDocument()
    })
    expect(toggle).toHaveTextContent(/show less/i)

    await user.click(toggle)
    expect(screen.queryByRole('heading', { name: site.experience[1].company })).toBeNull()
  })

  it('does not repeat the 10x figure proven elsewhere', async () => {
    const user = userEvent.setup()
    const { container } = render(<Experience />)
    await user.click(screen.getByRole('button', { name: /\+ 4 earlier roles/i }))
    expect(container.textContent).not.toMatch(/10×|10x/)
  })
})
