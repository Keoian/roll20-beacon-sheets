# Plan: Fix Magi-Knights Hydration Issues

Companion to [`HYDRATION_ISSUES.md`](./HYDRATION_ISSUES.md). Ordered by risk, lowest first. Each PR is independent and can ship alone.

Line numbers are against `magiknights/src/stores/sheetStore.js` and `magiknights/src/stores/metaStore.js` as of the issues report.

---

## PR 1 — Drop computed-value noise from the dehydrate payload

**Fixes:** 🟡 #6, #7, #8, #9 (4 wasted-payload issues).

**Risk:** Zero. No behaviour change — just smaller Firebase writes. Test suite should stay green at 269/269.

### Edits (`magiknights/src/stores/sheetStore.js`)

Delete these lines from the dehydrate payload:

- **Line 2045**: `exceededMortalLimits: exceededMortalLimits.value,`
- **Line 2046**: `dexterityMod: dexterityMod.value,`
- **Line 2081**: `hp_max: hp_max.value,`
- **Line 2083**: `mp_max: mp_max.value,`
- **Line 2085**: `shp_max: shp_max.value,`
- **Line 2110**: `knight_attack: knight_attack.value,`

Delete from the hydrate block:

- **Line 2237**: `knight_attack.value = hydrateStore.knight_attack ?? knight_attack.value` — `knight_attack_override` on the next line already covers the setter path.

### Optional follow-up

Also fix the dead `knight_attack` computed at `sheetStore.js:948-968`. Either restore the commented-out getter body (`proficiency + MAM mod`) or delete the computed entirely and rename `knight_attack_override` → `knight_attack`. Out of scope for a "just shrink the payload" PR — defer to a separate cleanup.

### Tests

None to add. The existing suite validates nothing breaks.

### Verify

1. `cd magiknights && npm test` → expect 269/269.
2. Optional: add a scratch test that asserts `Object.keys(sheet.dehydrate())` does **not** include the 6 removed keys. Drop it before committing.

---

## PR 2 — Persist `levelAbilitiesCollapsed`

**Fixes:** 🔴 #1 (the only one of the three "data loss" items that's a real user-visible bug — the other two are asymmetries handled in PR 4).

**Risk:** Low. One new persisted field. User-visible change: the Level-Locked Abilities section now remembers its collapse state across reloads.

### Edits (`magiknights/src/stores/sheetStore.js`)

Add to the dehydrate object around line 2057 (next to `combat_forms_collapsed`):

```js
levelAbilitiesCollapsed: levelAbilitiesCollapsed.value,
```

Add to the hydrate block around line 2217 (next to `combatFormsCollapsed`):

```js
levelAbilitiesCollapsed.value = hydrateStore.levelAbilitiesCollapsed ?? levelAbilitiesCollapsed.value;
```

### Tests (`magiknights/src/__tests__/hydration/scalarFields.spec.js`)

- Add `['levelAbilitiesCollapsed', true]` to the `scalarCases` table.
- Delete the note comment at the top of the file that calls out `levelAbilitiesCollapsed` as an excluded gap.

### Verify

1. `npm test` → expect **270/270**.
2. Smoke-test: comment out the new dehydrate line, re-run, confirm **only** the new row (and no unrelated tests) fails. Uncomment, re-run green.
3. Manual check in `npm run dev`: collapse the Level-Locked Abilities section, reload, confirm it stays collapsed.

---

## PR 3 — Delete orphaned `character_name` and `traits` ghost feature

**Fixes:** 🟠 #4, #5 (orphaned / dead code).

**Risk:** Low, but requires one grep to confirm no stale view references before deleting.

### Pre-check

```sh
grep -rn "sheet\.character_name\|sheet\.traits\b\|sheet\.traitsCount\|sheet\.removeTrait" magiknights/src
```

**Expected:** zero hits outside `sheetStore.js` itself and `stores/index.js:98`. If any Vue view shows up, **stop** and investigate before deleting — the feature may be half-wired and in use somewhere the initial exploration missed.

### Edits (`magiknights/src/stores/sheetStore.js`)

