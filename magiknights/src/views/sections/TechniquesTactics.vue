<script setup>
import { ref } from 'vue';
import NotchContainer from '@/components/NotchContainer.vue';
import Collapsible from '@/components/Collapsible.vue';
import RepeatingSection from '@/components/RepeatingSection.vue';
import TechniqueItem from '@/components/TechniqueItem.vue';
import TacticItem from '@/components/TacticItem.vue';

import {useSheetStore} from '@/stores';

const sheet = useSheetStore();

// Collapsible section states
const techniquesCollapsed = ref(false);
const tacticsCollapsed = ref(false);

// Reset technique uses based on frequency
const resetEncounterTechniques = () => {
  sheet.resetTechniqueUses('1/Encounter');
};

const resetRoundTechniques = () => {
  sheet.resetTechniqueUses('1/Round');
};

const resetRestTechniques = () => {
  sheet.resetTechniqueUses('1/Rest');
  sheet.resetTechniqueUses('1/Phase');
};

const resetAllTechniques = () => {
  sheet.resetTechniqueUses('all');
};

// Common tactics library for quick adding
const commonTactics = [
  {
    name: 'Adept of Magic',
    description: 'Add +1 to your Reputation Level for calculating your total Mana Coefficient (MCO).',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: '+1 Rep for MCO',
    active: true
  },
  {
    name: 'Tough as Nails',
    description: 'Gain +2 Student HP and +2 HP per Magi-Knight Level while transformed. Points are retroactively received.',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: '+2 Student HP, +2 HP/Level',
    active: true
  },
  {
    name: 'Magical Foresight',
    description: 'Add your MAM to your Dexterity Modifier when rolling Initiative. Attacks made against you during an Ambush do not gain Advantage.',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: '+MAM to Initiative',
    active: true
  },
  {
    name: 'Combat Form Drills',
    description: 'Learn a second Combat Form. Once per Turn as a Free Action, switch between your two Combat Forms. Repeatable for a third form.',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: '+1 Combat Form',
    active: true
  },
  {
    name: 'Combat Form Mastery',
    description: 'Upgrade all Combat Form modifiers. See Combat Forms document for detailed Mastery upgrades for each Form.',
    prerequisites: 'Level 9+, Combat Form Drills',
    effectType: 'Passive',
    automaticBonus: 'Enhanced Forms',
    active: true
  },
  {
    name: 'Disciplined Agility',
    description: 'Gain an additional Reaction each Round.',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: '+1 Reaction/Round',
    active: true
  },
  {
    name: 'Elemental Bulwark',
    description: 'Reduce all Physical Damage you would receive by 3. Applied before other reduction effects.',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: '-3 Physical Damage',
    active: true
  },
  {
    name: 'Implement Mastery',
    description: 'When making a Weapon Attack with your Magical Implement, add your MAM to both your Attack and Damage in addition to any other modifiers.',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: '+MAM to Implement Attacks',
    active: true
  },
  {
    name: 'Martial Artist',
    description: 'Unarmed Damage Die becomes 1d6. Choose DEX or STR for unarmed damage. Perform Unarmed Attack as Bonus Action. Unarmed Attacks gain Staggering Blow quality.',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: '1d6 Unarmed, Bonus Unarmed Attack',
    active: true
  },
  {
    name: 'Quicksword Technique',
    description: 'After making a Weapon Attack against a target, you no longer Provoke Attacks from them for the remainder of your turn. After making a Weapon Attack, you may Move 10 feet.',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: 'No Provoke, +10ft Move',
    active: true
  },
  {
    name: 'Resilient Soul Crystal',
    description: 'Add +1 to a Statistic of your choice AND gain proficiency with one Roll to Resist (STR/DEX/CON), OR gain proficiency with Rolls to Resist: Magic.',
    prerequisites: 'None',
    effectType: 'Passive',
    automaticBonus: '+1 Stat or Magic Resist',
    active: true
  },
  {
    name: 'Shield of the Guardian',
    description: 'Reaction: Reduce damage to you or an adjacent ally by 3 + your Reputation Level. Applied before other reduction effects.',
    prerequisites: 'Wielding Knight\'s Force Shield',
    effectType: 'Reaction',
    automaticBonus: 'Protect Ally',
    active: true
  }
];

