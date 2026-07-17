# Magi-Knights Hydration / Dehydration Issues

**Test suite status**: ✅ **269 / 269 passing** across 10 spec files (`npm test`).

> The suite guarantees that **every field the dehydrate actually writes is restored correctly** on hydrate. The issues below are fields that fall *outside* that guarantee — they're skipped by the dehydrate entirely, written but ignored, or defined in state but never wired to persistence. The test suite cannot catch these because there's no round-trip to fail; they need manual fixes.

Line numbers are against `magiknights/src/stores/sheetStore.js` and `magiknights/src/stores/metaStore.js` at the time of this report.

---

## Severity legend

- 🔴 **Data loss** — user-visible value lost on save/load cycle.
- 🟠 **Orphaned / dead code** — state exists but isn't wired to anything; indicates an incomplete feature.
- 🟡 **Wasted payload** — computed values serialized but never restored; harmless but bloats the save.
- 🔵 **Intentional / informational** — noted so a future reviewer doesn't "fix" a correct design.

---

## 🔴 Data loss

### 1. `sheetStore.levelAbilitiesCollapsed` is never persisted
- **State**: `const levelAbilitiesCollapsed = ref(false)` — `sheetStore.js:1230`
- **Exported**: `sheetStore.js:3755` (bound in views)
- **Dehydrate**: *missing*
- **Hydrate**: *missing*
- **Symptom**: The Level-Locked Abilities section's collapse/expand state resets to open every time the sheet loads from Firebase.
- **Fix**: Add `levelAbilitiesCollapsed: levelAbilitiesCollapsed.value` to the dehydrate object around `sheetStore.js:2054` (grouped with `formationsCollapsed`, `combatFormsCollapsed`, etc.) and a corresponding `levelAbilitiesCollapsed.value = hydrateStore.levelAbilitiesCollapsed ?? levelAbilitiesCollapsed.value` in the hydrate block around `sheetStore.js:2219`.
- **Test after fixing**: Add `['levelAbilitiesCollapsed', true]` to `scalarFields.spec.js`.

### 2. `metaStore.token` hydrates but never dehydrates
- **State**: `const token = ref({})` — `metaStore.js:15`
- **Dehydrate**: *missing* (`metaStore.js:22-31`)
- **Hydrate**: present — `metaStore.js:40` (`token.value = hydrateStore.token ?? token.value`)
- **Symptom**: If anything in the sheet UI mutates `meta.token`, the change is not persisted. Next load reverts to the server-side token.
- **Likely intent**: The Beacon SDK owns token state and pushes it down via the profile, so the sheet is read-only on this field. If so, **remove the hydrate line** too so the asymmetry is gone and the field is clearly server-owned.
- **Fix (option A, make it persistent)**: Add `token: token.value` to `metaStore.dehydrate()` at `metaStore.js:28`.
- **Fix (option B, make it read-only)**: Remove `token.value = hydrateStore.token ?? token.value` at `metaStore.js:40` and delete the ref — let the SDK own it.
- **Recommendation**: Option B unless you can point at a UI control that writes to `meta.token`.

### 3. `metaStore.id` hydrates but never dehydrates
- **State**: `const id = ref('')` — `metaStore.js:10`
- **Dehydrate**: *missing*
- **Hydrate**: present — `metaStore.js:35`
- **Symptom**: Not actually user-visible — character `id` lives at `character.id` at the top level of the payload, not inside `attributes`, so it's still the canonical source. But the hydrate → dehydrate asymmetry inside metaStore is confusing to future readers.
- **Fix**: Match the pattern. Pick one of the same two options as `token` above. I'd argue option B (remove the hydrate line) because the id field is authoritative at `character.id` — metaStore shouldn't be the source of truth for it.

---

## 🟠 Orphaned / dead code

