<script setup>
defineProps({
  image: String,
  label: String
});
</script>

<template>
  <div class="persona-portrait">
    <div class="portrait-label-banner">{{ label }}</div>
    <div class="portrait-frame">
      <img v-if="image" :src="image" :alt="label" />
      <div v-else class="portrait-placeholder">
        <span class="material-symbols-outlined portrait-icon">person</span>
        <span class="placeholder-hint">Set a token image in Misc &rarr; Token Settings</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.persona-portrait {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--half-gap);
  justify-items: center;
  align-content: start;

  .portrait-label-banner {
    font-weight: bold;
    font-size: 0.8rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--header-blue);
    padding: 2px 12px;
    border: 2px solid var(--borderColor);
    border-radius: 12px;
    background: var(--masterBack);
    width: fit-content;
    max-width: 100%;
  }

  .portrait-frame {
    width: 100%;
    min-height: 320px;
    border: 4px solid var(--borderColor);
    /* arched window in the spirit of the printable sheet */
    border-radius: 48% 48% 10px 10px / 22% 22% 10px 10px;
    overflow: hidden;
    display: grid;
    place-items: center;
    background: var(--masterBack);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .portrait-placeholder {
    display: grid;
    justify-items: center;
    gap: 4px;
    padding: 12px;

    .portrait-icon {
      font-size: 72px;
      opacity: 0.2;
    }

    .placeholder-hint {
      font-size: 0.65rem;
      font-style: italic;
      opacity: 0.5;
      text-align: center;
    }
  }
}
</style>
