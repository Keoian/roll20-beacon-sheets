# Activity Log

## Status
- **Tasks Completed:** 0/17
- **Current Task:** 1 - Remove fabricated D&D 5e conditions and add missing Magi-Knights conditions
- **Last Updated:** Not started

---

## Sessions

### 2026-07-17 — Full compendium-correction pass (plan tasks 1-17)

Executed all 17 tasks from `ralph/plan.md` in one session, verified against
`C:\git\magi-knights-srd` (SRD sources synced into `compendium/`):

1-3. Conditions: removed D&D 5e conditions (blinded, charmed, frightened,
   incapacitated, invisible, stunned); added Disoriented, Unconscious,
   Soul-Siphoned IV; corrected all effects; Distressed/Disoriented/Horrified now
   impose Disadvantage via context-aware roll modes instead of a flat -1.
4. Weapon qualities rewritten as trade-off (Accurate/Massive), trigger-on-16+
   (Forceful/Ensnaring/Staggering Blow), and special (Veil-Piercing 1/encounter
   auto-hit tracked by `veilPiercingUsed`); crit-range mechanic removed.
5. Soul Gun rebuilt on the Firing Pool system: 7 gun types with E-Range/damage/
   ROF, Gun Styles (HDG/SMG), attachments repeating section, RF/MD d8 pools with
   Direct Hit counting, Aiming and Reload tracking.
6. Implement qualities replaced with the 8 compendium qualities plus computed
   Embolden/Radiance/Warding effects and Mana Conduit tracking.
7. NPC: creature types Outsider/Mortal; sizes Small..Colossal with Table 15-6
   modifiers (SRD values, which differ slightly from the plan for Massive);
   Role system with 12 roles; rank damage percentages.
8. Deleted empty BurstDisplay.vue / DiamondDisplay.vue stubs.
9. Endurance Die automated in ability/skill rolls (penalty = attrition level,
   negated when 1d6 >= level; level-6 Disadvantage per roll type). Heartless/
   Fallen Knight, Corruption/Burnout counts computed from eclipse blips.
10. Combat Forms I-X structured system using SRD names (Adaptation, Deflection,
   Vindication, Purgation, Refraction, Reflection, Vibration, Constellation,
   Cessation, Regulation) — the plan's names were wrong. Known + Mastery
   tracking; Form X gates Soul Guns (`hasFormX`).
11. Level-locked Knight abilities panel with SRD effect text.
12. Sleep Phase effect selector + daily limits (Crystalline Seal given/received,
   Mana Conduit, Oppressive Stress, Soul Sacrifice count vs Reputation).
13. Heart Stage per social bond (Threatening..Sympathetic).
14. Rolls to Resist adv/dis per type (Physical/Magic/Horror/Purity); Disoriented
   forces Physical Resist Disadvantage.
15. Magi-Squire section per SRD herald.md (6 Health/3 Mana Blips, fighting
   styles, damage 1d6+3 scaling at L5/10/15, restricted spell paths).
16. Relic capacity indicator (max = Reputation Level).
17. Build verified (`npm run build` passes), stale references grepped out, all
   new state included in dehydrate/hydrate.
