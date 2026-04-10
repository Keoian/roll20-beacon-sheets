import { describe, it, expect } from 'vitest'
import { roundTripSheet } from './helpers.js'

// Each block targets one dehydrate helper at sheetStore.js:1800-2014.
// Pinia wraps the store return with reactive(), which deeply unwraps refs, so
// tests reach the data without `.value` even when the source is a plain
// object with ref members.

describe('crystal facets round-trip (dehydrateCrystal)', () => {
  it.each([1, 2, 3, 4, 5, 6, 7])('facet %s persists when toggled on', (n) => {
    const key = `facet${n}`
    const s = roundTripSheet((sheet) => { sheet.crystal[key] = true })
    expect(s.crystal[key]).toBe(true)
  })

  it('all seven facets toggled together round-trip', () => {
    const s = roundTripSheet((sheet) => {
      for (let i = 1; i <= 7; i++) sheet.crystal[`facet${i}`] = true
    })
    for (let i = 1; i <= 7; i++) {
      expect(s.crystal[`facet${i}`]).toBe(true)
    }
  })
})

describe('student_ability round-trip', () => {
  it('preserves name, description, collapsed', () => {
    const s = roundTripSheet((sheet) => {
      sheet.student_ability.name = 'Arcane Scholar'
      sheet.student_ability.description = 'Advantage on Academic Arts'
      sheet.student_ability.collapsed = false
    })
    expect(s.student_ability.name).toBe('Arcane Scholar')
    expect(s.student_ability.description).toBe('Advantage on Academic Arts')
    expect(s.student_ability.collapsed).toBe(false)
  })
})

describe('fate round-trip', () => {
  it('preserves card and name', () => {
    const s = roundTripSheet((sheet) => {
      sheet.fate.card = 'the-star'
      sheet.fate.name = 'The Star'
    })
    expect(s.fate.card).toBe('the-star')
    expect(s.fate.name).toBe('The Star')
  })
})

describe('armor_weave round-trip (dehydrateArmorWeave)', () => {
  it('preserves selected, name, description, collapsed', () => {
    const s = roundTripSheet((sheet) => {
      sheet.armor_weave.selected = 'phoenix'
      sheet.armor_weave.name = 'Phoenix Imbued Weave'
      sheet.armor_weave.description = 'Custom notes'
      sheet.armor_weave.collapsed = false
    })
    expect(s.armor_weave.selected).toBe('phoenix')
    expect(s.armor_weave.name).toBe('Phoenix Imbued Weave')
    expect(s.armor_weave.description).toBe('Custom notes')
    expect(s.armor_weave.collapsed).toBe(false)
  })
})

describe('herald round-trip', () => {
  it('preserves name, bondLevel, notes', () => {
    const s = roundTripSheet((sheet) => {
      sheet.herald.name = 'Seraphiel'
      sheet.herald.bondLevel = 4
      sheet.herald.notes = 'Bonded after the Battle of Ember Hill'
    })
    expect(s.herald.name).toBe('Seraphiel')
    expect(s.herald.bondLevel).toBe(4)
    expect(s.herald.notes).toBe('Bonded after the Battle of Ember Hill')
  })
})

describe('squire round-trip (dehydrateSquire)', () => {
  it('preserves all persisted squire fields', () => {
    const s = roundTripSheet((sheet) => {
      sheet.squire.name = 'Peri'
      sheet.squire.level = 3
      sheet.squire.healthBlips = [true, true, false, false, false, false]
      sheet.squire.manaBlips = [true, false, false]
      sheet.squire.studentArmor = 12
      sheet.squire.knightArmor = 16
      sheet.squire.spellPath1 = 'Beam'
      sheet.squire.spellPath2 = 'Curing'
      sheet.squire.skills = 'Perception, Insight'
      sheet.squire.notes = 'Loyal to a fault'
      sheet.squire.collapsed = false
    })
    expect(s.squire.name).toBe('Peri')
    expect(s.squire.level).toBe(3)
    expect(s.squire.healthBlips).toEqual([true, true, false, false, false, false])
    expect(s.squire.manaBlips).toEqual([true, false, false])
    expect(s.squire.studentArmor).toBe(12)
    expect(s.squire.knightArmor).toBe(16)
    expect(s.squire.spellPath1).toBe('Beam')
    expect(s.squire.spellPath2).toBe('Curing')
    expect(s.squire.skills).toBe('Perception, Insight')
    expect(s.squire.notes).toBe('Loyal to a fault')
    expect(s.squire.collapsed).toBe(false)
  })
})

