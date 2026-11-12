import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'antdv-next-mobile': fileURLToPath(new URL('./packages/antdv-next-mobile/src/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['packages/**/tests/**/*.test.ts'],
    css: false,
    setupFiles: ['./tests/setup.ts'],
  },
})
