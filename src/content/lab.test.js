import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { featuredLabProjects, labPage, labProjects, professionalWork } from './lab'

describe('Lab content', () => {
  it('carries the five agreed personal projects in editorial order', () => {
    expect(labProjects.map((project) => project.title)).toEqual([
      'Ako may lesson plan na!',
      'The Way',
      'OneDayOS',
      'ReadWell',
      'Stopcounter',
    ])
    expect(featuredLabProjects.map((project) => project.title)).toEqual([
      'Ako may lesson plan na!',
      'The Way',
    ])
  })

  it('states unfinished boundaries instead of implying production readiness', () => {
    const lesson = labProjects.find((project) => project.id === 'ako-may-lesson-plan-na')
    const onedayos = labProjects.find((project) => project.id === 'onedayos')
    expect(lesson.status).toBe('Pre-launch')
    expect(lesson.buildNote).toMatch(/deliberately gated/i)
    expect(onedayos.status).toBe('Active build')
    expect(onedayos.buildNote).toMatch(/first and only business module/i)
    expect(onedayos.liveUrl).toBeUndefined()
    expect(onedayos.projectUrl).toMatch(/^https:\/\/github\.com\/jc-delizo\/onedayos/)
  })

  it('links only published source evidence and advertises only real live URLs', () => {
    const published = labProjects.filter((project) => project.sourceUrl)
    expect(published).toHaveLength(5)
    published.forEach((project) => expect(project.sourceUrl).toMatch(/^https:\/\/github\.com\/jc-delizo\//))
    labProjects.filter((project) => project.liveUrl).forEach((project) => {
      expect(project.liveUrl).toMatch(/^https:\/\//)
    })
    const onedayos = labProjects.find((project) => project.id === 'onedayos')
    expect(onedayos.sourceUrl).toMatch(/\/src\/modules\/inventory$/)
  })

  it('keeps employer work anonymized and outside the personal-project list', () => {
    expect(labProjects.map((project) => project.title)).not.toContain(professionalWork.title)
    expect(professionalWork.label).toMatch(/Professional work.*Confidential/i)
    expect(professionalWork.body).toMatch(/anonymized systems case study/i)
    expect(professionalWork.note).toMatch(/Proprietary name/i)
  })

  it('ships every project visual within a compact asset budget', () => {
    labProjects.forEach((project) => {
      expect(project.images).toHaveLength(project.id === 'stopcounter' ? 2 : 5)
      project.images.forEach((image) => {
        const relativePath = image.src.replace(import.meta.env.BASE_URL, '')
        const file = resolve(__dirname, '../../public', relativePath)
        expect(existsSync(file), `${project.title}: ${image.label}`).toBe(true)
        expect(statSync(file).size, `${project.title}: ${image.label}`).toBeLessThanOrEqual(90 * 1024)
      })
    })
  })

  it('keeps the Lab description concise enough for search previews', () => {
    expect(labPage.meta.description.length).toBeLessThanOrEqual(160)
  })
})
