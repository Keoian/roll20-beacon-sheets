import { vi } from 'vitest'

// metaStore imports @/router at module load and reads router.currentRoute in
// dehydrate(). Stub with a minimal object so tests don't pull in the full
// Vue views graph that the real router registers.
vi.mock('@/router', () => ({
  default: {
    currentRoute: { value: { name: 'test', path: '/' } },
  },
}))

// sheetStore → @/utility → rollToChat.js / getRollResults.js → @/relay →
// @roll20-official/beacon-sdk. The SDK performs network I/O at import time,
// so we break the chain at @/relay.
vi.mock('@/relay', () => ({
  dispatchRef: { value: { post: vi.fn(), roll: vi.fn() } },
  initValues: { character: { id: 'test' }, settings: {} },
}))

// rollToChat.js imports @/rollTemplates, which uses Vite `?raw` loaders that
// jsdom cannot resolve. Stub with a no-op factory.
vi.mock('@/rollTemplates', () => ({
  createRollTemplate: () => '',
}))
