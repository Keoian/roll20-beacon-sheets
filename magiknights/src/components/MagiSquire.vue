<script setup>
import { useSheetStore } from '@/stores/sheetStore';
import NotchContainer from './NotchContainer.vue';
import Collapsible from './Collapsible.vue';

const sheet = useSheetStore();

// Squires may only learn these Spell Paths
const squirePaths = ['', 'Beam', 'Explosion', 'Curing', 'Restoration'];
</script>

<template>
  <NotchContainer class="squire-container" width="thick" notchType="curve">
    <h4>Magi-Squire</h4>
    <Collapsible class="basic-item" :default="sheet.squire.collapsed" @collapse="sheet.squire.collapsed = !sheet.squire.collapsed">
      <template v-slot:expanded>
        <div class="flex-box half-gap grow-label">
          <label for="squire-name">Name</label>
          <input class="underline" type="text" v-model="sheet.squire.name" id="squire-name" placeholder="Squire's name">
        </div>
        <div class="flex-box half-gap grow-label">
          <label for="squire-level">Level</label>
          <input class="underline squire-level" type="number" min="1" max="15" v-model.number="sheet.squire.level" id="squire-level" title="Levels up with their Mentor">
        </div>
        <div class="squire-blips">
          <span class="blip-label">Health</span>
          <label v-for="(blip, index) in sheet.squire.healthBlips" :key="`hp-${index}`" class="blip health">
            <input type="checkbox" v-model="sheet.squire.healthBlips[index]" />
          </label>
        </div>
        <div class="squire-blips">
          <span class="blip-label">Mana</span>
          <label v-for="(blip, index) in sheet.squire.manaBlips" :key="`mp-${index}`" class="blip mana">
            <input type="checkbox" v-model="sheet.squire.manaBlips[index]" />
          </label>
        </div>
        <div class="flex-box half-gap grow-label">
          <label for="squire-style">Fighting Style</label>
          <select class="underline" v-model="sheet.squire.fightingStyle" id="squire-style">
            <option value="melee">Melee (+2 Knight Armor)</option>
            <option value="ranged">Ranged (60 ft)</option>
          </select>
        </div>
        <div class="squire-stats">
          <span class="stat-badge">Student Armor: 13</span>
          <span class="stat-badge">Knight Armor: {{ sheet.squire.fightingStyle === 'melee' ? '17 (15 +2 Melee)' : '15' }}</span>
          <span class="stat-badge">Damage: {{ sheet.squireDamage }}</span>
        </div>
        <div class="flex-box half-gap grow-label">
          <label for="squire-path-1">Spell Path 1</label>
          <select class="underline" v-model="sheet.squire.spellPath1" id="squire-path-1">
            <option v-for="path in squirePaths" :key="path" :value="path">{{ path || 'None' }}</option>
          </select>
        </div>
        <div class="flex-box half-gap grow-label">
          <label for="squire-path-2">Spell Path 2 (Level 4+)</label>
          <select class="underline" v-model="sheet.squire.spellPath2" id="squire-path-2" :disabled="sheet.squire.level < 4">
            <option v-for="path in squirePaths" :key="path" :value="path">{{ path || 'None' }}</option>
          </select>
        </div>
        <div class="grid">
          <label class="properties-header" for="squire-skills">Skill Proficiencies (2, Mentor's choice; +2 when Assisting)</label>
          <input class="underline" type="text" v-model="sheet.squire.skills" id="squire-skills">
        </div>
        <div class="grid">
          <label class="properties-header" for="squire-notes">Notes</label>
          <textarea class="underline" v-model="sheet.squire.notes" id="squire-notes" placeholder="Paired Attack: Immediate Action - Mentor's next Weapon Attack gains Advantage, damage rolled twice take highest; Squire forfeits next turn."></textarea>
        </div>
      </template>
      <template v-slot:collapsed>
        <span class="squire-name">{{ sheet.squire.name || 'No Squire' }}</span>
        <span v-if="sheet.squire.name" class="squire-summary">
          Level {{ sheet.squire.level }} —
          HP {{ sheet.squire.healthBlips.filter(Boolean).length }}/6,
          MP {{ sheet.squire.manaBlips.filter(Boolean).length }}/3,
          {{ sheet.squireDamage }}
        </span>
      </template>
    </Collapsible>
  </NotchContainer>
</template>

<style lang="scss">
.squire-container {
  display: grid;
  gap: var(--tiny-gap);

  .squire-level {
    max-width: 60px;
  }

  .squire-blips {
    display: flex;
    align-items: center;
    gap: 4px;

    .blip-label {
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--header-blue);
      min-width: 50px;
    }

    .blip input[type='checkbox'] {
      margin: 0;
      width: 16px;
      height: 16px;
    }
  }

  .squire-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .stat-badge {
      font-size: 0.75rem;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 3px;
      background: var(--header-blue);
      color: white;
    }
  }

  .squire-name {
    font-weight: bold;
  }

  .squire-summary {
    font-size: 0.75rem;
    color: #666;
  }
}

html.dark {
  .squire-container .squire-summary {
    color: #aaa;
  }
}
</style>
