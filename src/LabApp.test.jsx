import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme as render } from './test/render'
import LabApp from './LabApp'
import { labProjects, professionalWork } from './content/lab'

describe('LabApp', () => {
  it('renders one page heading, five project articles, and the professional-work boundary', () => {
    render(<LabApp />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('article')).toHaveLength(5)
    labProjects.forEach((project) => {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: professionalWork.title })).toBeInTheDocument()
  })

  it('keeps OneDayOS honest while linking its now-public Inventory build', () => {
    render(<LabApp />)
    const heading = screen.getByRole('heading', { name: 'OneDayOS' })
    const article = heading.closest('article')
    expect(within(article).getByRole('link', { name: /visit build/i })).toHaveAttribute(
      'href',
      expect.stringContaining('github.com/jc-delizo/onedayos')
    )
    expect(within(article).getByRole('link', { name: /source/i })).toHaveAttribute(
      'href',
      expect.stringContaining('/src/modules/inventory')
    )
    expect(within(article).getAllByText(/Synthetic data/i).length).toBeGreaterThan(0)
  })

  it('opens directly with a compact project constellation and uncluttered carousels', () => {
    render(<LabApp />)
    expect(screen.getByRole('heading', { name: 'Make. Ship. Learn.' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /five project signals/i })).toBeInTheDocument()
    expect(screen.queryByText(/AI is part of the toolchain/i)).toBeNull()
    labProjects.forEach((project) => {
      const article = screen.getByRole('heading', { name: project.title }).closest('article')
      expect(within(article).getByRole('button', { name: `Previous ${project.title} screenshot` }))
        .toBeInTheDocument()
      expect(within(article).getByRole('button', { name: `Next ${project.title} screenshot` }))
        .toBeInTheDocument()
      expect(screen.queryByLabelText(`${project.title} screenshots`)).toBeNull()
      expect(project.images).toHaveLength(project.id === 'stopcounter' ? 2 : 5)
    })
  })

  it('lets a visitor switch a project gallery without leaving the page', async () => {
    const user = userEvent.setup()
    render(<LabApp />)
    const article = screen.getByRole('heading', { name: 'Ako may lesson plan na!' }).closest('article')
    await user.click(within(article).getByRole('button', { name: 'Next Ako may lesson plan na! screenshot' }))
    expect(
      within(article).getByRole('img', { name: /searchable catalog with curriculum/i })
    ).toBeInTheDocument()
  })

  it('links employer work only to the anonymized portfolio case study', () => {
    render(<LabApp />)
    const link = screen.getByRole('link', { name: /read the anonymized case study/i })
    expect(link).toHaveAttribute('href', professionalWork.href)
    expect(screen.queryByRole('link', { name: /dtt/i })).toBeNull()
  })
})
