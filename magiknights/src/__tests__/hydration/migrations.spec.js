import { describe, it, expect } from 'vitest'
import { hydrateSheetFromRaw } from './helpers.js'

// Pin the legacy-payload compatibility branches inside sheetStore.hydrate so
// they aren't accidentally removed.

describe('studied → studiedCombat migration', () => {
  // sheetStore.js:2208 falls back from `studied` (old) to `studiedCombat` (new).
  it('hydrates studiedCombat from the legacy `studied` key', () => {
    const s = hydrateSheetFromRaw({ studied: true })
    expect(s.studiedCombat).toBe(true)
  })

  it('prefers the new studiedCombat key when both are present', () => {
    const s = hydrateSheetFromRaw({ studied: false, studiedCombat: true })
    expect(s.studiedCombat).toBe(true)
  })
})

describe('armor_weave name-only legacy format', () => {
  // sheetStore.js:1860-1868: if the payload lacks `selected`, the hydrator
  // tries to match the stored name against armorWeaveData and assigns the
  // matching key, falling back to 'custom'.
  it('matches a compendium name to its weave key', () => {
    const s = hydrateSheetFromRaw({
      armor_weave: {
        name: 'Phoenix Imbued Weave',
        description: '',
        collapsed: true,
      },
    })
    expect(s.armor_weave.selected).toBe('phoenix')
    expect(s.armor_weave.name).toBe('Phoenix Imbued Weave')
  })

  it('falls back to `custom` for an unknown name', () => {
    const s = hydrateSheetFromRaw({
      armor_weave: {
        name: 'Homemade Patchwork',
        description: '',
        collapsed: true,
      },
    })
    expect(s.armor_weave.selected).toBe('custom')
    expect(s.armor_weave.name).toBe('Homemade Patchwork')
  })

  it('prefers an explicit `selected` over name-matching', () => {
    const s = hydrateSheetFromRaw({
      armor_weave: {
        selected: 'singing',
        name: 'Phoenix Imbued Weave', // intentionally mismatched
        description: '',
        collapsed: true,
      },
    })
    expect(s.armor_weave.selected).toBe('singing')
  })
})

describe('safeHydrateArray compatibility paths', () => {
  // sheetStore.js:1960-1980. Exercise the `$__$`-prefixed JSON string form
  // and the Firebase numeric-keyed object form via the eclipse arrays.
  it('parses a $__$-prefixed JSON string into an array', () => {
    const s = hydrateSheetFromRaw({
      eclipse: '$__$' + JSON.stringify([3, 2, 1, 0, 0, 0, 0, 0]),
    })
    expect(s.eclipse).toEqual([3, 2, 1, 0, 0, 0, 0, 0])
  })

  it('parses a numeric-keyed object form into an array', () => {
    const s = hydrateSheetFromRaw({
      eclipse_blips: { 0: 1, 1: 2, 2: 3, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
    })
    expect(s.eclipse_blips).toEqual([1, 2, 3, 0, 0, 0, 0, 0])
  })

  it('parses a $__$-prefixed npc_traits payload', () => {
    const traits = [
      { _id: 't1', name: 'Pack Tactics', description: '' },
      { _id: 't2', name: 'Keen Smell', description: '' },
    ]
    const s = hydrateSheetFromRaw({
      npc_traits: '$__$' + JSON.stringify(traits),
    })
    expect(s.npc_traits).toEqual(traits)
  })
})
