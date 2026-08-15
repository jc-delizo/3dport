import { describe, it, expect } from 'vitest'
import { playbook } from './playbook'
import { findForbidden } from './forbidden'

describe('playbook content', () => {
  it('leaks no internal codenames', () => {
    expect(findForbidden(JSON.stringify(playbook))).toEqual([])
  })

  it('keeps the full structure: 7 stages, 4 ceremonies, 4 governance steps, 3 models', () => {
    expect(playbook.stages).toHaveLength(7)
    expect(playbook.ceremonies).toHaveLength(4)
    expect(playbook.governance.steps).toHaveLength(4)
    expect(playbook.models).toHaveLength(3)
    playbook.stages.forEach((s) => {
      expect(s.title).toBeTruthy()
      expect(s.artifacts.length).toBeGreaterThan(1)
    })
  })

  it('matches the site: projects as the delivery unit, eight people on the team', () => {
    const text = JSON.stringify(playbook)
    expect(text).not.toMatch(/\bsystems?\s*(\/|a |per )\s*year/i)
    expect(text).not.toMatch(/65 systems/)
    expect(text).toContain('eight people')
    expect(playbook.results.stats.map((s) => s.value)).toEqual(['20–28', '65', '5–11', '22'])
  })
})
