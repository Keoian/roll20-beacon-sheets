import { describe, it, expect } from 'vitest'
import { roundTripSheet } from './helpers.js'

// hp / mp / shp round-trip through dehydrateHp / dehydrateMp / dehydrateShp at
// src/stores/sheetStore.js:1760-1798. Only current/temp (hp only) and the
// *_max_override refs are persisted — *_max themselves are computed and
// regenerate on hydrate.
//
// Pinia deeply unwraps nested refs, so tests set the unwrapped properties
// directly. Note: mp and shp do NOT have a `temp` field; only hp does.

describe('hp pool round-trip', () => {
  it('preserves current hp', () => {
    const s = roundTripSheet((sheet) => { sheet.hp.current = 23 })
    expect(s.hp.current).toBe(23)
  })

  it('preserves temp hp', () => {
    const s = roundTripSheet((sheet) => { sheet.hp.temp = 5 })
    expect(s.hp.temp).toBe(5)
  })

  it('preserves hp_max_override', () => {
    const s = roundTripSheet((sheet) => { sheet.hp_max_override = '99' })
    expect(s.hp_max_override).toBe('99')
  })

  it('clearing hp_max_override to empty string is preserved', () => {
    const cleared = roundTripSheet((sheet) => { sheet.hp_max_override = '' })
    expect(cleared.hp_max_override).toBe('')
  })
})

describe('mp pool round-trip', () => {
  it('preserves current mp', () => {
    const s = roundTripSheet((sheet) => { sheet.mp.current = 8 })
    expect(s.mp.current).toBe(8)
  })

  it('preserves mp_max_override', () => {
    const s = roundTripSheet((sheet) => { sheet.mp_max_override = '42' })
    expect(s.mp_max_override).toBe('42')
  })
})

describe('shp pool round-trip', () => {
  it('preserves current shp', () => {
    const s = roundTripSheet((sheet) => { sheet.shp.current = 6 })
    expect(s.shp.current).toBe(6)
  })

  it('preserves shp_max_override', () => {
    const s = roundTripSheet((sheet) => { sheet.shp_max_override = '20' })
    expect(s.shp_max_override).toBe('20')
  })
})
