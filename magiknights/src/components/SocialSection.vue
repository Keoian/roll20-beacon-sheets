<script setup>
import { computed } from 'vue';
import { useSheetStore } from '@/stores';

import RepeatingItem from './RepeatingItem.vue';
import RepeatingSection from './RepeatingSection.vue';
import Collapsible from './Collapsible.vue';

const sheet = useSheetStore();
const props = defineProps({
  name: String
});

// SRD Bond Levels: NPC Bonds and Magi-Knight (squadron) Bonds use different SP tables
const bondStages = computed(() => sheet.bondStageData[props.name] || sheet.bondStageData.npc);

const stageForRow = (item) => {
  return sheet.getBondStageForSP(Number(item.points) || 0, props.name);
};

const stageInfo = (item) => {
  const value = stageForRow(item);
  return bondStages.value.find(stage => stage.value === value) || bondStages.value[0];
};
</script>

<template>
  <div class="social-section">
    <div class="social-header">
      <h5>name</h5>
      <h5>bond level</h5>
      <h5>SP</h5>
      <h5>bond ability</h5>
    </div>
    <RepeatingSection :name="`${name}-social`">
      <RepeatingItem :class="`${name}-social-item`" v-for="item in sheet.sections[`${name}-social`].rows" :key="item._id" :name="`${name}-social`" :row="item">
        <Collapsible class="social-content" :default="item.collapsed" @collapse="item.collapsed = !item.collapsed">
          <template v-slot:collapsed>
            <span>{{ item.name || 'New Bond' }}</span>
            <span class="heart-stage-label">{{ stageInfo(item).label }}</span>
            <span>{{ item.points }}</span>
            <span>{{ item.bond_ability }}</span>
          </template>
          <template v-slot:expanded>
            <input type="text" class="underline" v-model="item.name" placeholder="Name">
            <div class="heart-stage-row">
              <span class="heart-stage-label">{{ stageInfo(item).label }}</span>
              <span class="sp-threshold-hint">{{ stageInfo(item).min }}–{{ stageInfo(item).max }} SP</span>
              <span class="bond-ability-hint">{{ stageInfo(item).ability }}</span>
            </div>
            <input type="number" class="underline" v-model="item.points" min="0" max="100">
            <textarea class="underline" v-model="item.bond_ability" placeholder="Bond ability notes..."></textarea>
          </template>
        </Collapsible>
      </RepeatingItem>
    </RepeatingSection>
  </div>
</template>

<style lang="scss">
.social-section{
  display: grid;
  grid-template-columns: 1fr 90px 40px 1fr;
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
  .heart-stage-label{
    font-size: 0.85em;
    text-align: center;
    font-weight: bold;
  }
  .heart-stage-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .sp-threshold-hint {
    font-size: 0.7em;
    opacity: 0.6;
    text-align: center;
  }
  .bond-ability-hint {
    font-size: 0.65em;
    opacity: 0.7;
    text-align: center;
    font-style: italic;
  }
}
</style>
