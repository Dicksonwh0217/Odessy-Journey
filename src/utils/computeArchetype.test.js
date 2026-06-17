import { describe, it, expect } from 'vitest'
import { computeArchetype } from './computeArchetype'

describe('computeArchetype', () => {
  it('returns driftingBuilder when builder keywords dominate', () => {
    expect(computeArchetype(['I love to build apps and code websites', '', '', '', '']))
      .toBe('driftingBuilder')
  })

  it('returns hiddenCreator when creator keywords dominate', () => {
    expect(computeArchetype(['I make video content and do storytelling', '', '', '', '']))
      .toBe('hiddenCreator')
  })

  it('returns searchingStrategist when strategist keywords dominate', () => {
    expect(computeArchetype(['I am confused about career money and my future direction', '', '', '', '']))
      .toBe('searchingStrategist')
  })

  it('returns driftingBuilder by default when no keywords match', () => {
    expect(computeArchetype(['hello world nothing here', '', '', '', '']))
      .toBe('driftingBuilder')
  })

  it('returns driftingBuilder when all answers are empty', () => {
    expect(computeArchetype(['', '', '', '', ''])).toBe('driftingBuilder')
  })

  it('returns archetype with highest keyword count when multiple match', () => {
    // driftingBuilder: build(1) code(1) = 2 hits
    // searchingStrategist: career(1) = 1 hit
    expect(computeArchetype(['build code career', '', '', '', '']))
      .toBe('driftingBuilder')
  })

  it('scans all 5 answers, not just the first', () => {
    expect(computeArchetype(['', '', '', '', 'I want to create a startup product']))
      .toBe('driftingBuilder')
  })
})
