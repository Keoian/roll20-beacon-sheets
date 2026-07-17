// SRD rules verification: edit driving fields, assert dependent values change
// per C:\git\magi-knights-srd. Complements the hydration suite.
import { describe, it, expect } from 'vitest'
import { useSheetStore } from '@/stores'
import { freshPinia } from '../hydration/helpers.js'
import { unref } from 'vue'

const sc = (s, name, val) => { s.abilityScores[name].score = val }
const mod = (s, name) => unref(s.abilityScores[name].mod)

function sheet() {
  freshPinia()
  return useSheetStore()
}

describe('ability scores and modifiers', () => {
  it('computes standard modifiers from scores', () => {
    const s = sheet()
    sc(s, 'strength', 18)
    expect(mod(s, 'strength')).toBe(4)
    sc(s, 'strength', 8)
    expect(mod(s, 'strength')).toBe(-1)
  })

  it('caps modifiers at +5 until Reputation IV (Exceed a Mortal\'s Limits)', () => {
    const s = sheet()
    sc(s, 'strength', 24) // raw mod +7
    s.reputation = 3
    expect(mod(s, 'strength')).toBe(5)
    s.reputation = 4
    expect(mod(s, 'strength')).toBe(7)
  })
})

describe('proficiency by reputation (SRD core-rules table)', () => {
  it.each([[0, 2], [1, 3], [2, 3], [3, 4], [4, 5], [5, 6]])(
    'reputation %i gives proficiency +%i', (rep, prof) => {
      const s = sheet()
      s.reputation = rep
      expect(Number(s.proficiency)).toBe(prof)
    })

  it('custom proficiency overrides the table', () => {
    const s = sheet()
    s.reputation = 0
    s.customProficiency = 4
    expect(Number(s.proficiency)).toBe(4)
  })
})

describe('resource formulas', () => {
  it('Magi-Knight HP: 10 + CON at level 1, +6+CON per level after', () => {
    const s = sheet()
    sc(s, 'constitution', 14) // +2
    s.level = 1
    expect(unref(s.hp.max)).toBe(12)
    s.level = 5
    expect(unref(s.hp.max)).toBe(12 + 4 * 8)
  })

  it('Tough as Nails adds +2 + 2/level HP', () => {
    const s = sheet()
    sc(s, 'constitution', 10)
    s.level = 3
    const base = unref(s.hp.max)
    s.addRow('tactics')
    Object.assign(s.sections.tactics.rows[0], { name: 'Tough as Nails', active: true })
    expect(unref(s.hp.max)).toBe(base + 2 + 3 * 2)
  })

  it('MP: MCO x2, x3 with Mana Attunement, +1 rep with Adept of Magic', () => {
    const s = sheet()
    s.level = 4
    s.reputation = 1
    s.mam = 'wisdom'
    sc(s, 'wisdom', 16) // +3
    // MCO = 4 + 3 + 1 = 8
    expect(unref(s.mp.max)).toBe(16)
    s.magical_implement.qualities.manaAttunement = true
    expect(unref(s.mp.max)).toBe(24)
    s.addRow('tactics')
    Object.assign(s.sections.tactics.rows[0], { name: 'Adept of Magic', active: true })
    expect(unref(s.mp.max)).toBe(27) // MCO 9 x 3
  })

  it('SHP: 10 + CON mod + Reputation', () => {
    const s = sheet()
    sc(s, 'constitution', 14)
    s.reputation = 3
    expect(unref(s.shp.max)).toBe(15)
  })

  it('Student Armor: 10 + CON mod + DEX mod', () => {
    const s = sheet()
    sc(s, 'constitution', 14)
    sc(s, 'dexterity', 12)
    expect(Number(s.student_armor)).toBe(13)
  })
})