// Battle Techniques library (SRD battle-techniques.md) - gained at levels 3, 6, 9, 12, 15
const battleTechniques = [
  { name: 'Action Burst', levelRequired: 3, frequency: '1/Phase', actionType: 'Immediate', description: 'A Full-Round Action this round becomes a Standard Action, and one Bonus Action becomes a Free Action.' },
  { name: 'Battle Frenzy', levelRequired: 3, frequency: '1/Encounter', actionType: 'Bonus', description: 'Gain Frenzied: remove Distressed; STR Weapon Attacks gain Advantage; Advantage on STR Resists/Checks; +2+Rep STR Weapon Damage; no Formations/Combos. Ends on Exposed/Unconscious/combat end or Purity Check (DC 12+Rep) at end of turn. When it ends: +3 Exhaustion.' },
  { name: 'Battle Frenzy [Controlled]', levelRequired: 6, frequency: '', actionType: '', description: 'Upgrade (requires Battle Frenzy): Attack bonus = Rep Level instead of damage bonus; Formations/Combos allowed; no Advantage on STR attacks; no Exhaustion when Frenzied ends.' },
  { name: 'Battle Frenzy [Unleashed]', levelRequired: 9, frequency: '', actionType: '', description: 'Upgrade (requires Battle Frenzy, not Controlled): +2x Rep Weapon Damage; may activate while Horrified/Distressed to remove it; first STR Weapon Attack auto-hits +5 damage; first STR Skill Check treated as 20.' },
  { name: 'Combination Maneuver Mastery', levelRequired: 6, frequency: 'At-Will', actionType: '', description: 'Automatically pass your Maneuver Tax test. Can negate the failed result of one other squad member.' },
  { name: 'Coordinated Assault', levelRequired: 3, frequency: '1/Turn', actionType: '', description: 'Weapon Attack vs target adjacent to a Magi-Knight deals +2d4 damage. Stackable: each additional take adds 2d4 (max 10d4).' },
  { name: 'Counter Blast', levelRequired: 5, frequency: '1/Turn', actionType: 'Reaction', description: 'When hit by a Spell Attack: reduce damage by 1d12 + Level + Rep (min 1).' },
  { name: 'Counter Blast [Improved]', levelRequired: 9, frequency: '', actionType: '', description: 'Upgrade (requires Counter Blast): if damage reduced to 0, reflect the negated amount back to the attacker.' },
  { name: 'Extricate Aether', levelRequired: 6, frequency: '1/Round', actionType: '', description: 'First successful Weapon Attack restores 1d4+Rep MP (1d8+Rep with Magical Implement).' },
  { name: 'Fatal Focus', levelRequired: 3, frequency: '1/Encounter', actionType: 'Free', description: 'Choose a target: first successful Weapon Attack each Round vs them gains +1d6 damage. On kill: recover 2 Stress, 1 Exhaustion.' },
  { name: 'Fatal Focus [Improved]', levelRequired: 9, frequency: '', actionType: '', description: 'Upgrade (requires Fatal Focus): also add 1/2 Level to damage on hits vs the target.' },
  { name: 'Heroic Resolve', levelRequired: 9, frequency: '1/Phase', actionType: 'Immediate', description: 'End one Condition affecting you, as if under Cleanse (1).' },
  { name: 'Knight\'s Insight', levelRequired: 9, frequency: '1/Encounter', actionType: 'Immediate', description: 'Make one missed Weapon Attack become successful.' },
  { name: 'Knight\'s Resolution', levelRequired: 9, frequency: '1/Encounter', actionType: 'Immediate', description: 'Make one failed Roll to Resist become successful.' },
  { name: 'Leadership [Talented]', levelRequired: 3, frequency: '1/Phase', actionType: 'Standard', description: 'Requires Leadership Proficiency. Grant Temp HP to squadron within 30ft = Leadership mod + Rep (+ Leadership Die if Squadron Leader). Exposed recipients recover 1 HP.' },
  { name: 'Exceptional Leadership', levelRequired: 9, frequency: '1/Encounter', actionType: '', description: 'Upgrade (requires Leadership [Talented]): attempt to remove Distressed/Horrified from a squadmate; Leadership Check with Advantage.' },
  { name: 'Magical Augmentation', levelRequired: 3, frequency: '1/Turn', actionType: '', description: 'Pool of d8s = Proficiency Bonus (refreshes each Sleep Phase). Add one die to a visible Magi-Knight\'s Skill Check, Attack, single-target Damage/Healing, or Roll to Resist.' },
  { name: 'Overpowering Surge', levelRequired: 3, frequency: '1/Phase', actionType: 'Full-Round', description: 'Spell Attack with Advantage. Single target: +1/2 Rep d12s damage. Multiple targets: +1/2 Rep d6s.' },
  { name: 'Perfect Parry', levelRequired: 6, frequency: '1/Round', actionType: 'Immediate', description: 'When taking Physical Damage: reduce it by 1d12 + Level + Rep (min 1).' },
  { name: 'Perfect Riposte', levelRequired: 9, frequency: '', actionType: 'Reaction', description: 'Upgrade (requires Perfect Parry): if damage reduced to 0, deal Weapon Damage + Level to the attacker.' },
  { name: 'Scathing Retort', levelRequired: 3, frequency: '1/Encounter', actionType: 'Reaction', description: 'Enemy Action within 60ft: roll 1d10 and reduce their next Attack, Damage, or Roll to Resist by the result (declare before results).' },
  { name: 'Sidestep', levelRequired: 3, frequency: '1/Encounter', actionType: 'Reaction', description: 'When attacked: halve the damage, ignore Conditions from the attack, then Teleport 15ft.' },
  { name: 'Sidestep [Improved]', levelRequired: 6, frequency: '', actionType: '', description: 'Upgrade (requires Sidestep): teleport directly behind the target and make an immediate Weapon Attack.' },
  { name: 'Soul Crystal [Illumination]', levelRequired: 3, frequency: '1/Encounter', actionType: 'Full-Round', description: 'Enemies within 20ft Roll to Resist (Magic) vs Spell DC or gain Disoriented until end of your next turn. Nemesis+ immune.' },
  { name: 'Soul Crystal [Purification]', levelRequired: 6, frequency: '1/Phase', actionType: 'Bonus', description: 'Upgrade (requires Illumination): Roll to Resist vs up to 3 Conditions on you or squadmates in Beacon range; remove on success (Cleanse 1).' },
  { name: 'Squadron Formation Mastery', levelRequired: 6, frequency: 'At-Will', actionType: '', description: 'Reduce the Inspiration Point cost of Squadron Formations you are part of by 1 (min 1).' }
];

