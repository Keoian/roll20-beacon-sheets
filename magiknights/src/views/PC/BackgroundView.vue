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
