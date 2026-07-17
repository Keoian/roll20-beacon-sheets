<script setup>
import NotchContainer from './NotchContainer.vue';
import { useSheetStore } from '@/stores/sheetStore';
const sheet = useSheetStore();

// Printable page 4 layout: Electives & Clubs | Personal Characteristics + Quote | Player Links,
// with the Student Backstory as a tall column beside them.
// (Interests/Virtues/Strengths/Weaknesses live on the Student page, as on the printable sheet.)
</script>

<template>
  <div class="background-grid">
    <NotchContainer width="thick" notch="25" class="backstory-item">
      <h4>Student Backstory</h4>
      <textarea class="underline" v-model="sheet.backstory" />
    </NotchContainer>

    <NotchContainer width="thick" notch="10" class="background-item electives-item">
      <h4>Electives &amp; Clubs</h4>
      <textarea class="underline" v-model="sheet.electives" />
    </NotchContainer>

    <NotchContainer width="thick" notch="10" class="background-item">
      <h4>Personal Characteristics</h4>
      <textarea class="underline" v-model="sheet.characteristics" />
    </NotchContainer>

    <NotchContainer width="thick" notch="10" class="background-item">
      <h4>Player Links</h4>
      <textarea class="underline" v-model="sheet.player_links" />
    </NotchContainer>

    <NotchContainer width="thick" notch="10" class="background-item quote-item">
      <h4>Quote</h4>
      <textarea class="underline" v-model="sheet.quote" />
    </NotchContainer>
  </div>
</template>

<style lang="scss">
.background-grid {
  display: grid;
  gap: var(--half-gap);
  align-items: stretch;
  grid-template-columns: 1.2fr 1fr 1fr;
  grid-template-areas:
    'backstory electives  links'
    'backstory characteristics links'
    'backstory quote      quote';

  .backstory-item {
    grid-area: backstory;
  }

  .electives-item {
    grid-area: electives;
  }

  .background-item:nth-of-type(3) {
    grid-area: characteristics;
  }

  .background-item:nth-of-type(4) {
    grid-area: links;
  }

  .quote-item {
    grid-area: quote;
  }

  @container (width <= 650px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'backstory backstory'
      'electives characteristics'
      'links     quote';
  }
}

.background-item,
.backstory-item {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--tiny-gap);

  h4 {
    text-align: center;
    margin: 0;
    text-transform: capitalize;
  }

  textarea {
    width: 100%;
    height: 100%;
    min-height: 8cap;
    box-sizing: border-box;
    background-color: var(--masterBack);
    color: var(--color);
  }
}

.backstory-item textarea {
  min-height: 24cap;
}
</style>