- **Line 37**: delete `const character_name = ref('')`
- **Lines 861-862**: delete `const traits = ref([])` and `const traitsCount = computed(() => traits.value?.length)`
- **Lines 1597-1606**: delete the commented-out `addTrait` block
- **Line 3810**: delete `traitsCount,` from the return statement
- **Line 3863**: delete `removeTrait: (traitId) => removeTrait(traits, traitId),` from the return statement

### Edits (`magiknights/src/stores/index.js`)

- **Line 98**: delete `stores.sheet.traits = []` from `loadExampleData`.

### Tests

None needed — deleting dead code. Existing suite should stay green.

### Verify

1. `npm test` → expect 270/270 (or 269 if PR 2 hasn't landed yet).
2. `npm run dev` and click through every tab (Base Stats, Student, Magi-Knight, Background, Misc/Settings, NPC mode). No console errors, no broken renders.

---

## PR 4 — Make `metaStore` hydrate/dehydrate symmetric

**Fixes:** 🔴 #2 (`metaStore.token`), 🔴 #3 (`metaStore.id`).

**Risk:** Low. The only real ambiguity is *which direction* to make the asymmetry symmetric.

### Decision gate (run before editing)

```sh
grep -rn "meta\.token\s*=\|meta\.id\s*=" magiknights/src
```

- **If** any non-SDK code writes to `meta.token` or `meta.id` → go **Option A** (add them to `dehydrate` so user writes persist).
- **If** only `metaStore.hydrate` and the Beacon SDK relay write them → go **Option B** (remove from `hydrate` — the SDK owns these fields and the sheet should be read-only on them).

**Expected answer:** Option B for both. Token and id are server-owned via the SDK profile, and no UI surface should be mutating them from the sheet side.

### Option B edits (`magiknights/src/stores/metaStore.js`)

- **Line 35**: delete `id.value = hydrateStore.id ?? id.value`
- **Line 40**: delete `token.value = hydrateStore.token ?? token.value`
- **Lines 10 and 15**: delete `const id = ref('')` and `const token = ref({})` — **but only if** they are not referenced in the `return { ... }` block at lines 43-54. If they are, delete the return entries too.

### Tests (`magiknights/src/__tests__/hydration/metaStore.spec.js`)

- Delete the `restores id and token when supplied (Beacon profile flow)` test case (around lines 52-64) — the behaviour it pins will no longer exist.
- Keep the `name`/`bio`/`gmNotes`/`avatar` round-trip test untouched.

### Verify

1. `npm test` → expect 269/269 (down one from the deleted test).
2. `npm run dev`, confirm character loads with the correct token image and the correct id in the URL/route. Both values come from the SDK's profile path (`character.id`, `character.token`) at the top level of the payload, not from `character.attributes.meta`, so removing the metaStore hydrate should not affect them.

---

## Summary

| PR | Severity fixed | Lines changed | Test delta | Risk |
|---|---|---|---|---|
| 1 | 🟡 × 4 | –7 | 0 | zero |
| 2 | 🔴 × 1 | +2 | +1 | low |
| 3 | 🟠 × 2 | –7 | 0 | low (grep first) |
| 4 | 🔴 × 2 | –4 | –1 | low (decision gate) |
| **Total** | **9 issues** | **~20 net deletions** | **269 → 270** | — |

## Recommended execution order

1. **PR 1** first — zero-risk warm-up that confirms the test suite reliably gates changes.
2. **PR 3** — small cleanup, isolated from PR 1, gives confidence before the behavioural fix.
3. **PR 2** — adds the one genuinely new persisted field. Ships the user-visible improvement.
4. **PR 4** last — involves the metaStore decision gate; easier once the other three have already merged and you want a quiet moment to review the grep output.

Total effort estimate: **under an hour of focused work** across all four PRs, plus a few minutes of manual QA in the dev server for PRs 2 and 3.

---

## Out of scope (explicitly deferred)

- Restoring / removing the commented-out `knight_attack` getter body (see PR 1 optional follow-up).
- Tier-3 relay integration tests (Beacon dispatch stub).
- Component-level tests validating `v-model` wiring from DOM → store.
- ESLint / Prettier setup for `magiknights/`.

These are separate bodies of work and should not be bundled into the issue-fix PRs.
