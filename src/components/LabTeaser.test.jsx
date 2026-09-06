import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme as render } from '../test/render'
import { LabTeaser } from './LabTeaser'
import { featuredLabProjects, labPage } from '../content/lab'

describe('LabTeaser', () => {
  it('shows only the two agreed homepage features and routes to the full Lab', () => {
    render(<LabTeaser />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
    featuredLabProjects.forEach((project) => {
      expect(screen.getByRole('heading', { name: project.title })).toBeInTheDocument()
    })
    expect(screen.queryByRole('heading', { name: 'OneDayOS' })).toBeNull()
    expect(screen.getByRole('link', { name: /explore all five projects/i })).toHaveAttribute(
      'href',
      labPage.url
    )
  })
})
