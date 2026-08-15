import { describe, it, expect } from 'vitest'
import approvalSvg from './diagrams/approval.svg?raw'
import aiSvg from './diagrams/ai.svg?raw'
import processSvg from './diagrams/process.svg?raw'
import { findForbidden } from './forbidden'

const both = { approvalSvg, aiSvg, processSvg }

describe('draw.io diagram exports (sanitized outside the repo)', () => {
  it('leak nothing: no internal terms, no embedded mxfile, no raster label fallbacks', () => {
    Object.entries(both).forEach(([name, svg]) => {
      expect(findForbidden(svg), name).toEqual([])
      // The export's content attribute embeds the ENTIRE original diagram XML.
      expect(svg, name).not.toContain('mxfile')
      // Raster fallbacks carry the original names as pixels — must be gone.
      expect(svg, name).not.toContain('data:image')
    })
  })

  it('carry their own draw.io flow animation, ready to run inline', () => {
    Object.values(both).forEach((svg) => {
      expect(svg).toContain('@keyframes ge-flow-animation')
      expect(svg).toContain('foreignObject')
      expect(svg).not.toMatch(/<!DOCTYPE|<\?xml/)
    })
  })

  it('kept the public-safe titles', () => {
    expect(approvalSvg).toContain('How an Approval Travels')
    expect(aiSvg).toContain('AI Delivery Platform — How It All Connects')
    expect(processSvg).toContain('Project Management Process Flow')
  })
})