describe('spellcasting derived values', () => {
  it('Spell Attack = proficiency + MAM mod; Spell DC = 8 + proficiency + MAM mod', () => {
    const s = sheet()
    s.reputation = 3 // prof 4
    s.mam = 'intelligence'
    sc(s, 'intelligence', 16) // +3
    expect(Number(s.spell_attack)).toBe(7)
    expect(Number(s.spell_dc)).toBe(15)
  })

  it('max spell tier follows level and Tier VI needs Herald Bond IV+', () => {
    const s = sheet()
    s.level = 1
    expect(s.isTierUnlocked('I')).toBe(true)
    expect(s.isTierUnlocked('II')).toBe(false)
    s.level = 5
    expect(s.isTierUnlocked('III')).toBe(true)
    expect(s.isTierUnlocked('IV')).toBe(false)
    s.level = 14
    s.herald.bondLevel = 3
    expect(s.isTierUnlocked('V')).toBe(true)
    expect(s.isTierUnlocked('VI')).toBe(false)
    s.herald.bondLevel = 4
    expect(s.isTierUnlocked('VI')).toBe(true)
  })

  it('spell paths known cap: 2 below level 4, 3 below 8, then 4', () => {
    const s = sheet()
    s.level = 1
    expect(s.maxSpellPaths).toBe(2)
    s.level = 4
    expect(s.maxSpellPaths).toBe(3)
    s.level = 8
    expect(s.maxSpellPaths).toBe(4)
  })
})

describe('conditions drive roll modes (SRD conditions.md)', () => {
  it.each(['depleted', 'drained', 'distressed', 'disoriented', 'poisoned'])(
    '%s imposes Disadvantage on attacks', (key) => {
      const s = sheet()
      expect(s.conditionDisadvantageOnAttacks).toBe(false)
      s.conditions[key] = true
      expect(s.conditionDisadvantageOnAttacks).toBe(true)
    })

  it.each(['distressed', 'disoriented', 'horrified'])(
    '%s imposes Disadvantage on skill checks', (key) => {
      const s = sheet()
      s.conditions[key] = true
      expect(s.conditionDisadvantageOnSkillChecks).toBe(true)
    })

  it('resist disadvantage: disoriented/restrained hit physical; horrified hits all but horror', () => {
    const s = sheet()
    s.conditions.disoriented = true
    expect(s.activeResistModifiers.physical).toBe('disadvantage')
    expect(s.activeResistModifiers.magic).toBe('normal')
    s.conditions.disoriented = false
    s.conditions.horrified = true
    expect(s.activeResistModifiers.physical).toBe('disadvantage')
    expect(s.activeResistModifiers.magic).toBe('disadvantage')
    expect(s.activeResistModifiers.purity).toBe('disadvantage')
    expect(s.activeResistModifiers.horror).toBe('normal')
  })

  it('manual advantage cancels condition disadvantage', () => {
    const s = sheet()
    s.conditions.disoriented = true
    s.resistModifiers.physical.advantage = true
    expect(s.activeResistModifiers.physical).toBe('normal')
  })
})

describe('attrition (SRD attrition.md)', () => {
  it('Endurance Die applies from 1 Stress and still rolls at level 6', () => {
    const s = sheet()
    expect(s.getEnduranceDieInfo('wisdom')).toBeNull()
    s.stress = 1
    expect(s.getEnduranceDieInfo('wisdom')).toEqual({ type: 'stress', level: 1 })
    expect(s.getEnduranceDieInfo('strength')).toBeNull()
    s.stress = 6
    expect(s.getEnduranceDieInfo('intelligence')).toEqual({ type: 'stress', level: 6 })
    s.exhaustion = 4
    expect(s.getEnduranceDieInfo('dexterity')).toEqual({ type: 'exhaustion', level: 4 })
  })

  it('level 6 stress/exhaustion forces disadvantage', () => {
    const s = sheet()
    expect(s.forcedDisadvantage).toBe(false)
    s.stress = 6
    expect(s.forcedDisadvantage).toBe(true)
  })

  it('eclipse blips: trauma=1, corruption=2, burnout=3; Heartless at 3+, Fallen at 5+ corruption', () => {
    const s = sheet()
    s.eclipse_blips.splice(0, 8, 1, 1, 2, 2, 2, 0, 0, 0)
    expect(s.trauma).toBe(2)
    expect(s.corruptionCount).toBe(3)
    expect(s.heartlessKnight).toBe(true)
    expect(s.fallenKnight).toBe(false)
    s.eclipse_blips.splice(0, 8, 2, 2, 2, 2, 2, 3, 3, 0)
    expect(s.corruptionCount).toBe(5)
    expect(s.fallenKnight).toBe(true)
    expect(s.burnoutLines).toBe(2)
  })

  it('Heroic Conviction fills the next facet and restores 1 HP', () => {
    const s = sheet()
    s.hp.current = 0
    s.crystal.facet1 = true
    expect(s.useHeroicConviction()).toBe(true)
    expect(unref(s.crystal.facet2)).toBe(true)
    expect(unref(s.hp.current)).toBe(1)
  })

  it('Heroic Conviction fails with all 7 facets fractured', () => {
    const s = sheet()
    for (let i = 1; i <= 7; i++) s.crystal['facet' + i] = true
    s.hp.current = 0
    expect(s.useHeroicConviction()).toBe(false)
    expect(unref(s.hp.current)).toBe(0)
  })

  it('Soul Sacrifice max = Reputation Level', () => {
    const s = sheet()
    s.reputation = 4
    expect(s.soulSacrificeMax).toBe(4)
  })
})

