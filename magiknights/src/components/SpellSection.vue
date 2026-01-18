<script setup>
import { ref, computed } from 'vue';
import RepeatingItem from './RepeatingItem.vue';
import RepeatingSection from './RepeatingSection.vue';
import Modal from './Modal.vue';

import { useSheetStore } from '@/stores';
import spellsCompendium from '../../compendium/spells.json';

const sheet = useSheetStore();
const show = ref(false);
const modalObj = ref({});
const selectedCompendiumSpell = ref('');

// Get available spell paths from compendium
const compendiumSpellPaths = computed(() => {
  const spells = spellsCompendium.pagesByCategory?.Spells || {};
  const spellPaths = [];

  for (const [key, value] of Object.entries(spells)) {
    // Only include objects with tier data (actual spell paths)
    if (typeof value === 'object' && value !== null && 'name' in value && 'tier_I_dice' in value) {
      spellPaths.push({
        key,
        name: value.name,
        data: value
      });
    }
  }

  return spellPaths.sort((a, b) => a.name.localeCompare(b.name));
});

const loadFromCompendium = () => {
  if (!selectedCompendiumSpell.value) return;

  const spellData = compendiumSpellPaths.value.find(s => s.key === selectedCompendiumSpell.value);
  if (!spellData) return;

  // Populate all fields from compendium data
  Object.assign(modalObj.value, {
    name: spellData.data.name,
    range: spellData.data.range || '',
    tier_I_name: spellData.data.tier_I_name || '',
    tier_I_dice: spellData.data.tier_I_dice || '',
    tier_I_special: spellData.data.tier_I_special || '',
    tier_I_description: spellData.data.tier_I_description || '',
    tier_I_action: spellData.data.tier_I_action || '',
    tier_II_name: spellData.data.tier_II_name || '',
    tier_II_dice: spellData.data.tier_II_dice || '',
    tier_II_special: spellData.data.tier_II_special || '',
    tier_II_description: spellData.data.tier_II_description || '',
    tier_II_action: spellData.data.tier_II_action || '',
    tier_III_name: spellData.data.tier_III_name || '',
    tier_III_dice: spellData.data.tier_III_dice || '',
    tier_III_special: spellData.data.tier_III_special || '',
    tier_III_description: spellData.data.tier_III_description || '',
    tier_III_action: spellData.data.tier_III_action || '',
    tier_IV_name: spellData.data.tier_IV_name || '',
    tier_IV_dice: spellData.data.tier_IV_dice || '',
    tier_IV_special: spellData.data.tier_IV_special || '',
    tier_IV_description: spellData.data.tier_IV_description || '',
    tier_IV_action: spellData.data.tier_IV_action || '',
    tier_V_name: spellData.data.tier_V_name || '',
    tier_V_dice: spellData.data.tier_V_dice || '',
    tier_V_special: spellData.data.tier_V_special || '',
    tier_V_description: spellData.data.tier_V_description || '',
    tier_V_action: spellData.data.tier_V_action || '',
    tier_VI_name: spellData.data.tier_VI_name || '',
    tier_VI_dice: spellData.data.tier_VI_dice || '',
    tier_VI_special: spellData.data.tier_VI_special || '',
    tier_VI_description: spellData.data.tier_VI_description || '',
    tier_VI_action: spellData.data.tier_VI_action || '',
    isCustom: false // Mark as from compendium
  });
};

const markAsCustom = () => {
  if (modalObj.value) {
    modalObj.value.isCustom = true;
  }
};

const openSpellEdit = (item) => {
  show.value = true;
  modalObj.value = item;
  selectedCompendiumSpell.value = ''; // Reset selection when opening
};

const close = () => {
  show.value = false;
  modalObj.value = {};
  selectedCompendiumSpell.value = '';
}

const addSpell = (id) => {
  const item = sheet.sections.spells.rows.find(o => o._id === id);
  if(item){
    openSpellEdit(item);
  }
}
</script>