// Combat Tactics not yet in the common library (SRD combat-tactics.md)
const additionalCombatTactics = [
  { name: 'Divine Tailor', description: 'Standard Action: Recharge an expended Divination Slot. Full-Round: Turn a Reversed Card Upright.', prerequisites: 'Divination Spell Path', effectType: 'Active', automaticBonus: 'Divination support', active: true },
  { name: 'Elemental Curing', description: '1/Round when restoring HP to another target with a spell: reroll one die. Or pay +1/2 MP cost to maximize all dice.', prerequisites: 'None', effectType: 'Active', automaticBonus: 'Reroll healing die', active: true },
  { name: 'Elemental Curing [Enhanced]', description: 'Your Elemental Curing automatically gains Cleanse (1). Multi-target spells Cleanse only one target.', prerequisites: 'Elemental Curing', effectType: 'Passive', automaticBonus: 'Curing Cleanse (1)', active: true },
  { name: 'Elemental Relocation', description: 'After being hit by a Physical Attack (and resolving it), if you have no Condition: Teleport 5ft away.', prerequisites: 'None', effectType: 'Reaction', automaticBonus: 'Teleport 5ft', active: true },
  { name: 'Endless Resolve', description: 'First Stress Point after Sleep Phase is reduced by 1. 1/Sleep Phase: reduce Stress by 3 but gain 1 Exhaustion.', prerequisites: 'None', effectType: 'Passive', automaticBonus: '-1 first Stress', active: true },
  { name: 'Enduring Mindset (Combat)', description: '1/Combat Encounter, Immediate: when you or ally within 60ft fail the Endurance Die, change the result to 6.', prerequisites: 'None', effectType: 'Active', automaticBonus: 'Endurance Die = 6', active: true },
  { name: 'Intensify Element', description: 'Replace your Elemental Summon\'s Special Ability with an element-specific version (Reflecting/Entangling/Elusive/Revitalize/Mana-Dense).', prerequisites: 'Summoning Spell Path', effectType: 'Passive', automaticBonus: 'Summon upgrade', active: true },
  { name: 'Refocused Control', description: 'Reaction: when a Horde or Vassal succeeds on a Roll to Resist against your Spell, force a reroll. 1/Round.', prerequisites: 'None', effectType: 'Reaction', automaticBonus: 'Force reroll', active: true },
  { name: 'Reinforced Connection', description: 'Companion\'s True Soul-Link adds your Level to the total. Range of Influence +30ft.', prerequisites: 'Enhanced Summon: Companion', effectType: 'Passive', automaticBonus: '+Level Soul-Link, +30ft', active: true },
  { name: 'Shoulder to the Wheel', description: 'First Exhaustion Point after Sleep Phase is reduced by 1. 1/Sleep Phase: reduce Exhaustion by 1 but gain 2 Stress.', prerequisites: 'None', effectType: 'Passive', automaticBonus: '-1 first Exhaustion', active: true },
  { name: 'Single-Minded Focus', description: 'Total Focus is only lost when you become Horrified or Unconscious.', prerequisites: 'None', effectType: 'Passive', automaticBonus: 'Sturdy Total Focus', active: true },
  { name: 'Telepathic Summoner', description: 'Ignore Silenced effects that involve Issuing Commands. Maintain Perfectly Synchronized.', prerequisites: 'Summoning Spell Path', effectType: 'Passive', automaticBonus: 'Silent Commands', active: true },
  { name: 'Trigger Happy', description: 'At end of Combat Encounter: reduce Stress by 1, plus 1 per Mag Dump used that Encounter (max 2 additional).', prerequisites: 'Combat Form X: Regulation', effectType: 'Passive', automaticBonus: 'Stress relief on Open Fire', active: true }
];