### 4. `sheetStore.character_name` — orphaned ref
- **State**: `const character_name = ref('')` — `sheetStore.js:37`
- **Dehydrate**: *missing*
- **Hydrate**: *missing*
- **UI bindings**: *none* (grep confirmed: `character_name` is never referenced outside its declaration)
- **Symptom**: Dead. `metaStore.name` is the actual character name used in the header.
- **Fix**: Delete the `const character_name = ref('')` line. Check it's not in the store's return statement (it isn't).

### 5. `sheetStore.traits` — orphaned ref with half-implemented feature
- **State**: `const traits = ref([])` + `const traitsCount = computed(...)` — `sheetStore.js:861-862`
- **Dehydrate**: *missing*
- **Hydrate**: *missing*
- **References**:
  - `sheetStore.js:3810` — `traitsCount` exported
  - `sheetStore.js:3863` — `removeTrait: (traitId) => removeTrait(traits, traitId)` exported
  - `sheetStore.js:1597-1606` — old `addTrait` function, **commented out**
  - `stores/index.js:98` — `loadExampleData` sets `stores.sheet.traits = []`
- **Active code path uses `npc_traits` instead**, which *is* wired up correctly.
- **Symptom**: Feature ghost. No UI ever pushes into `traits`, so nothing is lost — but the code is noise.
- **Fix**: Delete `traits`, `traitsCount`, the commented `addTrait` block, the `removeTrait` export, and the line in `loadExampleData`. Confirm no Vue component references `sheet.traits` or `sheet.traitsCount` before deleting.

---

## 🟡 Wasted payload

These fields waste bytes in every Firebase write and confuse readers, but they don't cause data loss — the values are recomputed from their source-of-truth inputs on hydrate.

### 6. `exceededMortalLimits` is computed but dehydrated
- **Dehydrate**: `sheetStore.js:2045` — `exceededMortalLimits: exceededMortalLimits.value`
- **Source**: computed from `reputation >= 4` at `sheetStore.js:215`
- **Hydrate**: ignores it (recomputed automatically when `reputation` is set)
- **Fix**: Delete line `sheetStore.js:2045`.

### 7. `dexterityMod` is dehydrated but the other five mods are not
- **Dehydrate**: `sheetStore.js:2046` — `dexterityMod: dexterityMod.value`
- **Source**: computed from dexterity + exceededMortalLimits at `sheetStore.js:221-224`
- **Hydrate**: ignores it
- **Smell**: Only `dexterityMod` gets serialized — `strengthMod`, `constitutionMod`, etc. don't. This looks like a leftover debugging artifact.
- **Fix**: Delete line `sheetStore.js:2046`.

### 8. `hp_max`, `mp_max`, `shp_max` are all computed but dehydrated
- **Dehydrate**: `sheetStore.js:2081`, `2083`, `2085`
- **Source**: all computed setters that fall back to the `*_max_override` refs (lines 400, 430, 461)
- **Hydrate**: ignores them — only `hp`, `mp`, `shp` sub-objects (which contain `current`, `temp`, `max_override`) are restored
- **Fix**: Delete the three `hp_max`, `mp_max`, `shp_max` lines from the dehydrate payload. The overrides round-trip via `dehydrateHp` / `dehydrateMp` / `dehydrateShp`, and the computed max is re-derived on read.

### 9. `knight_attack` is dehydrated, but the computed has no real logic left
- **Definition**: `sheetStore.js:948-968` — `knight_attack` is a `computed({get, set})`, but the getter body is entirely commented out (lines 952-955) and the getter simply returns `knight_attack_override.value`.
- **Dehydrate**: `sheetStore.js:2110` — `knight_attack: knight_attack.value`, **and** `sheetStore.js:2111` — `knight_attack_override: knight_attack_override.value`
- **Hydrate**: `sheetStore.js:2237` sets `knight_attack.value`, then `sheetStore.js:2238` sets `knight_attack_override.value`. The first write routes through the setter and ends up writing the same override ref, so the second line is redundant.
- **Fix (minimum)**: Delete the `knight_attack: knight_attack.value` line from the dehydrate and the `knight_attack.value = ...` line from the hydrate. `knight_attack_override` already round-trips.
- **Fix (full cleanup, optional)**: Either restore the commented-out getter body (if Knight Attack should actually be computed from proficiency + MAM mod) or delete the `knight_attack` computed entirely and rename `knight_attack_override` → `knight_attack`. The current state is confusing because the computed pretends to be derived but isn't.

---

## 🔵 Intentional / informational (do not "fix")

### `metaStore.permissions`
- Not dehydrated by design — `isOwner` / `isGM` are server-determined on each load.

### `metaStore.campaignId`
- Dehydrated but not hydrated — populated externally by the Beacon SDK at init. Tests don't cover it for the same reason.

### `spellModal` store
- Pure UI state (current modal open/closed) — correctly has no hydrate/dehydrate.

### `studied` → `studiedCombat` migration fallback (`sheetStore.js:2208`)
- Reads the legacy key if the new one is missing. Keep as long as there are saved characters from before the rename.

### `armor_weave` name-only legacy lookup (`sheetStore.js:1860-1868`)
- Backfills `.selected` by matching `.name` against the compendium. Keep.

### `safeHydrateArray` `$__$` prefix handling (`sheetStore.js:1960-1980`)
- Firebase / Beacon SDK quirk. Keep.

### `releaseMagicDeck` full-replace on hydrate (`sheetStore.js:2222-2224`)
- Required to prevent accumulation across hydrate calls — same reason `conditions`, `combatFormMastery`, and `elementalSummon` are replaced entirely.

### All `*_mod` ability modifiers
- Correctly computed on the fly from ability scores + `exceededMortalLimits`. Not persisted (except `dexterityMod`, see #7).

---

## 📊 At a glance

| Severity | Count | Fields |
|---|---|---|
| 🔴 Data loss | 3 | `levelAbilitiesCollapsed`, `metaStore.token`, `metaStore.id` |
| 🟠 Orphaned | 2 | `character_name`, `traits` / `traitsCount` / `removeTrait` |
| 🟡 Wasted payload | 4 | `exceededMortalLimits`, `dexterityMod`, `hp_max` + `mp_max` + `shp_max`, `knight_attack` |
| 🔵 Intentional | 7 | `permissions`, `campaignId`, `spellModal`, 4 migration/compat paths |

**Total fields requiring a store edit: 9.** None block the test suite from passing. The suite is a regression net for the fields that *do* currently round-trip; fixing the data-loss issues above would extend that net by ~3 tests (one per fix).

---

## Suggested fix order

1. **One PR, low risk** — delete the four wasted-payload dehydrates (#6, #7, #8, #9 option A). No behavioural change, just smaller payloads. Test suite should stay green.
2. **One PR, feature fix** — add `levelAbilitiesCollapsed` to the dehydrate+hydrate (#1). Add the matching test row. One small behaviour change: collapse state now persists.
3. **One PR, orphan cleanup** — delete `character_name`, `traits`, `traitsCount`, the commented `addTrait`, and the `removeTrait` export (#4, #5). Grep the Vue views one more time before deleting.
4. **One PR, metaStore cleanup** — decide whether `token` and `id` should be persisted or removed from hydrate (#2, #3). Whichever direction you pick, make the pair symmetric.

Each PR is independent and can merge in any order. All four together are ~30 lines of store changes and ~3 new test rows.