<template>
  <Modal class="spell-backdrop" mclass="spell-modal" @close="close" v-show="show">
    <div class="compendium-selector">
      <div class="flex-box half-gap grow-label">
        <label for="compendium-spell-select">Load from Compendium:</label>
        <select
          id="compendium-spell-select"
          v-model="selectedCompendiumSpell"
          @change="loadFromCompendium"
          class="underline"
        >
          <option value="">-- Select a Spell Path --</option>
          <option v-for="spell in compendiumSpellPaths" :key="spell.key" :value="spell.key">
            {{ spell.name }}
          </option>
        </select>
      </div>
      <p class="help-text">Select a spell path from the compendium to auto-populate all fields, or enter custom spell data below.</p>
    </div>
    <div class="spell-type-indicator">
      <label class="spell-type-label">
        <input type="checkbox" v-model="modalObj.isCustom" @change="markAsCustom">
        <span>{{ modalObj.isCustom ? 'Custom Spell' : 'Compendium Spell' }}</span>
      </label>
      <p class="spell-type-help" v-if="!modalObj.isCustom">
        This spell is loaded from the compendium. Check the box above to mark it as custom and make modifications.
      </p>
    </div>
    <div class="flex-box half-gap grow-label">
      <label for="spell-name">Name:</label>
      <input class="underline" type="text" v-model="modalObj.name" id="spell-name" @input="markAsCustom">
    </div>
    <div class="flex-box half-gap grow-label">
      <label for="spell-range">Range:</label>
      <input class="underline" type="text" v-model="modalObj.range" id="spell-range" @input="markAsCustom">
    </div>
    <div class="tier-container" v-for="tier in ['I','II','III','IV','V','VI']">
      <h4>Tier {{ tier }}</h4>
      <div class="flex-box half-gap grow-label">
        <label :for="`spell-${tier}-name`">Name:</label>
        <input class="underline" type="text" v-model="modalObj[`tier_${tier}_name`]" :id="`spell-${tier}-name`" @input="markAsCustom">
      </div>
      <div class="flex-box half-gap grow-label">
        <label :for="`spell-${tier}-action`">Action:</label>
        <input class="underline" type="text" v-model="modalObj[`tier_${tier}_action`]" :id="`spell-${tier}-action`" @input="markAsCustom">
      </div>
      <div class="flex-box half-gap grow-label">
        <label :for="`spell-${tier}-dice`">Dice:</label>
        <input class="underline" type="text" v-model="modalObj[`tier_${tier}_dice`]" :id="`spell-${tier}-dice`" @input="markAsCustom">
      </div>
      <div class="grid">
        <label :for="`spell-${tier}-special`">Special:</label>
        <textarea class="underline" v-model="modalObj[`tier_${tier}_special`]" :id="`spell-${tier}-special`" @input="markAsCustom"></textarea>
      </div>
      <div class="grid">
        <label :for="`spell-${tier}-description`">Description:</label>
        <textarea class="underline" v-model="modalObj[`tier_${tier}_description`]" :id="`spell-${tier}-description`" @input="markAsCustom"></textarea>
      </div>
    </div>
  </Modal>
  <RepeatingSection name="spells" class="repeating-spells" @add="addSpell">
    <RepeatingItem v-for="item in sheet.sections.spells.rows" :key="item._id" :row="item" name="spells" class="gear-item">
      <h5 class="spell-header">
        {{ item.name || 'Spell Path' }}
        <span v-if="!item.isCustom" class="compendium-badge" title="Loaded from Compendium">📖</span>
        <span v-else class="custom-badge" title="Custom Spell">✏️</span>
      </h5>
      <button class="overlay-opener material-symbols-outlined" @click="openSpellEdit(item)">edit</button>
      <button v-for="tier in ['I','II','III','IV','V','VI']" @click="sheet.rollSpell(item,tier)">{{ item[`tier_${tier}_dice`] || item[`tier_${tier}_name`] || "Spell's effect" }}</button>
    </RepeatingItem>
  </RepeatingSection>
</template>

<style lang="scss">
  .grow-label{
    > :not(:first-child){
      flex: 1;
    }
  }
  .spell-backdrop{
    padding: var(--gap);
    z-index: 100;
  }
  .spell-modal{
    background-color: var(--masterBack);
    border-radius: 10px;
    flex: 1;
    min-height: 400px;
    max-height: calc(100% - (var(--gap) * 2));
    padding: var(--gap);
    display: grid;
    gap: var(--half-gap);
    overflow-y: auto;
    .compendium-selector{
      border-bottom: 2px solid var(--header-blue);
      padding-bottom: var(--half-gap);
      margin-bottom: var(--half-gap);
      .help-text{
        font-size: 0.85rem;
        color: var(--light);
        margin-top: var(--half-gap);
        font-style: italic;
      }
      select{
        padding: 4px 8px;
        border-radius: 4px;
        background-color: var(--sheet-bg);
        color: var(--text);
        border: 1px solid var(--header-blue);
        cursor: pointer;
        &:hover{
          border-color: var(--accent);
        }
      }
    }
    .spell-type-indicator{
      background-color: rgba(var(--header-blue-rgb, 68, 138, 255), 0.1);
      padding: var(--half-gap);
      border-radius: 4px;
      border-left: 3px solid var(--header-blue);
      .spell-type-label{
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        cursor: pointer;
        input[type="checkbox"]{
          cursor: pointer;
        }
      }
      .spell-type-help{
        font-size: 0.85rem;
        color: var(--light);
        margin-top: var(--half-gap);
        font-style: italic;
        margin-bottom: 0;
      }
    }
    .tier-container{
      display: grid;
      gap: inherit;
      padding-top: var(--half-gap);
    }
    button:enabled{
    color: var(--header-blue);
    padding-right: 35px;
    padding-top: 20px;
    }
    button:disabled {
    color: var(--light);
}
  }
  .repeating-spells{
    display: contents;
    .repcontainer{
      grid-area: rep;
      display: grid;
      grid-template-rows: subgrid;
      grid-auto-flow: column;
      justify-content: start;
    }
    .repitem{
      display: grid;
      grid-row: 1 / -1;
      grid-template-rows: subgrid;
      position: relative;
      .spell-header{
        display: flex;
        align-items: center;
        gap: 4px;
        .compendium-badge, .custom-badge{
          font-size: 0.9rem;
          opacity: 0.7;
        }
        &:hover{
          + .overlay-opener{
            opacity: 1;
          }
        }
      }
    }
    .overlay-opener{
      position: absolute;
      place-self: center end;
      grid-row: 1 / 2;
      z-index: 10;
      opacity: 0;
      background: radial-gradient(circle at center,var(--header-blue),var(--header-blue) 40%,transparent);
      color: var(--masterBack);
      border-radius: 100%;
      aspect-ratio: 1 / 1;
      &:is(:focus-visible,:hover){
        opacity: 1;
      }
    }
  }
</style>