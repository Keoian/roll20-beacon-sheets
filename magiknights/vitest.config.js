import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Intentionally do not mergeConfig with vite.config.js: that file registers
// vite-plugin-vue-devtools (breaks under jsdom) and reads env vars for its
// base URL logic that are irrelevant to test runs.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/__tests__/**/*.spec.js'],
    setupFiles: ['src/__tests__/vitest.setup.js'],
    globals: false,
  },
})