describe('soul_weapon round-trip (dehydrateSoulWeapon)', () => {
  it('preserves scalar fields', () => {
    const s = roundTripSheet((sheet) => {
      sheet.soul_weapon.name = 'Starfall Greatsword'
      sheet.soul_weapon.range = 'melee'
      sheet.soul_weapon.damage = '2d6+4'
      sheet.soul_weapon.damageType = 'magical'
      sheet.soul_weapon.collapsed = false
    })
    expect(s.soul_weapon.name).toBe('Starfall Greatsword')
    expect(s.soul_weapon.range).toBe('melee')
    expect(s.soul_weapon.damage).toBe('2d6+4')
    expect(s.soul_weapon.damageType).toBe('magical')
    expect(s.soul_weapon.collapsed).toBe(false)
  })

  it('preserves every quality flag', () => {
    const qualities = {
      accurate: true,
      coupled: true,
      ensnaring: true,
      forceful: true,
      massive: true,
      staggeringBlow: true,
      twoHanded: true,
      veilPiercing: true,
    }
    const s = roundTripSheet((sheet) => {
      sheet.soul_weapon.qualities = { ...qualities }
    })
    expect(s.soul_weapon.qualities).toEqual(qualities)
  })
})

describe('soul_gun round-trip (dehydrateSoulGun)', () => {
  it('preserves scalar fields', () => {
    const s = roundTripSheet((sheet) => {
      sheet.soul_gun.name = 'Stellar Cannon'
      sheet.soul_gun.gunType = 'asr'
      sheet.soul_gun.gunStyle = 'mobile'
      sheet.soul_gun.aimed = true
      sheet.soul_gun.hasReloaded = false
      sheet.soul_gun.firingPoolBonus = 2
      sheet.soul_gun.collapsed = false
    })
    expect(s.soul_gun.name).toBe('Stellar Cannon')
    expect(s.soul_gun.gunType).toBe('asr')
    expect(s.soul_gun.gunStyle).toBe('mobile')
    expect(s.soul_gun.aimed).toBe(true)
    expect(s.soul_gun.hasReloaded).toBe(false)
    expect(s.soul_gun.firingPoolBonus).toBe(2)
    expect(s.soul_gun.collapsed).toBe(false)
  })

  it('preserves attachments array', () => {
    const attachments = [
      { name: 'Scope', type: 'sight', effect: '+1 to hit at range' },
      { name: 'Silencer', type: 'barrel', effect: 'Muffled shots' },
    ]
    const s = roundTripSheet((sheet) => {
      sheet.soul_gun.attachments = attachments.map((a) => ({ ...a }))
    })
    expect(s.soul_gun.attachments).toEqual(attachments)
  })
})

describe('magical_implement round-trip (dehydrateMagicalImplement)', () => {
  it('preserves scalar fields', () => {
    const s = roundTripSheet((sheet) => {
      sheet.magical_implement.name = 'Auric Staff'
      sheet.magical_implement.description = 'Carved from meteor iron'
      sheet.magical_implement.collapsed = false
    })
    expect(s.magical_implement.name).toBe('Auric Staff')
    expect(s.magical_implement.description).toBe('Carved from meteor iron')
    expect(s.magical_implement.collapsed).toBe(false)
  })

  it('preserves every quality flag', () => {
    const qualities = {
      cardConductor: true,
      embolden: true,
      light: true,
      manaAttunement: true,
      manaConduit: true,
      radiance: true,
      twoHanded: true,
      warding: true,
    }
    const s = roundTripSheet((sheet) => {
      sheet.magical_implement.qualities = { ...qualities }
    })
    expect(s.magical_implement.qualities).toEqual(qualities)
  })
})

describe('visor round-trip', () => {
  it('preserves visor type selection', () => {
    const s = roundTripSheet((sheet) => {
      sheet.visor.type = 'medicalDiagnostic'
    })
    expect(s.visor.type).toBe('medicalDiagnostic')
  })
})

describe('elementalSummon round-trip', () => {
  it('preserves every field on the summon object', () => {
    const summon = {
      name: 'Salamander',
      hp: 18,
      hpMax: 22,
      armor: 13,
      attack: 5,
      damage: '1d8+3 fire',
      move: 40,
      description: 'A lithe flame-lizard',
      active: true,
      collapsed: false,
    }
    const s = roundTripSheet((sheet) => {
      sheet.elementalSummon = { ...summon }
    })
    expect(s.elementalSummon).toEqual(summon)
  })
})
