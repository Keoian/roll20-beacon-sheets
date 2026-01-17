# Magi-Knights Character Sheet Attributes

This document catalogs all character sheet attributes in the Magi-Knights Beacon sheet for Roll20 Compendium integration.

**Sheet Type:** Roll20 Beacon (Vue.js/Pinia)
**Main Store:** `src/stores/sheetStore.js`
**Meta Store:** `src/stores/metaStore.js`
**Compendium Status:** Not yet implemented (onDragOver handler is empty)

---

## Table of Contents
1. [Character Metadata](#character-metadata)
2. [Character Basics](#character-basics)
3. [Ability Scores](#ability-scores)
4. [Skills](#skills)
5. [Hit Points & Resources](#hit-points--resources)
6. [Combat Stats](#combat-stats)
7. [Magic & Spells](#magic--spells)
8. [Repeating Sections](#repeating-sections)
9. [Student Persona](#student-persona)
10. [Magi-Knight Persona](#magi-knight-persona)
11. [Soul Eclipse & Crystal](#soul-eclipse--crystal)
12. [Social & Relationships](#social--relationships)
13. [Transform State](#transform-state)
14. [Override Fields](#override-fields)

---

## Character Metadata
*Stored in metaStore.js*

| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `id` | string | Character ID | metaStore.js:10 |
| `name` | string | Character name | metaStore.js:11 |
| `avatar` | string | Character avatar URL | metaStore.js:12 |
| `bio` | string | Character biography | metaStore.js:13 |
| `gmNotes` | string | GM-only notes | metaStore.js:14 |
| `token` | object | Token data | metaStore.js:15 |
| `campaignId` | string | Campaign ID | metaStore.js:16 |

---

## Character Basics
*Stored in sheetStore.js*

| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `sheet_mode` | string | 'pc', 'npc', 'squadron' | sheetStore.js:28 |
| `character_name` | string | Character name (duplicate) | sheetStore.js:36 |
| `level` | number | Character level (1-15) | sheetStore.js:37 |
| `reputation` | number | Reputation level (0-5+) | sheetStore.js:38 |
| `player` | string | Player name | sheetStore.js:39 |
| `inspiration` | number | Inspiration points | sheetStore.js:40 |
| `stress` | number | Stress level (0-6) | sheetStore.js:41 |
| `exhaustion` | number | Exhaustion level (0-6) | sheetStore.js:42 |
| `student_type` | string | Student background type | sheetStore.js:43 |
| `exceededMortalLimits` | boolean | Computed: reputation >= 4 | sheetStore.js:55 |
| `customProficiency` | string | Manual proficiency override | sheetStore.js:119 |
| `proficiency` | number | Calculated proficiency bonus | sheetStore.js:120 |

---

## Ability Scores
*All ability scores have a base score and computed modifier*

| Attribute Name | Data Type | Formula | Location |
|----------------|-----------|---------|----------|
| `strength` | number | Base score (default: 10) | sheetStore.js:46 |
| `dexterity` | number | Base score (default: 10) | sheetStore.js:47 |
| `constitution` | number | Base score (default: 10) | sheetStore.js:48 |
| `intelligence` | number | Base score (default: 10) | sheetStore.js:49 |
| `wisdom` | number | Base score (default: 10) | sheetStore.js:50 |
| `charisma` | number | Base score (default: 10) | sheetStore.js:51 |
| `strengthMod` | number | (strength - 10) / 2, capped at +5 until Rep 4+ | sheetStore.js:57-60 |
| `dexterityMod` | number | (dexterity - 10) / 2, capped at +5 until Rep 4+ | sheetStore.js:61-64 |
| `constitutionMod` | number | (constitution - 10) / 2, capped at +5 until Rep 4+ | sheetStore.js:65-68 |
| `intelligenceMod` | number | (intelligence - 10) / 2, capped at +5 until Rep 4+ | sheetStore.js:69-72 |
| `wisdomMod` | number | (wisdom - 10) / 2, capped at +5 until Rep 4+ | sheetStore.js:73-76 |
| `charismaMod` | number | (charisma - 10) / 2, capped at +5 until Rep 4+ | sheetStore.js:77-80 |

**Note:** Ability modifiers are capped at +5 until the character reaches Reputation Level IV (reputation >= 4), which grants "Exceed a Mortal's Limits."

---

## Skills
*All skills follow the same structure*

| Skill Name | Abilities | Location |
|------------|-----------|----------|
| `academic_arts` | intelligence, wisdom | sheetStore.js:138 |
| `athletics` | dexterity, strength | sheetStore.js:139 |
| `coordination` | dexterity | sheetStore.js:140 |
| `creativity` | intelligence, wisdom | sheetStore.js:141 |
| `deception` | intelligence, charisma | sheetStore.js:142 |
| `influence` | strength, charisma | sheetStore.js:143 |
| `insight` | wisdom | sheetStore.js:144 |
| `investigation` | intelligence, wisdom | sheetStore.js:145 |
| `leadership` | charisma | sheetStore.js:146 |
| `medicine` | intelligence, wisdom | sheetStore.js:147 |
| `mysticism` | intelligence | sheetStore.js:148 |
| `perception` | wisdom | sheetStore.js:149 |
| `performance` | str, dex, con, int, wis, cha (all) | sheetStore.js:150 |
| `persuasion` | intelligence, wisdom, charisma | sheetStore.js:151 |
| `purity` | wisdom, charisma | sheetStore.js:152 |
| `stealth` | dexterity | sheetStore.js:153 |
| `stem` | intelligence | sheetStore.js:154 |

### Skill Structure
Each skill has the following properties:

| Property | Data Type | Notes |
|----------|-----------|-------|
| `proficiency` | boolean | Whether proficient in skill |
| `ability` | string | Selected ability (from abilitiesList) |
| `abilitiesList` | array[string] | Available abilities for skill |
| `overrideValue` | string | Manual override value |
| `value` | number | Computed: ability mod + prof bonus |

---

## Hit Points & Resources

### HP (Hit Points - Magi-Knight)
| Attribute Name | Data Type | Formula | Location |
|----------------|-----------|---------|----------|
| `hp.current` | number | Current HP | sheetStore.js:219 |
| `hp.temp` | number | Temporary HP | sheetStore.js:220 |
| `hp.max` | number (computed) | 10 + CON + (Level-1) × (6 + CON) | sheetStore.js:205-217 |
| `hp_max_override` | string | Manual max HP override | sheetStore.js:204 |

### MP (Magic Points)
| Attribute Name | Data Type | Formula | Location |
|----------------|-----------|---------|----------|
| `mp.current` | number | Current MP | sheetStore.js:241 |
| `mp.max` | number (computed) | (Level + MAM + Rep) × 2 | sheetStore.js:226-239 |
| `mp_max_override` | string | Manual max MP override | sheetStore.js:225 |

### SHP (Student Hit Points)
| Attribute Name | Data Type | Formula | Location |
|----------------|-----------|---------|----------|
| `shp.current` | number | Current SHP | sheetStore.js:259 |
| `shp.max` | number (computed) | 10 + CON + Rep | sheetStore.js:247-256 |
| `shp_max_override` | string | Manual max SHP override | sheetStore.js:246 |

---

## Combat Stats

### Initiative
| Attribute Name | Data Type | Formula | Location |
|----------------|-----------|---------|----------|
| `initiative` | number (computed) | DEX mod (or override) | sheetStore.js:178-196 |
| `initiative_override` | string | Manual initiative override | sheetStore.js:177 |

### Spell Attack & DC
| Attribute Name | Data Type | Formula | Location |
|----------------|-----------|---------|----------|
| `spell_attack` | number (computed) | Proficiency + MAM | sheetStore.js:267-280 |
| `spell_attack_override` | string | Manual override | sheetStore.js:266 |
| `spell_dc` | number (computed) | 8 + Proficiency + MAM | sheetStore.js:282-296 |
| `spell_dc_override` | string | Manual override | sheetStore.js:282 |

---

## Magic & Spells

| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `elemental_affinity` | string | Fire, Water, Earth, Air, Light, Dark | sheetStore.js:198 |
| `magic_style` | string | Magic fighting style | sheetStore.js:199 |
| `element_name` | string | Custom element name | sheetStore.js:200 |
| `mam` | string | Magic Ability Modifier (ability name) | sheetStore.js:201 |
| `elemental_enhancement_1` | string | First enhancement | sheetStore.js:262 |
| `elemental_enhancement_2` | string | Second enhancement | sheetStore.js:263 |
| `roll_resist_proficiency` | string | Resist proficiency selection | sheetStore.js:264 |
| `max_spell_tier` | number (computed) | Based on level (1-6) | sheetStore.js:108 |

---

## Repeating Sections

### Spells (`sections.spells`)
*Each spell has 6 tiers (I-VI)*

| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `_id` | string | UUID | Auto-generated |
| `name` | string | Spell name | sheetStore.js:511 |
| `range` | string | Spell range | sheetStore.js:512 |
| `tier_I_name` | string | Tier 1 name | sheetStore.js:514 |
| `tier_I_description` | string | Tier 1 description | sheetStore.js:515 |
| `tier_I_special` | string | Tier 1 special properties | sheetStore.js:516 |
| `tier_I_action` | string | Tier 1 action type | sheetStore.js:517 |
| `tier_I_dice` | string | Tier 1 damage/effect dice | sheetStore.js:518 |
| `tier_II_name` | string | Tier 2 name | sheetStore.js:520 |
| `tier_II_description` | string | Tier 2 description | sheetStore.js:521 |
| `tier_II_special` | string | Tier 2 special properties | sheetStore.js:522 |
| `tier_II_action` | string | Tier 2 action type | sheetStore.js:523 |
| `tier_II_dice` | string | Tier 2 damage/effect dice | sheetStore.js:524 |
| `tier_III_name` | string | Tier 3 name | sheetStore.js:526 |
| `tier_III_description` | string | Tier 3 description | sheetStore.js:527 |
| `tier_III_special` | string | Tier 3 special properties | sheetStore.js:528 |
| `tier_III_action` | string | Tier 3 action type | sheetStore.js:529 |
| `tier_III_dice` | string | Tier 3 damage/effect dice | sheetStore.js:530 |
| `tier_IV_name` | string | Tier 4 name | sheetStore.js:532 |
| `tier_IV_description` | string | Tier 4 description | sheetStore.js:533 |
| `tier_IV_special` | string | Tier 4 special properties | sheetStore.js:534 |
| `tier_IV_action` | string | Tier 4 action type | sheetStore.js:535 |
| `tier_IV_dice` | string | Tier 4 damage/effect dice | sheetStore.js:536 |
| `tier_V_name` | string | Tier 5 name | sheetStore.js:538 |
| `tier_V_description` | string | Tier 5 description | sheetStore.js:539 |
| `tier_V_special` | string | Tier 5 special properties | sheetStore.js:540 |
| `tier_V_action` | string | Tier 5 action type | sheetStore.js:541 |
| `tier_V_dice` | string | Tier 5 damage/effect dice | sheetStore.js:542 |
| `tier_VI_name` | string | Tier 6 name | sheetStore.js:544 |
| `tier_VI_description` | string | Tier 6 description | sheetStore.js:545 |
| `tier_VI_special` | string | Tier 6 special properties | sheetStore.js:546 |
| `tier_VI_action` | string | Tier 6 action type | sheetStore.js:547 |
| `tier_VI_dice` | string | Tier 6 damage/effect dice | sheetStore.js:548 |

**Spell Tier MP Costs:**
- Tier I: 3 MP
- Tier II: 6 MP
- Tier III: 15 MP
- Tier IV: 25 MP
- Tier V: 36 MP
- Tier VI: 45 MP

### Techniques (`sections.techniques`)
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `_id` | string | UUID | Auto-generated |
| `name` | string | Technique name | sheetStore.js:436 |
| `description` | string | Technique description | sheetStore.js:437 |
| `type` | string | Technique type/category | sheetStore.js:438 |
| `collapsed` | boolean | UI state | sheetStore.js:439 |

### Shards (`sections.shards`)
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `_id` | string | UUID | Auto-generated |
| `name` | string | Shard name | sheetStore.js:449 |
| `description` | string | Shard description | sheetStore.js:450 |
| `rarity` | number | Rarity (1-5) | sheetStore.js:451 |
| `cost` | string | Shard cost | sheetStore.js:452 |
| `collapsed` | boolean | UI state | sheetStore.js:453 |

### Gear (`sections.gear`)
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `_id` | string | UUID | Auto-generated |
| `name` | string | Item name | sheetStore.js:463 |
| `description` | string | Item description | sheetStore.js:464 |
| `collapsed` | boolean | UI state | sheetStore.js:465 |

### Relics (`sections.relics`)
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `_id` | string | UUID | Auto-generated |
| `name` | string | Relic name | sheetStore.js:475 |
| `description` | string | Relic description | sheetStore.js:476 |
| `collapsed` | boolean | UI state | sheetStore.js:477 |

### Forms (`sections.forms`)
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `_id` | string | UUID | Auto-generated |
| `name` | string | Form name | sheetStore.js:487 |
| `description` | string | Form description | sheetStore.js:488 |
| `collapsed` | boolean | UI state | sheetStore.js:489 |

### Runes (`sections.runes`)
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `_id` | string | UUID | Auto-generated |
| `name` | string | Rune name | sheetStore.js:499 |
| `description` | string | Rune description | sheetStore.js:500 |
| `collapsed` | boolean | UI state | sheetStore.js:501 |

---

## Student Persona

| Attribute Name | Data Type | Formula | Location |
|----------------|-----------|---------|----------|
| `student_damage` | string (computed) | "1d4+" + (STR + Rep) | sheetStore.js:329-340 |
| `student_damage_override` | string | Manual override | sheetStore.js:328 |
| `student_armor` | number (computed) | 10 + CON + DEX | sheetStore.js:344-354 |
| `student_armor_override` | string | Manual override | sheetStore.js:343 |
| `student_move` | number | Movement speed | sheetStore.js:356 |
| `student_attack` | number (computed) | Prof + max(STR, DEX) | sheetStore.js:360-371 |
| `student_attack_override` | string | Manual override | sheetStore.js:359 |

### Student Ability
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `student_ability.name` | string | Ability name | sheetStore.js:383 |
| `student_ability.description` | string | Ability description | sheetStore.js:384 |
| `student_ability.collapsed` | boolean | UI state | sheetStore.js:385 |

### Fate
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `fate.card` | string | Tarot card | sheetStore.js:388 |
| `fate.name` | string | Fate name | sheetStore.js:389 |

---

## Magi-Knight Persona

| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `knight_damage` | string | Damage dice/formula | sheetStore.js:393 |
| `knight_armor` | number | Armor value | sheetStore.js:394 |
| `knight_hasShield` | boolean | Shield equipped | sheetStore.js:395 |
| `knight_move` | string | Movement speed | sheetStore.js:396 |
| `knight_attack` | number (computed) | Attack bonus | sheetStore.js:399-418 |
| `knight_attack_override` | string | Manual override | sheetStore.js:398 |

### Armor Weave
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `armor_weave.name` | string | Armor name | sheetStore.js:421 |
| `armor_weave.description` | string | Armor description | sheetStore.js:422 |
| `armor_weave.collapsed` | boolean | UI state | sheetStore.js:423 |

### Soul Weapon
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `soul_weapon.name` | string | Weapon name | sheetStore.js:426 |
| `soul_weapon.range` | string | Weapon range | sheetStore.js:427 |
| `soul_weapon.damage` | string | Damage dice/formula | sheetStore.js:428 |
| `soul_weapon.qualities` | string | Weapon qualities | sheetStore.js:429 |
| `soul_weapon.collapsed` | boolean | UI state | sheetStore.js:430 |

---

## Soul Eclipse & Crystal

### Eclipse Chart
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `eclipse` | array[8] | Eclipse levels (0-3 each) | sheetStore.js:298 |
| `eclipse_blips` | array[8] | Blip markers | sheetStore.js:299 |
| `eclipse_phase` | string (computed) | "Soul Eclipse Chart" or "Heartless Knight" | sheetStore.js:300-306 |

### Crystal Facets
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `crystal.facet1` | boolean | Crystal facet 1 | sheetStore.js:310 |
| `crystal.facet2` | boolean | Crystal facet 2 | sheetStore.js:311 |
| `crystal.facet3` | boolean | Crystal facet 3 | sheetStore.js:312 |
| `crystal.facet4` | boolean | Crystal facet 4 | sheetStore.js:313 |
| `crystal.facet5` | boolean | Crystal facet 5 | sheetStore.js:314 |
| `crystal.facet6` | boolean | Crystal facet 6 | sheetStore.js:315 |
| `crystal.facet7` | boolean | Crystal facet 7 | sheetStore.js:316 |

### Other Tracking
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `rested` | boolean | Rested state | sheetStore.js:319 |
| `studied` | boolean | Studied state | sheetStore.js:320 |
| `gloom_gems` | number | Gloom gem count | sheetStore.js:321 |
| `unity_points` | number | Unity point count | sheetStore.js:322 |

---

## Social & Relationships

### Background & Personality
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `interests` | string | Character interests | sheetStore.js:372 |
| `virtues` | string | Character virtues | sheetStore.js:373 |
| `strengths` | string | Character strengths | sheetStore.js:374 |
| `weaknesses` | string | Character weaknesses | sheetStore.js:375 |
| `electives` | string | School electives | sheetStore.js:376 |
| `characteristics` | string | Other characteristics | sheetStore.js:377 |
| `quote` | string | Character quote | sheetStore.js:378 |
| `player_links` | string | Player connection notes | sheetStore.js:379 |
| `backstory` | string | Character backstory | sheetStore.js:380 |

### Social Links - NPCs (`sections.npc-social`)
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `_id` | string | UUID | Auto-generated |
| `name` | string | NPC name | sheetStore.js:561 |
| `points` | number | Relationship points | sheetStore.js:562 |
| `bond_ability` | string | Bond ability description | sheetStore.js:563 |
| `collapsed` | boolean | UI state | sheetStore.js:564 |

### Social Links - Squadron (`sections.squadron-social`)
*Same structure as NPC social links*

| Attribute Name | Data Type | Notes |
|----------------|-----------|-------|
| `_id` | string | UUID |
| `name` | string | Squadron member name |
| `points` | number | Relationship points |
| `bond_ability` | string | Bond ability description |
| `collapsed` | boolean | UI state |

### Club Goal Tallies (`sections.club-goalTallies`)
| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `_id` | string | UUID | Auto-generated |
| `name` | string | Goal name | sheetStore.js:577 |
| `description` | string | Goal description | sheetStore.js:578 |
| `collapsed` | boolean | UI state | sheetStore.js:579 |

---

## Transform State

| Attribute Name | Data Type | Notes | Location |
|----------------|-----------|-------|----------|
| `isTransformed` | boolean | Current form (true = Knight) | sheetStore.js:31 |
| `studentTokenImage` | string | Student form token URL | sheetStore.js:33 |
| `knightTokenImage` | string | Knight form token URL | sheetStore.js:34 |

---

## Override Fields
*Manual override fields that bypass auto-calculation*

| Field | Override Attribute | Location |
|-------|-------------------|----------|
| HP Max | `hp_max_override` | sheetStore.js:204 |
| MP Max | `mp_max_override` | sheetStore.js:225 |
| SHP Max | `shp_max_override` | sheetStore.js:246 |
| Initiative | `initiative_override` | sheetStore.js:177 |
| Spell Attack | `spell_attack_override` | sheetStore.js:266 |
| Spell DC | `spell_dc_override` | sheetStore.js:282 |
| Student Damage | `student_damage_override` | sheetStore.js:328 |
| Student Armor | `student_armor_override` | sheetStore.js:343 |
| Student Attack | `student_attack_override` | sheetStore.js:359 |
| Knight Attack | `knight_attack_override` | sheetStore.js:398 |

---

## Summary Statistics

### Total Attributes by Category

| Category | Count | Notes |
|----------|-------|-------|
| Character Metadata | 7 | Meta store fields |
| Character Basics | 11 | Core attributes |
| Ability Scores | 12 | 6 scores + 6 modifiers |
| Skills | 17 | Each with 4 properties |
| Hit Points/Resources | 9 | HP, MP, SHP + overrides |
| Combat Stats | 6 | Initiative, spell attack/DC |
| Magic & Spells | 8 | Element, style, enhancements |
| Student Persona | 10 | Stats + ability + fate |
| Knight Persona | 10 | Stats + armor weave + soul weapon |
| Eclipse & Crystal | 11 | Eclipse arrays + 7 facets |
| Social/Personality | 9 | Background fields |
| Transform | 3 | State + token images |
| **Repeating Sections** | | |
| ├─ Spells | 32 fields × N | 6 tiers per spell |
| ├─ Techniques | 4 fields × N | |
| ├─ Shards | 5 fields × N | |
| ├─ Gear | 3 fields × N | |
| ├─ Relics | 3 fields × N | |
| ├─ Forms | 3 fields × N | |
| ├─ Runes | 3 fields × N | |
| ├─ NPC Social | 4 fields × N | |
| ├─ Squadron Social | 4 fields × N | |
| └─ Goal Tallies | 3 fields × N | |

---

## Compendium Integration Notes

### Current Status
- **Handler:** `src/relay/handlers/onDragOver.js` (currently empty)
- **Feature Request:** FEAT-008 in `defects_feature_requests.md`
- **Priority:** Low (long-term)
- **Prerequisites:** Requires creating and selling a compendium on Roll20

### Recommended Implementation Approach

When implementing compendium integration, the `onDragOver` handler should map compendium data to the appropriate section:

1. **Spells** → `sections.spells.addItem()`
2. **Equipment/Gear** → `sections.gear.addItem()`
3. **Magical Items** → `sections.shards.addItem()` or `sections.relics.addItem()`
4. **Techniques/Abilities** → `sections.techniques.addItem()`

### Compendium JSON Attribute Mapping

For optimal integration, compendium items should use these attribute names:

**Spell Structure:**
```json
{
  "name": "Spell Name",
  "range": "30 feet",
  "tier_I_name": "Tier 1 Name",
  "tier_I_description": "Description",
  "tier_I_special": "Special properties",
  "tier_I_action": "Action type",
  "tier_I_dice": "2d6",
  // ... repeat for tiers II-VI
}
```

**Item/Gear Structure:**
```json
{
  "name": "Item Name",
  "description": "Item description"
}
```

**Shard Structure:**
```json
{
  "name": "Shard Name",
  "description": "Shard description",
  "rarity": 3,
  "cost": "5000 gold"
}
```

### Data Access Pattern

All data is accessed through Pinia stores:
- **Get:** `useSheetStore().attributeName`
- **Set:** `useSheetStore().attributeName = value`
- **Add to repeating:** `useSheetStore().addRow('sectionName')`
- **Remove from repeating:** `useSheetStore().removeRow('sectionName', id)`

---

## References

- **Main Store:** `magiknights/src/stores/sheetStore.js`
- **Meta Store:** `magiknights/src/stores/metaStore.js`
- **Store Index:** `magiknights/src/stores/index.js`
- **Relay Handlers:** `magiknights/src/relay/handlers/`
- **Compendium Handler:** `magiknights/src/relay/handlers/onDragOver.js`
- **Feature Requests:** `magiknights/defects_feature_requests.md`

---

*Last Updated: 2026-01-17*
*Sheet Version: Magi-Knights Awakening - Roll20 Beacon*
