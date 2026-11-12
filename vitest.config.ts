import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@antdv-next/mobile': fileURLToPath(new URL('./packages/antdv-mobile/src/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['packages/**/tests/**/*.test.ts'],
    css: false,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['packages/antdv-mobile/src/**/*.{ts,vue}'],
      exclude: ['**/tests/**', '**/interface.ts', '**/*.d.ts', '**/locale/*.ts'],
      reporter: ['text-summary', 'lcov', 'html'],
    },
  },
})
