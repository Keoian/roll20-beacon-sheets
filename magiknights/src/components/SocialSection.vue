<script setup>
import { useSheetStore } from '@/stores';

import RepeatingItem from './RepeatingItem.vue';
import RepeatingSection from './RepeatingSection.vue';
import Collapsible from './Collapsible.vue';

const sheet = useSheetStore();
const props = defineProps({
  name: String
});

// Heart Stage progression per the compendium:
// Threatening -> Hostile -> Cold -> Neutral -> Warm -> Friendly -> Sympathetic
const heartStages = [
  { value: 'threatening', label: 'Threatening' },
  { value: 'hostile', label: 'Hostile' },
  { value: 'cold', label: 'Cold' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'warm', label: 'Warm' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'sympathetic', label: 'Sympathetic' }
];

const heartStageLabel = (value) => {
  return heartStages.find(stage => stage.value === value)?.label || 'Neutral';
};
</script>

<template>
  <div class="social-section">
    <div class="social-header">
      <h5>name</h5>
      <h5>social points</h5>
      <h5>heart stage</h5>
      <h5>bond ability</h5>
    </div>
    <RepeatingSection :name="`${name}-social`">
      <RepeatingItem :class="`${name}-social-item`" v-for="item in sheet.sections[`${name}-social`].rows" :key="item._id" :name="`${name}-social`" :row="item">
        <Collapsible class="social-content" :default="item.collapsed" @collapse="item.collapsed = !item.collapsed">
          <template v-slot:collapsed>
            <span>{{ item.name || 'New Bond' }}</span>
            <span>{{ item.points }}</span>
            <span class="heart-stage-tag" :class="item.heartStage || 'neutral'">{{ heartStageLabel(item.heartStage) }}</span>
            <span>{{ item.bond_ability }}</span>
          </template>
          <template v-slot:expanded>
            <input type="text" class="underline" v-model="item.name">
            <input type="number" class="underline" v-model="item.points">
            <select class="underline" v-model="item.heartStage">
              <option v-for="stage in heartStages" :key="stage.value" :value="stage.value">{{ stage.label }}</option>
            </select>
            <textarea class="underline" v-model="item.bond_ability"></textarea>
          </template>
        </Collapsible>
      </RepeatingItem>
    </RepeatingSection>
  </div>
</template>

<style lang="scss">
.social-section{
  display: grid;
  grid-template-columns: 1fr 50px 100px 1fr;
  gap: 1px;
  &,
  .repcontainer{
    background-color: var(--borderColor);
  }
  .rep-add-button{
    grid-column: 1;
  }
  .rep-edit-button{
    grid-column: 4;
  }
  :is(.social-header,.repeating-section,.repcontainer,.repitem,.social-content){
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    gap: inherit;
    padding: 0;
  }
  .social-header,.repcontainer{
    padding: 1px;
  }
  .social-header{
    *{
      background-color: var(--masterBack);
    }
  }
  .repeating-section{
    background-color: var(--masterBack);
  }
  .social-content{
    :not(:first-child){
      background-color: var(--masterBack);
      border: 0;
    }
  }
  .heart-stage-tag{
    font-size: 0.75rem;
    font-weight: bold;

    &.threatening,
    &.hostile{
      color: #c62828;
    }
    &.cold{
      color: #6d4c41;
    }
    &.warm,
    &.friendly{
      color: #2e7d32;
    }
    &.sympathetic{
      color: var(--header-blue);
    }
  }
}
</style>
