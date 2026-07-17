<script setup>

import { useSheetStore } from '@/stores/sheetStore';

import BackgroundItems from '@/components/BackgroundItems.vue';
import NotchContainer from '@/components/NotchContainer.vue';
import GoalTallies from '@/components/GoalTallies.vue';

const sheet = useSheetStore();
</script>

<template>
  <div class="background-view">
    <BackgroundItems />
    <NotchContainer class="fate-card" width="thick" notchType="wedge">
      <h4>Fate Card</h4>
      <div class="fate-selects">
        <select v-model="sheet.fate.card" class="fate-select underline">
          <option value="" selected>Select Card</option>
          <option v-for="card in ['king', 'queen', 'knight', 'dame', 'squire', 'damsel']" :key="card" :value="card">{{ card }}</option>
        </select>
        <select class="underline" v-model="sheet.fate.name">
          <option value="" selected>Select Person</option>
          <option v-for="person in sheet.sections['npc-social'].rows" :key="person.id || 'new-person'" :value="person.id || 'New Person'">{{ person.name || 'New Person' }}</option>
          <option v-for="person in sheet.sections['squadron-social'].rows" :key="person.id || 'new-squadmate'" :value="person.id || 'New Person'">{{ person.name || 'New Squadmate' }}</option>
        </select>
      </div>
    </NotchContainer>
    <NotchContainer class="tallies goal-tallies-container">
      <h4>Goal Tallies</h4>
      <GoalTallies name="club" />
    </NotchContainer>
  </div>
</template>

<style lang="scss">
.background-view {
  display: grid;
  gap: var(--half-gap);
  align-content: start;

  .fate-card {
    display: grid;
    gap: var(--half-gap);
    padding: var(--half-gap) 16px 12px;

    h4 {
      margin: 0;
      text-align: center;
    }

    .fate-selects {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 16px;
      padding: 0 8px;

      select {
        width: 100%;
        min-width: 0;
        height: 32px;
      }

      .fate-select {
        text-transform: capitalize;
      }
    }
  }

  .goal-tallies-container {
    display: grid;
    gap: var(--tiny-gap);

    h4 {
      margin: 0;
      text-align: center;
    }
  }
}
</style>
