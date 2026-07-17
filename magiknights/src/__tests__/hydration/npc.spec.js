import { describe, test, it, expect } from 'vitest'
import { roundTripSheet } from './helpers.js'

// NPC state defined at sheetStore.js:1253-1411 and
// dehydrated/hydrated at 2126-2154 / 2308-2366.

const npcScalarCases = [
  ['npc_sheet_type', 'squire'],
  ['npc_social_name', 'Captain Yrsa'],
  ['npc_social_role', 'Mentor'],
  ['npc_social_heart_stage', 'warm'],
  ['npc_social_sp', 8],
  ['npc_social_personality', 'Stoic but fair'],
  ['npc_social_abilities', 'Combat expertise'],
  ['npc_social_notes', 'Prefers tea over coffee'],
  ['npc_name', 'Gloom Hound'],
  ['npc_type', 'adversary'],
  ['npc_size', 'Large'],
  ['npc_creature_type', 'Beast'],
  ['npc_role', 'brute'],
  ['npc_armor', 15],
  ['npc_move', 40],
  ['npc_invasion_level', 3],
  ['npc_horrific_rating', '2d6'],
  ['npc_physical_check', 4],
  ['npc_magical_check', 2],
  ['npc_inert_spectral_energy', '2d6'],
  ['npc_whisper_rolls', true],
  ['npc_notes', 'Weak to fire'],
]

describe('NPC scalar fields round-trip', () => {
  test.each(npcScalarCases)('%s persists', (field, value) => {
    const s = roundTripSheet((sheet) => { sheet[field] = value })
    expect(s[field]).toEqual(value)
  })
})

describe('npc_hp round-trip', () => {
  it('preserves current and max', () => {
    const s = roundTripSheet((sheet) => {
      sheet.npc_hp = { current: 22, max: 35 }
    })
    expect(s.npc_hp).toEqual({ current: 22, max: 35 })
  })
})

describe('npc_horde_hp round-trip', () => {
  it('preserves all four horde units', () => {
    const horde = [
      { current: 10, max: 12, defeated: false },
      { current: 5, max: 12, defeated: false },
      { current: 0, max: 12, defeated: true },
      { current: 12, max: 12, defeated: false },
    ]
    const s = roundTripSheet((sheet) => {
      sheet.npc_horde_hp = horde.map((u) => ({ ...u }))
    })
    expect(s.npc_horde_hp).toEqual(horde)
  })
})

describe('npc_primary_attack round-trip', () => {
  it('preserves scalar fields and nested arrays', () => {
    const attack = {
      name: 'Claws',
      attackBonus: 6,
      attackDC: [14, 11, 8, 5],
      range: '5ft',
      damage: '2d6+3',
      hordeDamage: ['9', '7', '5', '3'],
      damageType: 'physical',
      special: 'Bleed on crit',
    }
    const s = roundTripSheet((sheet) => {
      sheet.npc_primary_attack = {
        ...attack,
        attackDC: [...attack.attackDC],
        hordeDamage: [...attack.hordeDamage],
      }
    })
    expect(s.npc_primary_attack).toEqual(attack)
  })
})

describe('npc_secondary_attack round-trip', () => {
  it('preserves scalar fields and nested arrays', () => {
    const attack = {
      name: 'Fire Breath',
      attackBonus: 4,
      attackDC: [16, 13, 10, 7],
      range: '30ft cone',
      damage: '3d6',
      hordeDamage: ['11', '9', '7', '5'],
      damageType: 'magical',
      special: 'DEX save for half',
    }
    const s = roundTripSheet((sheet) => {
      sheet.npc_secondary_attack = {
        ...attack,
        attackDC: [...attack.attackDC],
        hordeDamage: [...attack.hordeDamage],
      }
    })
    expect(s.npc_secondary_attack).toEqual(attack)
  })
})

describe('npc_traits round-trip', () => {
  it('preserves an array of trait objects', () => {
    const traits = [
      { _id: 'trait-1', name: 'Pack Tactics', description: 'Advantage when an ally is adjacent' },
      { _id: 'trait-2', name: 'Keen Smell', description: 'Advantage on Perception' },
    ]
    const s = roundTripSheet((sheet) => {
      sheet.npc_traits = traits.map((t) => ({ ...t }))
    })
    expect(s.npc_traits).toEqual(traits)
  })

  it('empty npc_traits round-trips as empty', () => {
    const s = roundTripSheet((sheet) => { sheet.npc_traits = [] })
    expect(s.npc_traits).toEqual([])
  })
})
