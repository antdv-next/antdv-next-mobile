import type { Linter } from 'eslint'
import antfu from '@antfu/eslint-config'

const config = antfu(
  {
    markdown: false,
    formatters: {
      css: true,
    },
    e18e: false,
    pnpm: true,
    rules: {
      'node/prefer-global/process': 0,
      'no-template-curly-in-string': 0,
      'vue/no-template-shadow': 0,
      'vue/one-component-per-file': 0,
      'style/quote-props': 0,
      'test/prefer-lowercase-title': 0,
      'pnpm/yaml-enforce-settings': 0,
    },
  },
  {
    files: ['docs/**/*', '**/tests/**/*'],
    rules: {
      'no-console': 0,
      'no-alert': 0,
      'no-restricted-globals': 0,
    },
  },
) as Linter.Config

export default config
