import { describe, it, expect } from 'vitest'
import { roundTripApp } from './helpers.js'

// End-to-end exercise of the app-level wiring at src/stores/index.js:48-80:
//   dehydrateStore → { name, bio, gmNotes, avatar, attributes: { sheet } }
//   hydrateStore(character.attributes, { name, bio, gmNotes, avatar })
//
// Catches breakage in the meta/sheet split that per-store round-trip tests
// would miss.

describe('appStore dehydrate/hydrate integration', () => {
  it('propagates a mix of meta and sheet fields through the full pipeline', () => {
    const app = roundTripApp((store) => {
      store.meta.name = 'Vesper'
      store.meta.bio = 'Last of the Starborn'
      store.meta.gmNotes = 'Plot-critical NPC in act 3'
      store.meta.avatar = 'https://example.com/vesper.png'

      store.sheet.level = 9
      store.sheet.reputation = 4
      store.sheet.player = 'Jordan'
      store.sheet.student_type = 'arcane'
      store.sheet.mam = 'intelligence'
      store.sheet.conditions.bleeding = true
      store.sheet.abilityScores.intelligence.score = 18
      store.sheet.hp.current = 32
      store.sheet.herald.name = 'Lumen'
      store.sheet.herald.bondLevel = 3
    })

    // Meta fields survive the `character.{name,bio,gmNotes,avatar}` split.
    expect(app.meta.name).toBe('Vesper')
    expect(app.meta.bio).toBe('Last of the Starborn')
    expect(app.meta.gmNotes).toBe('Plot-critical NPC in act 3')
    expect(app.meta.avatar).toBe('https://example.com/vesper.png')

    // Sheet fields survive `character.attributes.sheet`.
    expect(app.sheet.level).toBe(9)
    expect(app.sheet.reputation).toBe(4)
    expect(app.sheet.player).toBe('Jordan')
    expect(app.sheet.student_type).toBe('arcane')
    expect(app.sheet.mam).toBe('intelligence')
    expect(app.sheet.conditions.bleeding).toBe(true)
    expect(app.sheet.abilityScores.intelligence.score).toBe(18)
    expect(app.sheet.hp.current).toBe(32)
    expect(app.sheet.herald.name).toBe('Lumen')
    expect(app.sheet.herald.bondLevel).toBe(3)
  })

  it('dehydrateStore produces the shape hydrateStore expects', () => {
    const app = roundTripApp((store) => {
      store.meta.name = 'Shape Test'
      store.sheet.level = 2
    })
    expect(app.meta.name).toBe('Shape Test')
    expect(app.sheet.level).toBe(2)
  })
})