describe('Total Focus (SRD spell-paths-advanced.md)', () => {
  it('breaks on the SRD condition list', () => {
    const s = sheet()
    expect(s.totalFocusBroken).toBe(false)
    for (const key of ['berserk', 'depleted', 'drained', 'exposed', 'horrified', 'silenced', 'soulSiphoned1', 'soulTainted', 'unconscious']) {
      s.conditions[key] = true
      expect(s.totalFocusBroken, key).toBe(true)
      s.conditions[key] = false
    }
    s.conditions.prone = true
    expect(s.totalFocusBroken).toBe(false)
  })

  it('Single-Minded Focus narrows breaks to Horrified/Unconscious', () => {
    const s = sheet()
    s.addRow('tactics')
    Object.assign(s.sections.tactics.rows[0], { name: 'Single-Minded Focus', active: true })
    s.conditions.silenced = true
    expect(s.totalFocusBroken).toBe(false)
    s.conditions.horrified = true
    expect(s.totalFocusBroken).toBe(true)
  })
})

describe('equipment systems (SRD equipment.md)', () => {
  it('Soul Armament bonuses scale with Reputation (Table)', () => {
    const s = sheet()
    const expected = [[0, 0, 0], [1, 1, 0], [2, 1, 1], [3, 2, 1], [4, 2, 2], [5, 3, 3]]
    for (const [rep, armor, weapon] of expected) {
      s.reputation = rep
      expect(s.soulArmamentArmorBonus, `rep ${rep} armor`).toBe(armor)
      expect(s.soulArmamentWeaponBonus, `rep ${rep} weapon`).toBe(weapon)
    }
  })

  it('rune slot capacity = max(1, Reputation) and slot costs accumulate', () => {
    const s = sheet()
    s.reputation = 0
    expect(s.runeSlotCapacity).toBe(1)
    s.reputation = 3
    expect(s.runeSlotCapacity).toBe(3)
    s.addRow('runes')
    s.addRow('runes')
    Object.assign(s.sections.runes.rows[0], { slotCost: 2 })
    Object.assign(s.sections.runes.rows[1], { slotCost: 2 })
    expect(s.runeSlotsUsed).toBe(4)
    expect(s.runesOverCapacity).toBe(true)
  })

  it('relic capacity = Reputation Level', () => {
    const s = sheet()
    s.reputation = 1
    s.addRow('relics')
    s.addRow('relics')
    expect(s.relicCapacity).toBe(1)
    expect(s.relicsOverCapacity).toBe(true)
  })

  it('gun types match the SRD Soul Gun table and Akimbo raises MD by 1', () => {
    const s = sheet()
    expect(s.gunTypeData.dmr).toMatchObject({ eRange: 80, damage: '1d10', rf: 2, md: 3 })
    expect(s.gunTypeData.sda.md).toBe(0)
    s.soul_gun.gunType = 'hdg'
    expect(s.effectiveMD).toBe(3)
    s.soul_gun.gunStyle = 'akimbo'
    expect(s.effectiveMD).toBe(4)
    s.soul_gun.gunType = 'smg'
    expect(s.effectiveMD).toBe(4) // akimbo only applies to handguns
  })

  it('implement quality computeds scale with level', () => {
    const s = sheet()
    s.level = 7
    s.magical_implement.qualities.embolden = true
    s.magical_implement.qualities.radiance = true
    s.magical_implement.qualities.warding = true
    expect(s.emboldenDamageBonus).toBe(7)
    expect(s.radianceHealBonus).toBe(8)
    expect(s.wardingReduction).toBe(3)
  })
})

