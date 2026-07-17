# E2E validation scripts

Require the dev server running (`npm run dev`) and Playwright Chromium
(`npx playwright install chromium`). Run from `magiknights/`:

- `node e2e/export-import.mjs` — edits fields through the real UI (student
  type autofill, gear, conditions, shard library, weapon preset), checks the
  live derived values, exports via the Export JSON button, validates the file
  contents, reloads fresh, imports the file, and verifies restoration.
- `node e2e/full-roundtrip.mjs` — populates essentially every persisted field
  with non-default values (including one row in every repeating section, the
  Release Magic deck, and a Divination spread), exports through the UI,
  imports into a fresh page, re-serializes, and deep-diffs every leaf field
  (~560) between the exported file and the re-imported state.

Note: `dispatch.roll` page errors during these runs are expected outside
Roll20 — dice execution needs the Beacon backend and does not affect state.
