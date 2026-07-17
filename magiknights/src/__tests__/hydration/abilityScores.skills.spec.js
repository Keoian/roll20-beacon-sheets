import { describe, test, expect } from 'vitest'
import { roundTripSheet } from './helpers.js'

// Ability scores live in a plain `abilityScores` object at
// src/stores/sheetStore.js:241 whose members are refs. Pinia wraps the store
// return value with reactive() which deeply unwraps nested refs, so tests
// reach through without `.value`. Sub-hydrators at lines 1741-1757.
const abilityNames = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
]

describe('abilityScores round-trip', () => {
  test.each(abilityNames)('%s score persists', (name) => {
    const s = roundTripSheet((sheet) => {
      sheet.abilityScores[name].score = 17
    })
    expect(s.abilityScores[name].score).toBe(17)
  })

  test('all six scores round-trip distinct values simultaneously', () => {
    const values = {
      strength: 15,
      dexterity: 16,
      constitution: 14,
      intelligence: 13,
      wisdom: 12,
      charisma: 11,
    }
    const s = roundTripSheet((sheet) => {
      for (const [name, value] of Object.entries(values)) {
        sheet.abilityScores[name].score = value
      }
    })
    for (const [name, value] of Object.entries(values)) {
      expect(s.abilityScores[name].score).toBe(value)
    }
  })
})

// 17 skills enumerated from skillDetails at src/stores/sheetStore.js:312-330.
// Each skill has {proficiency, ability, overrideValue} refs. Sub-hydrators at
// lines 1718-1738.
const skillNames = [
  'academic_arts',
  'athletics',
  'coordination',
  'creativity',
  'deception',
  'influence',
  'insight',
  'investigation',
  'leadership',
  'medicine',
  'mysticism',
  'perception',
  'performance',
  'persuasion',
  'purity',
  'stealth',
  'stem',
]

describe('skills round-trip', () => {
  test.each(skillNames)('%s proficiency flag persists', (name) => {
    const s = roundTripSheet((sheet) => {
      sheet.skills[name].proficiency = true
    })
    expect(s.skills[name].proficiency).toBe(true)
  })

  test.each(skillNames)('%s override value persists', (name) => {
    const s = roundTripSheet((sheet) => {
      sheet.skills[name].overrideValue = 12
    })
    expect(s.skills[name].overrideValue).toBe(12)
  })

  test('changing a skill ability selection round-trips', () => {
    // academic_arts permits both intelligence and wisdom.
    const s = roundTripSheet((sheet) => {
      sheet.skills.academic_arts.ability = 'wisdom'
    })
    expect(s.skills.academic_arts.ability).toBe('wisdom')
  })

  test('mixed mutations across several skills round-trip together', () => {
    const s = roundTripSheet((sheet) => {
      sheet.skills.athletics.proficiency = true
      sheet.skills.athletics.overrideValue = 15
      sheet.skills.stealth.proficiency = true
      sheet.skills.perception.overrideValue = 9
    })
    expect(s.skills.athletics.proficiency).toBe(true)
    expect(s.skills.athletics.overrideValue).toBe(15)
    expect(s.skills.stealth.proficiency).toBe(true)
    expect(s.skills.perception.overrideValue).toBe(9)
  })
})
