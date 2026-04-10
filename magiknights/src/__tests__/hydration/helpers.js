import { createPinia, setActivePinia } from 'pinia'
import { useAppStore, useSheetStore } from '@/stores'

export function freshPinia() {
  setActivePinia(createPinia())
}

// Mutate a fresh sheet store, dehydrate, JSON-clone (simulate Firebase
// serialization), then hydrate a second fresh store and return it.
export function roundTripSheet(mutator) {
  freshPinia()
  const first = useSheetStore()
  mutator(first)
  const payload = JSON.parse(JSON.stringify(first.dehydrate()))
  freshPinia()
  const second = useSheetStore()
  second.hydrate(payload)
  return second
}

// Hydrate a fresh sheet store directly from an arbitrary payload — used for
// migration tests where we want to feed a legacy shape no current dehydrate()
// would produce.
export function hydrateSheetFromRaw(payload) {
  freshPinia()
  const sheet = useSheetStore()
  sheet.hydrate(payload)
  return sheet
}

// Same as roundTripSheet, but via the app-level dehydrateStore/hydrateStore
// wiring in src/stores/index.js so the meta + sheet split is exercised.
export function roundTripApp(mutator) {
  freshPinia()
  const first = useAppStore()
  mutator(first)
  const character = JSON.parse(JSON.stringify(first.dehydrateStore()))
  freshPinia()
  const second = useAppStore()
  second.hydrateStore(character.attributes, {
    name: character.name,
    bio: character.bio,
    gmNotes: character.gmNotes,
    avatar: character.avatar,
  })
  return second
}
