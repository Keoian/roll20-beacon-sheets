<script setup>
import NotchContainer from '@/components/NotchContainer.vue';
import RepeatingSection from '@/components/RepeatingSection.vue';
import ShardItem from '@/components/ShardItem.vue';

import {useSheetStore} from '@/stores';
const sheet = useSheetStore();

// SRD Shards of Power table (equipment.md). Cost is in Gloom Gems.
const shardLibrary = [
  { name: 'Shard of Mending [Lesser]', rarity: 1, cost: '4', description: 'Free Action: Heal 1d12 + Level HP' },
  { name: 'Shard of Clarity [Lesser]', rarity: 2, cost: '8', description: 'Bonus Action: Restore 1d10 + Level MP' },
  { name: 'Shard of Confidence', rarity: 2, cost: '8', description: 'Free Action: +1d12 to next Skill Check' },
  { name: 'Shard of Mending [Potent]', rarity: 3, cost: '12', description: 'Free Action: Heal 3d12 + Level HP' },
  { name: 'Shard of Mercurial Alacrity', rarity: 3, cost: '12', description: 'Free Action: +1 Bonus Action (max 3/turn) until end of next turn. Then +1 Exhaustion' },
  { name: 'Shard of Purification [Lesser]', rarity: 3, cost: '12', description: 'Bonus Action: Remove Berserk/Bleeding/Burning/Disoriented, OR +5 to next Condition removal roll' },
  { name: 'Shard of Rejuvenation', rarity: 3, cost: '12', description: 'Bonus Action: Ignore Stress/Exhaustion effects until end of next turn. -1 Stress, -1 Exhaustion' },
  { name: 'Shard of Unstoppable Might', rarity: 4, cost: '16', description: 'Bonus Action: +2 + Rep Level (min 1) to Physical damage until end of next turn. Then +1 Exhaustion' },
  { name: 'Shard of Mending [Greater]', rarity: 5, cost: '25', description: 'Free Action: Heal 5d12 + Level HP' },
  { name: 'Shard of Purification [Potent]', rarity: 5, cost: '25', description: 'Bonus Action: Remove Drained/Distressed/Silenced/Soul-Siphoned (I-II), OR Advantage on next Condition removal roll' },
  { name: 'Shard of Tenacity', rarity: 5, cost: '25', description: 'Immediate: Gain Physical Resistance until end of next turn (applied before damage)' },
  { name: 'Shard of Clarity [Potent]', rarity: 6, cost: '30', description: 'Bonus Action: Restore 3d10 + Level MP' },
  { name: 'Shard of Magical Force', rarity: 6, cost: '30', description: 'Bonus Action: Advantage on next Attack. +Rep Level (min 1) to Attack and Damage' },
  { name: 'Shard of Purification [Greater]', rarity: 7, cost: '35', description: 'Bonus Action: Remove Depleted/Horrified/Paralyzed/Soul-Siphoned (III)/Soul-Tainted. Also activate Purification [Lesser]' },
  { name: 'Shard of Solidarity', rarity: 7, cost: '35', description: 'Bonus Action: Gain 1 Unity Point (up to max) OR 1 Inspiration Point' },
  { name: 'Shard of Fate', rarity: 8, cost: '40', description: 'Bonus Action: Roll 2d20 keep highest; use instead of Attack/Check/Resist roll (before rolling), or expend as Inspiration. Unexpended at Sleep Phase = Inspiration' },
  { name: 'Shard of Fortune', rarity: 8, cost: '40', description: 'Immediate: When a squadron member rolls a 1, change the result to 15' },
  { name: 'Shard of Clarity [Greater]', rarity: 9, cost: '45', description: 'Bonus Action: Restore 6d10 + Level MP' },
  { name: 'Shard of Nepenthe', rarity: 9, cost: 'N/A', description: 'Bonus Action: Remove 2 Trauma, heal 3d12 HP, restore 5d10 MP, -2 Exhaustion, -4 Stress, gain Inspiration' },
  { name: 'Shard of the Magi-Knight', rarity: 10, cost: 'N/A', description: 'Bonus Action: Full restore HP/MP, remove all Stress/Exhaustion, +2 Unity (up to max), +1 Inspiration, Purge all Conditions, heal 6 Crystalline Fractures' }
];

const addShardFromLibrary = (shard) => {
  sheet.addRow('shards');
  const newRow = sheet.sections.shards.rows[sheet.sections.shards.rows.length - 1];
  Object.assign(newRow, { ...shard, collapsed: true });
};
</script>

<template>

  <NotchContainer notchType="wedge" width="thick" class="overflow-container shards-container">
    <NotchContainer width="thin" class="overflow-header">
      <h3>Shards of Power</h3>
    </NotchContainer>
    <details class="shard-library">
      <summary>Shard Library (Quick Add)</summary>
      <div class="shard-library-grid">
        <button
          v-for="shard in shardLibrary"
          :key="shard.name"
          class="shard-library-btn"
          :title="shard.description"
          @click="addShardFromLibrary(shard)"
        >
          {{ shard.name }}
          <span class="shard-meta">Rarity {{ shard.rarity }} · {{ shard.cost }} Gems</span>
        </button>
      </div>
    </details>
    <RepeatingSection name="shards">
      <ShardItem v-for="row in sheet.sections.shards.rows" :key="row.id" :item="row"/>
    </RepeatingSection>
  </NotchContainer>
</template>

<style lang="scss">
.shards-container{
  display: grid;
  padding: var(--tiny-gap);
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  .overflow-header{
    place-self: center;
  }
  .repeating-section{
    flex: 1;
  }

  .shard-library {
    font-size: 0.8rem;
    padding: var(--tiny-gap);

    summary {
      cursor: pointer;
      font-weight: bold;
      color: var(--header-blue);
    }

    .shard-library-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 4px;
      padding-top: 4px;
    }

    .shard-library-btn {
      padding: 4px 6px;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 0.7rem;
      border: 1px solid var(--header-blue);
      border-radius: 4px;
      background: transparent;
      color: inherit;
      cursor: pointer;

      &:hover {
        background: var(--header-blue);
        color: white;
      }

      .shard-meta {
        font-size: 0.65rem;
        opacity: 0.7;
        font-weight: bold;
      }
    }
  }
}
</style>