// Social Tactics library (SRD social-tactics.md) - chosen alongside Combat Tactics at levels 2, 5, 8, 11, 14
const socialTactics = [
  { name: 'Animal Whisperer', description: 'Simple conversations with animals; Advantage on animal Skill Checks; +1 SP gains with non-magical animals.', prerequisites: 'None', effectType: 'Passive', automaticBonus: 'Animal affinity', active: true },
  { name: 'Club Diehard', description: '+1 Social Points with club members; +10 to club Growth Check.', prerequisites: 'Member of Club/Team', effectType: 'Passive', automaticBonus: '+1 SP club, +10 Growth', active: true },
  { name: 'Diligent Student', description: '-1 DC to School Burden checks; 1/Sleep Phase reroll a natural 1.', prerequisites: 'None', effectType: 'Passive', automaticBonus: '-1 School DC', active: true },
  { name: 'Enchanted Crystal: Box of Omens', description: '1/Sleep Phase: reroll with 3d20; save the lowest as the Omen\'s Reserved Die for a later roll.', prerequisites: 'Level 7+', effectType: 'Active', automaticBonus: '3d20 reroll', active: true },
  { name: 'Enchanted Crystal: Dreamer\'s Box', description: '+1 Inspiration Point capacity; gain an Inspiration Point on Refreshing Sleep.', prerequisites: 'Level 7+', effectType: 'Passive', automaticBonus: '+1 IP capacity', active: true },
  { name: 'Enchanted Crystal: Fortune Box', description: 'Pool of Fortune dice = Proficiency; add 1d6 to non-combat Skill Checks.', prerequisites: 'Level 7+', effectType: 'Active', automaticBonus: 'Fortune Pool', active: true },
  { name: 'Enchanted Crystal: Premonition Box', description: 'Roll 2d20 at School Phase; may substitute either as a Skill Check result.', prerequisites: 'Level 7+', effectType: 'Active', automaticBonus: 'Premonition dice', active: true },
  { name: 'Enchanted Crystal: Tragedy Box', description: 'Store up to 2 Trauma in the box; sacrifice stored Trauma to negate Corruption or auto-pass a Burnout check.', prerequisites: 'Level 7+', effectType: 'Active', automaticBonus: 'Trauma storage', active: true },
  { name: 'Enduring Mindset (Social)', description: '1/Sleep Phase, non-Combat: when you fail the Endurance Die, change the result to 6.', prerequisites: 'None', effectType: 'Active', automaticBonus: 'Endurance Die = 6', active: true },
  { name: 'Greasing Palms', description: '1/Sleep Phase: spend 1 Budget Tally for +5 to a Skill Check result (repeatable).', prerequisites: 'None', effectType: 'Active', automaticBonus: 'Budget for +5', active: true },
  { name: 'Harmlessly Flirtatious', description: '1/Sleep Phase: automatically succeed a social Skill Check through flirting.', prerequisites: 'None', effectType: 'Active', automaticBonus: 'Auto social success', active: true },
  { name: 'Inured to Horror', description: '1/Sleep Phase: swap the digits of a d100 Roll to Resist (Horror).', prerequisites: 'None', effectType: 'Active', automaticBonus: 'd100 digit swap', active: true },
  { name: 'Jaded to a Fault', description: '1/Sleep Phase: lose 1 Social Point to remove 3 Stress.', prerequisites: 'None', effectType: 'Active', automaticBonus: 'SP for Stress', active: true },
  { name: 'Lead by Example', description: '1/Sleep Phase: +1d8 to the Leadership Die (or allow the Squadron Leader to reroll it).', prerequisites: 'Leadership Proficiency', effectType: 'Active', automaticBonus: '+1d8 Leadership', active: true },
  { name: 'Learn a New Skill', description: 'Gain a Skill Proficiency; may also change your Skill Mastery designation.', prerequisites: 'None', effectType: 'Passive', automaticBonus: '+1 Skill Prof', active: true },
  { name: 'Overly Sensitive', description: '1/Sleep Phase: on reaching 6 Stress, roleplay an outburst and reduce Stress by 2.', prerequisites: 'None', effectType: 'Active', automaticBonus: '-2 Stress outburst', active: true },
  { name: 'Playful Banter', description: '1/Sleep Phase, Immediate: reduce your Stress by 2 and squadron members\' Stress by 1.', prerequisites: 'None', effectType: 'Active', automaticBonus: 'Squad Stress relief', active: true },
  { name: 'Renaissance Student', description: 'Add 1/2 Proficiency Bonus to Skills you are not proficient in.', prerequisites: 'None', effectType: 'Passive', automaticBonus: '+1/2 Prof non-prof', active: true },
  { name: 'Shoulder the Burden', description: 'Take 1 Stress to reduce an ally\'s Moment of Catharsis DC by 2.', prerequisites: 'None', effectType: 'Active', automaticBonus: '-2 Catharsis DC', active: true },
  { name: '[Skill] is My Middle Name!', description: '1/Sleep Phase: reroll a failed Skill Check with a chosen proficient Skill.', prerequisites: 'Proficient in chosen Skill', effectType: 'Active', automaticBonus: 'Skill reroll', active: true },
  { name: 'Social Butterfly', description: '+1 Social Point whenever gaining 2+; no Ghosting penalty at Episode end.', prerequisites: 'None', effectType: 'Passive', automaticBonus: '+1 SP on gains', active: true },
  { name: '[Topic], Enthusiast!', description: '+1d8 to Skill Checks when your chosen Topic comes up in a social encounter.', prerequisites: 'None', effectType: 'Passive', automaticBonus: '+1d8 Topic', active: true }
];

