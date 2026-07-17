import { describe, test, expect } from 'vitest'
import { roundTripSheet } from './helpers.js'

// Enumerated from sheetStore.dehydrate() at src/stores/sheetStore.js:2017-2154.
// Only scalars that map to a single ref on the store are listed here; compound
// shapes (abilityScores, skills, hp, nested objects, sections, NPC) live in
// their own spec files.
//
// Aliasing note: `gloom` / `unity` are exported as `gloom_gems` / `unity_points`
// (sheetStore.js:3760-3761). `activeFormation` / `formationsCollapsed` /
// `combatFormsCollapsed` / `comboParticipants` / `combosCollapsed` /
// `releaseMagicCollapsed` / `signatureCard1` / `signatureCard2` are camelCase on
// the store but dehydrate to snake_case keys; the store property is the same,
// so these tests set the store property directly.
const scalarCases = [
  ['sheet_mode', 'npc'],
  ['isTransformed', true],
  ['studentTokenImage', 'https://example.com/s.png'],
  ['knightTokenImage', 'https://example.com/k.png'],
  ['level', 7],
  ['reputation', 3],
  ['budgetTallies', 12],
  ['trainingTallies', 5],
  ['clubTallies', 4],
  ['resoundingGrowths', 2],
  ['clubPosition', 'president'],
  ['player', 'Alex'],
  ['inspiration', 3],
  ['stress', 4],
  ['exhaustion', 5],
  ['detentionTickets', 2],
  ['enduranceDieEnabled', false],
  ['freakingOutToday', true],
  ['sleepEffect', 'refreshing'],
  ['sealImplantGiven', true],
  ['sealImplantReceived', true],
  ['energySurgeUsed', true],
  ['isFlying', true],
  ['soulSacrificeCount', 2],
  ['rollMode', 'advantage'],
  ['rested', true],
  ['studiedCombat', true],
  ['studiedSchool', true],
  ['wellFed', true],
  ['gloom_gems', 3],
  ['unity_points', 4],
  ['fortunePool', 2],
  ['fortunePoolEnabled', true],
  ['activeFormation', 'arrow'],
  ['formationsCollapsed', false],
  ['combatFormsCollapsed', false],
  ['levelAbilitiesCollapsed', true],
  ['comboParticipants', 4],
  ['combosCollapsed', false],
  ['elemental_affinity', 'fire'],
  ['magic_style', 'Elemental'],
  ['releaseMagicCollapsed', false],
  ['signatureCard1', 'king'],
  ['signatureCard2', 'queen'],
  ['element_name', 'Inferno'],
  ['mam', 'intelligence'],
  ['student_type', 'arcane'],
  ['customProficiency', 5],
  ['elemental_enhancement_1', 'cold'],
  ['elemental_enhancement_2', 'lightning'],
  ['roll_resist_proficiency', 'intelligence'],
  ['masteredSkill', 'athletics'],
  ['activeCombatForm', 'formI'],
  ['veilPiercingUsed', true],
  ['manaConduitUsed', true],
  ['soulArmamentMode', 'gun'],
  ['student_damage_override', '2d6+3'],
  ['student_armor_override', '18'],
  ['student_move', 35],
  ['student_attack_override', '7'],
  ['knight_damage', '3d8+5'],
  ['knight_armor', 14],
  ['knight_hasShield', true],
  ['knight_move', '40'],
  ['knight_attack_override', '9'],
  ['spell_attack_override', '8'],
  ['spell_dc_override', '15'],
  ['initiative_override', '6'],
  ['interests', 'astronomy'],
  ['virtues', 'honesty'],
  ['strengths', 'loyalty'],
  ['weaknesses', 'impulsive'],
  ['electives', 'magic theory'],
  ['characteristics', 'calm under pressure'],
  ['quote', 'For the realm!'],
  ['player_links', 'rival with Jordan'],
  ['backstory', 'Orphaned heir to a fallen house'],
]

describe('sheetStore scalar fields round-trip', () => {
  test.each(scalarCases)(
    '%s persists through dehydrate/hydrate',
    (field, value) => {
      const s = roundTripSheet((sheet) => {
        sheet[field] = value
      })
      expect(s[field]).toEqual(value)
    },
  )
})
