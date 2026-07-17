<script setup>
import { computed } from 'vue';
import { useSheetStore } from '@/stores/sheetStore';
import RepeatingSection from './RepeatingSection.vue';
import RepeatingItem from './RepeatingItem.vue';

const sheet = useSheetStore();

const attachmentTypes = ['scope', 'magazine', 'rail', 'muzzle'];

const stats = computed(() => sheet.gunTypeStats);
const styles = computed(() => sheet.availableGunStyles);
</script>

<template>
  <div class="gun-config-selector">
    <!-- Gun Type -->
    <div class="gun-row">
      <label class="field-label" for="gun-type-select">Gun Type</label>
      <select id="gun-type-select" class="input-field" v-model="sheet.soul_gun.gunType">
        <option v-for="(type, key) in sheet.gunTypeData" :key="key" :value="key">
          {{ type.name }} ({{ key.toUpperCase() }})
        </option>
      </select>
    </div>

    <!-- Gun type stats -->
    <div class="gun-stats">
      <span class="stat-badge">E-Range: {{ stats.eRange }}ft</span>
      <span class="stat-badge">Damage: {{ stats.damage }}</span>
      <span class="stat-badge">ROF: {{ stats.rf }}/{{ stats.md || '—' }}</span>
    </div>
    <div class="gun-special" v-if="stats.special">{{ stats.special }}</div>

    <!-- Gun Style (HDG and SMG only) -->
    <div class="gun-row" v-if="styles.length">
      <label class="field-label" for="gun-style-select">Gun Style</label>
      <select id="gun-style-select" class="input-field" v-model="sheet.soul_gun.gunStyle">
        <option value="">None</option>
        <option v-for="style in styles" :key="style.key" :value="style.key">
          {{ style.name }}
        </option>
      </select>
    </div>
    <div class="gun-special" v-if="sheet.gunStyleData[sheet.soul_gun.gunStyle]">
      {{ sheet.gunStyleData[sheet.soul_gun.gunStyle].effect }}
    </div>

    <!-- Firing pool state -->
    <div class="gun-state">
      <label class="state-toggle" :class="{ active: sheet.soul_gun.isAiming }">
        <input type="checkbox" v-model="sheet.soul_gun.isAiming" />
        Aiming (+1 to one die)
      </label>
      <label class="state-toggle" :class="{ warning: !sheet.soul_gun.hasReloaded }">
        <input type="checkbox" v-model="sheet.soul_gun.hasReloaded" />
        {{ sheet.soul_gun.hasReloaded ? 'Loaded' : 'Reload needed (Standard Action)' }}
      </label>
      <div class="gun-row">
        <label class="field-label" for="firing-pool-bonus">Firing Pool Bonus</label>
        <input id="firing-pool-bonus" class="input-field pool-bonus" type="number" v-model.number="sheet.soul_gun.firingPoolBonus" />
      </div>
    </div>

    <!-- Attachments -->
    <div class="attachments-section">
      <div class="category-label">Attachments (1 Rune Slot each)</div>
      <RepeatingSection name="gunAttachments">
        <RepeatingItem
          v-for="row in sheet.sections.gunAttachments.rows"
          :key="row._id"
          :row="row"
          name="gunAttachments"
        >
          <div class="attachment-row">
            <input class="input-field" type="text" v-model="row.name" placeholder="Attachment name" />
            <select class="input-field" v-model="row.type">
              <option value="">Type</option>
              <option v-for="t in attachmentTypes" :key="t" :value="t">{{ t.charAt(0).toUpperCase() + t.slice(1) }}</option>
            </select>
            <input class="input-field" type="text" v-model="row.effect" placeholder="Effect" />
          </div>
        </RepeatingItem>
      </RepeatingSection>
    </div>
  </div>
</template>

<style lang="scss">
.gun-config-selector {
  display: grid;
  gap: var(--tiny-gap);
}

.gun-row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 8px;

  .field-label {
    font-size: 0.75rem;
    font-weight: bold;
    color: var(--header-blue);
    text-transform: uppercase;
  }

  .pool-bonus {
    max-width: 70px;
  }
}

.gun-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  .stat-badge {
    font-size: 0.75rem;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 3px;
    background: var(--header-blue);
    color: white;
  }
}

.gun-special {
  font-size: 0.7rem;
  color: #666;
  font-style: italic;
}

.gun-state {
  display: grid;
  gap: 4px;

  .state-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    cursor: pointer;

    &.active {
      color: #2e7d32;
      font-weight: bold;
    }

    &.warning {
      color: #c62828;
      font-weight: bold;
    }

    input[type='checkbox'] {
      margin: 0;
      width: 14px;
      height: 14px;
    }
  }
}

.attachments-section {
  display: grid;
  gap: 4px;

  .category-label {
    font-size: 0.7rem;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--header-blue);
    border-bottom: 1px solid var(--borderColor);
    padding-bottom: 2px;
  }

  .attachment-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 4px;
  }
}

html.dark {
  .gun-special {
    color: #aaa;
  }
}
</style>
