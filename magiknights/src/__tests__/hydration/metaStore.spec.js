import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMetaStore } from '@/stores'

// metaStore is small (src/stores/metaStore.js). Only name/bio/gmNotes/avatar
// are owned by the sheet; `id` and `token` are owned by the Beacon SDK and
// read directly from `initValues.character`, so metaStore does not track
// them at all. `campaignId` is populated externally. Pin the direct hydrate
// contract here since roundTripSheet doesn't cover metaStore.

function freshMeta() {
  setActivePinia(createPinia())
  return useMetaStore()
}

describe('metaStore dehydrate output', () => {
  it('includes the expected keys', () => {
    const meta = freshMeta()
    meta.name = 'Clara'
    meta.bio = 'Knight of the Dawn'
    meta.gmNotes = 'Secret heir'
    meta.avatar = 'https://example.com/clara.png'

    const payload = meta.dehydrate()

    expect(payload.name).toBe('Clara')
    expect(payload.bio).toBe('Knight of the Dawn')
    expect(payload.gmNotes).toBe('Secret heir')
    expect(payload.avatar).toBe('https://example.com/clara.png')
    // `page` comes from the mocked router — just confirm the key is present.
    expect(payload).toHaveProperty('page')
  })
})

describe('metaStore hydrate', () => {
  it('restores name/bio/gmNotes/avatar from a plain payload', () => {
    const meta = freshMeta()
    meta.hydrate({
      name: 'Mira',
      bio: 'Bio text',
      gmNotes: 'GM-only text',
      avatar: 'https://example.com/mira.png',
    })

    expect(meta.name).toBe('Mira')
    expect(meta.bio).toBe('Bio text')
    expect(meta.gmNotes).toBe('GM-only text')
    expect(meta.avatar).toBe('https://example.com/mira.png')
  })

  it('leaves existing values in place when the payload is missing keys', () => {
    const meta = freshMeta()
    meta.name = 'Initial'
    meta.hydrate({ bio: 'New bio' })

    expect(meta.name).toBe('Initial')
    expect(meta.bio).toBe('New bio')
  })
})