describe('combat forms and level abilities (SRD combat-forms.md, core-rules.md)', () => {
  it('knowing Form X grants Soul Gun access; mastery alone also qualifies', () => {
    const s = sheet()
    expect(s.hasFormX).toBe(false)
    s.combatFormsKnown.formX = true
    expect(s.hasFormX).toBe(true)
    s.combatFormsKnown.formX = false
    s.combatFormMastery.formX = true
    expect(s.hasFormX).toBe(true)
  })

  it('level abilities unlock at SRD levels', () => {
    const s = sheet()
    s.level = 3
    expect(s.levelAbilities.energySurge).toBe(false)
    s.level = 4
    expect(s.levelAbilities.energySurge).toBe(true)
    expect(s.levelAbilities.counterBlast).toBe(false)
    s.level = 5
    expect(s.levelAbilities.counterBlast).toBe(true)
    expect(s.levelAbilities.swiftAttack1).toBe(true)
    s.level = 6
    expect(s.levelAbilities.perfectParry).toBe(true)
    expect(s.levelAbilities.extricateAether).toBe(true)
    s.level = 9
    expect(s.levelAbilities.heroicResolve).toBe(true)
    s.level = 10
    expect(s.levelAbilities.swiftAttack2).toBe(true)
    expect(s.levelAbilities.flight).toBe(true)
  })

  it('stat increases available at levels 3/6/9/12/15', () => {
    const s = sheet()
    s.level = 2
    expect(s.statIncreasesAvailable).toBe(0)
    s.level = 9
    expect(s.statIncreasesAvailable).toBe(3)
    s.level = 15
    expect(s.statIncreasesAvailable).toBe(5)
  })
})

describe('social systems (SRD social-systems.md)', () => {
  it('NPC bond stages follow the NPC SP table', () => {
    const s = sheet()
    expect(s.getBondStageForSP(0, 'npc')).toBe('buildABond')
    expect(s.getBondStageForSP(19, 'npc')).toBe('buildABond')
    expect(s.getBondStageForSP(20, 'npc')).toBe('friendly')
    expect(s.getBondStageForSP(50, 'npc')).toBe('caring')
    expect(s.getBondStageForSP(90, 'npc')).toBe('devoted')
  })

  it('Magi-Knight bond stages follow the MK SP table including Mythic at 100', () => {
    const s = sheet()
    expect(s.getBondStageForSP(8, 'squadron')).toBe('buildABond')
    expect(s.getBondStageForSP(9, 'squadron')).toBe('newBeginning')
    expect(s.getBondStageForSP(20, 'squadron')).toBe('friendly')
    expect(s.getBondStageForSP(50, 'squadron')).toBe('caring')
    expect(s.getBondStageForSP(90, 'squadron')).toBe('devoted')
    expect(s.getBondStageForSP(100, 'squadron')).toBe('mythic')
  })

  it('unity points unlock at Rep II with max = rep - 1', () => {
    const s = sheet()
    s.reputation = 1
    expect(s.unity_available).toBe(false)
    s.reputation = 2
    expect(s.unity_available).toBe(true)
    expect(s.unity_max).toBe(1)
    s.reputation = 5
    expect(s.unity_max).toBe(4)
  })
})

describe('Magi-Squire (SRD herald.md)', () => {
  it('damage scales 1d6+3 / 2d6@5 / 3d6@10 / 4d6@15 with mentor level', () => {
    const s = sheet()
    s.level = 1
    expect(s.squireDamage).toBe('1d6+3')
    s.level = 5
    expect(s.squireDamage).toBe('2d6')
    s.level = 10
    expect(s.squireDamage).toBe('3d6')
    s.level = 15
    expect(s.squireDamage).toBe('4d6')
  })
})

