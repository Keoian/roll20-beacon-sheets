import { describe, it, expect } from 'vitest'
import { roundTripSheet } from './helpers.js'

// Fields that are arrays or flat collections in dehydrate/hydrate. Each
// describe block targets one piece of state from sheetStore.js:2017-2154.

describe('eclipse / eclipse_blips round-trip', () => {
  // Both arrays are 8 slots. Dehydrate splats them; hydrate uses
  // hydrateEclipseBlipsArray + safeHydrateArray (sheetStore.js:2163-2166).
  it('eclipse values persist at specific indexes', () => {
    const next = [1, 0, 2, 0, 3, 0, 1, 0]
    const s = roundTripSheet((sheet) => { sheet.eclipse = [...next] })
    expect(s.eclipse).toEqual(next)
  })

  it('eclipse_blips values persist at specific indexes', () => {
    const next = [1, 2, 3, 0, 1, 2, 3, 0]
    const s = roundTripSheet((sheet) => { sheet.eclipse_blips = [...next] })
    expect(s.eclipse_blips).toEqual(next)
  })
})

describe('statIncreases round-trip', () => {
  it('preserves an array of stat-increase objects', () => {
    const entries = [
      { level: 3, type: 'single', ability: 'strength', amount: 2 },
      { level: 6, type: 'split', first: 'dexterity', second: 'wisdom' },
    ]
    const s = roundTripSheet((sheet) => {
      sheet.statIncreases = entries.map((e) => ({ ...e }))
    })
    expect(s.statIncreases).toEqual(entries)
  })

  it('empty statIncreases round-trips as empty', () => {
    const s = roundTripSheet((sheet) => { sheet.statIncreases = [] })
    expect(s.statIncreases).toEqual([])
  })
})

describe('conditions round-trip', () => {
  // conditions is a ref holding a plain object of booleans. Hydrate
  // reconstructs it using the keys already in state, so unknown keys would be
  // dropped — stick to the defined 20-condition surface (sheetStore.js:156).
  const allConditionKeys = [
    'distressed', 'horrified', 'berserk',
    'bleeding', 'burning', 'disoriented', 'exposed', 'paralyzed', 'prone', 'restrained', 'unconscious',
    'depleted', 'drained', 'poisoned', 'silenced',
    'soulSiphoned1', 'soulSiphoned2', 'soulSiphoned3', 'soulSiphoned4',
    'soulTainted',
  ]

  it.each(allConditionKeys)('%s flag persists when toggled on', (key) => {
    const s = roundTripSheet((sheet) => { sheet.conditions[key] = true })
    expect(s.conditions[key]).toBe(true)
  })

  it('multiple conditions can round-trip simultaneously without flipping neighbors', () => {
    const s = roundTripSheet((sheet) => {
      sheet.conditions.bleeding = true
      sheet.conditions.prone = true
      sheet.conditions.drained = true
    })
    expect(s.conditions.bleeding).toBe(true)
    expect(s.conditions.prone).toBe(true)
    expect(s.conditions.drained).toBe(true)
    expect(s.conditions.burning).toBe(false)
  })
})

describe('resistModifiers round-trip', () => {
  const types = ['physical', 'magic', 'horror', 'purity']

  it.each(types)('%s advantage toggle persists', (type) => {
    const s = roundTripSheet((sheet) => { sheet.resistModifiers[type].advantage = true })
    expect(s.resistModifiers[type].advantage).toBe(true)
  })

  it.each(types)('%s disadvantage toggle persists', (type) => {
    const s = roundTripSheet((sheet) => { sheet.resistModifiers[type].disadvantage = true })
    expect(s.resistModifiers[type].disadvantage).toBe(true)
  })
})

describe('combatFormMastery round-trip', () => {
  const formKeys = [
    'formI', 'formII', 'formIII', 'formIV', 'formV',
    'formVI', 'formVII', 'formVIII', 'formIX', 'formX',
  ]

  it.each(formKeys)('%s mastery flag persists', (key) => {
    const s = roundTripSheet((sheet) => { sheet.combatFormMastery[key] = true })
    expect(s.combatFormMastery[key]).toBe(true)
  })
})

describe('releaseMagicDeck round-trip', () => {
  // Dehydrate writes card objects under release_magic_deck; hydrate requires
  // Array.isArray to replace the whole deck (sheetStore.js:2222-2224).
  it('persists card location assignments', () => {
    const deck = [
      { id: 'king', name: 'King', location: 'hand' },
      { id: 'queen', name: 'Queen', location: 'discard' },
      { id: 'knight', name: 'Knight', location: 'removed' },
    ]
    const s = roundTripSheet((sheet) => {
      sheet.releaseMagicDeck = deck.map((c) => ({ ...c }))
    })
    expect(s.releaseMagicDeck).toEqual(deck)
  })
})
