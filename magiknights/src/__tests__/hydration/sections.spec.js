import { describe, it, expect } from 'vitest'
import { roundTripSheet } from './helpers.js'

// Repeating sections are stored as { rows: ref([{ _id, ...fields }]), ... }.
// Dehydrate runs arrayToObject over each section's rows
// (sheetStore.js:2156-2158); hydrate runs objectToArray (line 2368-2370).
// arrayToObject keys rows by `_id` and records index as `arrayPosition`,
// which objectToArray uses to restore ordering.

// All 11 sections defined at sheetStore.js:1414-1594.
const sectionNames = [
  'techniques',
  'tactics',
  'shards',
  'gear',
  'relics',
  'forms',
  'runes',
  'spells',
  'npc-social',
  'squadron-social',
  'club-goalTallies',
]

describe('repeating sections round-trip', () => {
  it.each(sectionNames)(
    '%s preserves a single row with its _id and a custom field',
    (name) => {
      const s = roundTripSheet((sheet) => {
        sheet.sections[name].rows.push({
          _id: `fixed-id-${name}`,
          name: `Sample ${name}`,
          description: 'Round-trip marker',
        })
      })
      const rows = s.sections[name].rows
      expect(rows).toHaveLength(1)
      expect(rows[0]._id).toBe(`fixed-id-${name}`)
      expect(rows[0].name).toBe(`Sample ${name}`)
      expect(rows[0].description).toBe('Round-trip marker')
    },
  )

  it.each(sectionNames)(
    '%s preserves ordering across three rows',
    (name) => {
      const s = roundTripSheet((sheet) => {
        sheet.sections[name].rows.push(
          { _id: `${name}-a`, name: 'Alpha' },
          { _id: `${name}-b`, name: 'Bravo' },
          { _id: `${name}-c`, name: 'Charlie' },
        )
      })
      const rows = s.sections[name].rows
      expect(rows.map((r) => r._id)).toEqual([`${name}-a`, `${name}-b`, `${name}-c`])
      expect(rows.map((r) => r.name)).toEqual(['Alpha', 'Bravo', 'Charlie'])
    },
  )
})

describe('techniques section preserves frequency/action metadata', () => {
  it('round-trips a technique with its full schema', () => {
    const s = roundTripSheet((sheet) => {
      sheet.sections.techniques.rows.push({
        _id: 'tech-1',
        name: 'Whirlwind Strike',
        description: 'Hit all adjacent enemies',
        type: 'Combat',
        category: 'Physical Attacks',
        levelRequired: 5,
        frequency: '1/Round',
        maxUses: 1,
        usesRemaining: 1,
        actionType: 'Standard',
        associatedRoll: '2d8',
        collapsed: false,
      })
    })
    const rows = s.sections.techniques.rows
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      _id: 'tech-1',
      name: 'Whirlwind Strike',
      type: 'Combat',
      category: 'Physical Attacks',
      levelRequired: 5,
      frequency: '1/Round',
      maxUses: 1,
      usesRemaining: 1,
      actionType: 'Standard',
      associatedRoll: '2d8',
    })
  })
})

describe('spells section preserves all tier fields', () => {
  it('round-trips a custom spell path with populated tiers', () => {
    const s = roundTripSheet((sheet) => {
      sheet.sections.spells.rows.push({
        _id: 'spell-1',
        name: 'Beam Path',
        range: '60ft',
        pathSelection: 'Beam',
        tier_I_name: 'Beam I',
        tier_I_dice: '3d8',
        tier_I_special: 'Reclaim',
        tier_I_description: 'A focused beam of light',
        tier_I_action: 'Standard',
        tier_IV_name: 'Beam IV',
        tier_IV_dice: '12d8',
      })
    })
    const row = s.sections.spells.rows[0]
    expect(row._id).toBe('spell-1')
    expect(row.name).toBe('Beam Path')
    expect(row.range).toBe('60ft')
    expect(row.pathSelection).toBe('Beam')
    expect(row.tier_I_dice).toBe('3d8')
    expect(row.tier_IV_name).toBe('Beam IV')
    expect(row.tier_IV_dice).toBe('12d8')
  })
})

describe('sections round-trip with empty rows', () => {
  it.each(sectionNames)('%s with zero rows round-trips as empty', (name) => {
    const s = roundTripSheet(() => { /* no mutation */ })
    expect(s.sections[name].rows).toEqual([])
  })
})