describe('Divination (SRD spell-paths-advanced.md)', () => {
  it('tier table gives correct MP/tax/scaling', () => {
    const s = sheet()
    expect(s.divinationTierData[1]).toEqual({ mp: 3, tax: 0, scaling: 2 })
    expect(s.divinationTierData[6]).toEqual({ mp: 45, tax: 2, scaling: 12 })
    s.divinationTier = 4
    expect(s.divinationScaling).toBe(8)
  })

  it('Divine the Future draws 3 unique cards (slot 2 reversed) and a court card', () => {
    const s = sheet()
    s.divineTheFuture()
    expect(s.divinationSlots).toHaveLength(3)
    expect(s.divinationSlots[0].orientation).toBe('upright')
    expect(s.divinationSlots[1].orientation).toBe('reversed')
    expect(s.divinationSlots[2].orientation).toBe('upright')
    const nums = s.divinationSlots.map(slot => slot.cardNum)
    expect(new Set(nums).size).toBe(3)
    expect(s.divinationDeckState).toHaveLength(13)
    expect(s.courtCardDefs.map(c => c.name)).toContain(s.divinationCourtCard)
  })

  it('slot flip/expend/redraw behave and redraw cycles the deck', () => {
    const s = sheet()
    s.divineTheFuture()
    s.flipDivinationSlot(1)
    expect(s.divinationSlots[1].orientation).toBe('upright')
    s.expendDivinationSlot(0)
    expect(s.divinationSlots[0].expended).toBe(true)
    const oldCard = s.divinationSlots[2].cardNum
    s.redrawDivinationSlot(2)
    expect(s.divinationSlots[2].cardNum).not.toBe(oldCard)
    expect(s.divinationDeckState).toContain(oldCard)
  })
})

describe('NPC construction (SRD Table 15-6 and roles)', () => {
  it('size modifiers match Table 15-6', () => {
    const s = sheet()
    expect(s.sizeModifiers.Small).toEqual({ ac: 1, hpPct: -10, atkBonus: 1, dprPct: -10 })
    expect(s.sizeModifiers.Massive).toEqual({ ac: -2, hpPct: 15, atkBonus: -1, dprPct: 15 })
    expect(s.sizeModifiers.Colossal).toEqual({ ac: -2, hpPct: 20, atkBonus: -2, dprPct: 20 })
  })

  it('role + size modifiers combine', () => {
    const s = sheet()
    s.npc_role = 'assassin'
    s.npc_size = 'Small'
    expect(s.npc_combined_modifiers ?? {
      ac: s.npc_role_modifiers.ac + s.npc_size_modifiers.ac,
      atkBonus: s.npc_role_modifiers.atkBonus + s.npc_size_modifiers.atkBonus
    }).toMatchObject({ ac: 1, atkBonus: 4 })
  })
})

describe('serialization of newest systems', () => {
  it('round-trips divination, focus, forms-known, and casting state', async () => {
    const { roundTripSheet } = await import('../hydration/helpers.js')
    const s = roundTripSheet(first => {
      first.totalFocus = true
      first.veilPiercingUsed = true
      first.manaConduitUsed = true
      first.combatFormsKnown.formX = true
      first.combatFormMastery.formIII = true
      first.divinationTier = 3
      first.divineTheFuture()
      first.divinationSlots[0].expended = true
      first.resistModifiers.horror.advantage = true
      first.enduranceDieEnabled = false
      first.freakingOutToday = true
      first.sealImplantGiven = true
      first.soulSacrificeCount = 2
      first.sleepEffect = 'refreshing'
    })
    expect(s.totalFocus).toBe(true)
    expect(s.veilPiercingUsed).toBe(true)
    expect(s.manaConduitUsed).toBe(true)
    expect(s.combatFormsKnown.formX).toBe(true)
    expect(s.combatFormMastery.formIII).toBe(true)
    expect(s.divinationTier).toBe(3)
    expect(s.divinationSlots).toHaveLength(3)
    expect(s.divinationSlots[0].expended).toBe(true)
    expect(s.divinationDeckState).toHaveLength(13)
    expect(s.divinationCourtCard).not.toBe('')
    expect(s.resistModifiers.horror.advantage).toBe(true)
    expect(s.enduranceDieEnabled).toBe(false)
    expect(s.freakingOutToday).toBe(true)
    expect(s.sealImplantGiven).toBe(true)
    expect(s.soulSacrificeCount).toBe(2)
    expect(s.sleepEffect).toBe('refreshing')
  })
})
