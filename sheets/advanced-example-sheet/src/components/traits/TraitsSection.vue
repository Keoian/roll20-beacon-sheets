<template>
  <div class="section traits">
    <div class="section__header">Traits</div>
    <div class="section__body traits__body">
      <div class="traits__top">Unlock at Level ↓</div>
      <div class="traits__group">
        <CharacterTrait
          v-for="(trait, index) in traitsStore.traits"
          :key="trait._id"
          :trait="trait"
          :index="index"
        />
      </div>
      <div class="add-item">
        <button data-testid="test-add-trait-btn" class="link-btn" @click="traitsStore.addTrait()">
          + Add Trait
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTraitsStore } from '@/sheet/stores/traits/traitsStore';
import CharacterTrait from '@/components/traits/CharacterTrait.vue';

const traitsStore = useTraitsStore();
</script>

<style scoped lang="scss">
.traits {
  &__body {
  }

  &__top {
    text-align: right;
    padding-right: 1rem;
    margin-bottom: 1rem;
  }

  &__group {
    height: 12rem;
    padding: 0 1rem;
    overflow: scroll;
    display: flex;
    flex-direction: column;
  }
}
</style>