const addCommonTactic = (tactic) => {
  const tacticCopy = { ...tactic };
  sheet.addRow('tactics');
  const newTactic = sheet.sections.tactics.rows[sheet.sections.tactics.rows.length - 1];
  Object.assign(newTactic, tacticCopy);
};

const addBattleTechnique = (technique) => {
  sheet.addRow('techniques');
  const newRow = sheet.sections.techniques.rows[sheet.sections.techniques.rows.length - 1];
  Object.assign(newRow, {
    name: technique.name,
    description: technique.description,
    type: 'Battle',
    levelRequired: technique.levelRequired,
    frequency: technique.frequency || 'At-Will',
    maxUses: 1,
    usesRemaining: 1,
    actionType: technique.actionType,
    collapsed: true
  });
};
</script>

<template>
  <NotchContainer class="technique-container" notchType="none" width="thick">
    <h3 class="header">techniques & tactics</h3>

    <!-- Battle Techniques Section -->
    <Collapsible :default="techniquesCollapsed" @collapse="techniquesCollapsed = !techniquesCollapsed">
      <template v-slot:collapsed>
        <div class="section-header">
          <h4 class="subheader">Battle Techniques</h4>
          <span class="count-badge">{{ sheet.sections.techniques.rows.length }}</span>
        </div>
      </template>
      <template v-slot:expanded>
        <div class="section-expanded">
          <div class="section-header-expanded">
            <h4 class="subheader">Battle Techniques</h4>
            <div class="reset-controls">
              <button @click="resetRoundTechniques" class="reset-btn small">Reset Round</button>
              <button @click="resetEncounterTechniques" class="reset-btn small">Reset Encounter</button>
              <button @click="resetRestTechniques" class="reset-btn small">Reset Rest</button>
              <button @click="resetAllTechniques" class="reset-btn">Reset All</button>
            </div>
          </div>

          <!-- Battle Techniques Library -->
          <NotchContainer class="tactics-library" width="thin">
            <details>
              <summary class="library-summary">Battle Techniques Library (Quick Add)</summary>
              <div class="library-grid">
                <button
                  v-for="technique in battleTechniques"
                  :key="technique.name"
                  @click="addBattleTechnique(technique)"
                  class="library-btn"
                  :class="{ locked: sheet.level < technique.levelRequired }"
                  :title="technique.description"
                >
                  {{ technique.name }}
                  <span class="library-bonus">Lv {{ technique.levelRequired }}+{{ technique.frequency ? ' · ' + technique.frequency : '' }}</span>
                </button>
              </div>
            </details>
          </NotchContainer>

          <RepeatingSection name="techniques">
            <TechniqueItem v-for="row in sheet.sections.techniques.rows" :key="row._id" :item="row"/>
          </RepeatingSection>
        </div>
      </template>
    </Collapsible>

    <!-- Combat Tactics Section -->
    <Collapsible :default="tacticsCollapsed" @collapse="tacticsCollapsed = !tacticsCollapsed">
      <template v-slot:collapsed>
        <div class="section-header">
          <h4 class="subheader">Combat Tactics</h4>
          <span class="count-badge">{{ sheet.sections.tactics.rows.filter(t => t.active).length }} / {{ sheet.sections.tactics.rows.length }} Active</span>
        </div>
      </template>
      <template v-slot:expanded>
        <div class="section-expanded">
          <div class="section-header-expanded">
            <h4 class="subheader">Combat Tactics</h4>
          </div>

          <!-- Combat Tactics Library -->
          <NotchContainer class="tactics-library" width="thin">
            <details>
              <summary class="library-summary">Combat Tactics Library (Quick Add)</summary>
              <div class="library-grid">
                <button
                  v-for="tactic in [...commonTactics, ...additionalCombatTactics]"
                  :key="tactic.name"
                  @click="addCommonTactic(tactic)"
                  class="library-btn"
                  :title="tactic.description + (tactic.prerequisites && tactic.prerequisites !== 'None' ? ' [Requires: ' + tactic.prerequisites + ']' : '')"
                >
                  {{ tactic.name }}
                  <span class="library-bonus">{{ tactic.automaticBonus }}</span>
                </button>
              </div>
            </details>
          </NotchContainer>

          <!-- Social Tactics Library -->
          <NotchContainer class="tactics-library" width="thin">
            <details>
              <summary class="library-summary">Social Tactics Library (Quick Add)</summary>
              <div class="library-grid">
                <button
                  v-for="tactic in socialTactics"
                  :key="tactic.name"
                  @click="addCommonTactic(tactic)"
                  class="library-btn"
                  :title="tactic.description + (tactic.prerequisites && tactic.prerequisites !== 'None' ? ' [Requires: ' + tactic.prerequisites + ']' : '')"
                >
                  {{ tactic.name }}
                  <span class="library-bonus">{{ tactic.automaticBonus }}</span>
                </button>
              </div>
            </details>
          </NotchContainer>

          <RepeatingSection name="tactics">
            <TacticItem v-for="row in sheet.sections.tactics.rows" :key="row._id" :item="row"/>
          </RepeatingSection>
        </div>
      </template>
    </Collapsible>
  </NotchContainer>
