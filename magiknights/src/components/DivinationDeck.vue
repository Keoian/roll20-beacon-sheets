<script setup>
import { computed } from 'vue';
import { useSheetStore } from '@/stores/sheetStore';
import NotchContainer from './NotchContainer.vue';

const sheet = useSheetStore();

const cardFor = (num) => sheet.divinationCardDefs.find(card => card.num === num);
const courtFor = (name) => sheet.courtCardDefs.find(card => card.name === name);

const tierInfo = computed(() => sheet.divinationTierData[sheet.divinationTier] || sheet.divinationTierData[1]);
</script>

<template>
  <NotchContainer class="divination-container" width="thick" notchType="curve">
    <h4>Divination — Divine the Future</h4>
    <div class="divination-controls">
      <label class="tier-label" for="divination-tier">
        Tier
        <select id="divination-tier" class="underline" v-model.number="sheet.divinationTier">
          <option v-for="(data, tier) in sheet.divinationTierData" :key="tier" :value="Number(tier)">
            {{ ['I','II','III','IV','V','VI'][tier - 1] }} — {{ data.mp }} MP{{ data.tax ? `, Tax ${data.tax}` : '' }} (+{{ data.scaling }})
          </option>
        </select>
      </label>
      <span class="scaling-badge">Scaling +X = {{ sheet.divinationScaling }}</span>
      <button class="divine-btn" @click="sheet.divineTheFuture()" title="Bonus Action: draw 3 Divination Cards (slot 2 Reversed) + a Court Card">
        Divine the Future ({{ tierInfo.mp }} MP)
      </button>
      <button v-if="sheet.divinationSlots.length" class="clear-btn" @click="sheet.clearDivination()">Clear</button>
    </div>

    <div v-if="sheet.divinationCourtCard" class="court-card">
      <strong>Reigning Card: {{ sheet.divinationCourtCard }}</strong>
      <span class="court-effect">{{ courtFor(sheet.divinationCourtCard)?.effect }} — {{ courtFor(sheet.divinationCourtCard)?.rulingPower }}</span>
    </div>

    <div v-if="sheet.divinationSlots.length" class="divination-slots">
      <div
        v-for="(slot, index) in sheet.divinationSlots"
        :key="index"
        class="divination-slot"
        :class="{ reversed: slot.orientation === 'reversed', expended: slot.expended }"
      >
        <div class="slot-header">
          <span class="slot-number">Slot {{ index + 1 }}</span>
          <span class="slot-orientation">{{ slot.orientation === 'reversed' ? 'Reversed' : 'Upright' }}</span>
        </div>
        <div class="card-name">{{ cardFor(slot.cardNum)?.name }} ({{ slot.cardNum }})</div>
        <div class="card-triumvirate">{{ cardFor(slot.cardNum)?.triumvirate }}</div>
        <div class="card-effect">
          {{ slot.orientation === 'reversed' ? cardFor(slot.cardNum)?.reversed : cardFor(slot.cardNum)?.upright }}
        </div>
        <div class="slot-actions">
          <button @click="sheet.flipDivinationSlot(index)" title="Turn Upright/Reverse (Passage, Divine Tailor, etc.)">Flip</button>
          <button @click="sheet.expendDivinationSlot(index)" :title="slot.expended ? 'Restore this slot' : 'Activate/expend this slot'">
            {{ slot.expended ? 'Restore' : 'Activate' }}
          </button>
          <button @click="sheet.redrawDivinationSlot(index)" title="Replace with the next card from the deck (Twilight, Mortal, Love effects)">Redraw</button>
        </div>
      </div>
    </div>
    <div v-else class="divination-empty">
      Requires the Collector's Spell Deck and 2 Spell Path choices. Use Divine the Future as a Bonus Action.
    </div>
  </NotchContainer>
</template>

<style lang="scss">
.divination-container {
  display: grid;
  gap: var(--tiny-gap);

  .divination-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;

    .tier-label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .scaling-badge {
      font-size: 0.75rem;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 3px;
      background: var(--header-blue);
      color: white;
    }

    .divine-btn,
    .clear-btn {
      padding: 4px 10px;
      font-size: 0.8rem;
      background: var(--header-blue);
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;

      &:hover {
        opacity: 0.9;
      }
    }

    .clear-btn {
      background: var(--borderColor);
      color: var(--masterBack);
    }
  }

  .court-card {
    display: grid;
    font-size: 0.8rem;

    .court-effect {
      font-size: 0.7rem;
      color: #666;
    }
  }

  .divination-slots {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 8px;
  }

  .divination-slot {
    border: 2px solid var(--header-blue);
    border-radius: 6px;
    padding: 6px;
    display: grid;
    gap: 2px;
    font-size: 0.75rem;

    &.reversed {
      border-color: #c62828;

      .slot-orientation {
        color: #c62828;
      }
    }

    &.expended {
      opacity: 0.5;
    }

    .slot-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.65rem;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--header-blue);
    }

    .card-name {
      font-weight: bold;
      font-size: 0.85rem;
    }

    .card-triumvirate {
      font-size: 0.65rem;
      font-style: italic;
      color: #666;
    }

    .slot-actions {
      display: flex;
      gap: 4px;
      margin-top: 2px;

      button {
        flex: 1;
        padding: 2px 4px;
        font-size: 0.65rem;
        border: 1px solid var(--header-blue);
        background: transparent;
        color: inherit;
        border-radius: 3px;
        cursor: pointer;

        &:hover {
          background: var(--header-blue);
          color: white;
        }
      }
    }
  }

  .divination-empty {
    font-size: 0.75rem;
    font-style: italic;
    color: #666;
  }
}

html.dark {
  .divination-container {
    .court-card .court-effect,
    .divination-slot .card-triumvirate,
    .divination-empty {
      color: #aaa;
    }
  }
}
</style>
