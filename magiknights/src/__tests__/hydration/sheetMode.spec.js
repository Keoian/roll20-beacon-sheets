import { describe, it, expect } from 'vitest'
import { roundTripSheet } from './helpers.js'

// Sheet mode (PC vs NPC) and the NPC sub-type (monster/npc/squire) must
// persist so a character opens in the mode it was left in.
describe('sheet mode persistence', () => {
  it('round-trips NPC mode with the squire sub-type', () => {
    const s = roundTripSheet(first => {
      first.sheet_mode = 'npc'
      first.npc_sheet_type = 'squire'
    })
    expect(s.sheet_mode).toBe('npc')
    expect(s.npc_sheet_type).toBe('squire')
  })

  it('round-trips NPC mode with the npc social sub-type', () => {
    const s = roundTripSheet(first => {
      first.sheet_mode = 'npc'
      first.npc_sheet_type = 'npc'
    })
    expect(s.sheet_mode).toBe('npc')
    expect(s.npc_sheet_type).toBe('npc')
  })

  it('defaults to pc mode and monster sub-type on a fresh sheet', () => {
    const s = roundTripSheet(() => {})
    expect(s.sheet_mode).toBe('pc')
    expect(s.npc_sheet_type).toBe('monster')
  })
})