</template>

<style lang="scss" scoped>
.technique-container {
  display: grid;
  padding: var(--tiny-gap);
  grid-template-columns: 1fr;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
}

.section-header-expanded {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.section-expanded {
  display: grid;
  gap: 0.5rem;
}

.subheader {
  color: var(--header-blue);
  font-weight: bold;
  font-size: large;
  margin: 0;
}

.count-badge {
  padding: 0.2rem 0.6rem;
  background: var(--header-blue);
  color: white;
  border-radius: 12px;
  font-size: small;
  font-weight: bold;
}

.reset-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.reset-btn {
  padding: 0.3rem 0.8rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: small;
}

.reset-btn.small {
  padding: 0.2rem 0.5rem;
  font-size: x-small;
}

.reset-btn:hover {
  opacity: 0.8;
}

.tactics-library {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}

.library-summary {
  color: var(--header-blue);
  font-weight: bold;
  cursor: pointer;
  padding: 0.3rem;
}

.library-summary:hover {
  background: var(--notch-color);
}

.library-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.library-btn {
  padding: 0.5rem;
  background: var(--notch-color);
  border: 2px solid var(--header-blue);
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  transition: all 0.2s;
}

.library-btn:hover {
  background: var(--header-blue);
  color: white;
}

.library-btn.locked {
  opacity: 0.5;
  border-style: dashed;
}

.library-bonus {
  font-size: x-small;
  opacity: 0.8;
  font-weight: bold;
}
</style>