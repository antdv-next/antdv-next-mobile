import type { ComputedRef } from 'vue'
import type { AliasToken, ResolvedTheme } from './interface'
import { computed } from 'vue'
import { useConfig } from '../config-provider/context'
import { applyTheme, compactAlgorithm, cssVar, darkAlgorithm, defaultAlgorithm, tokenToCssVarName } from './util'

export type { AliasToken, ComponentToken, MapToken, ResolvedTheme, SeedToken, ThemeAlgorithm, ThemeAlgorithmName, ThemeConfig } from './interface'
export { applyTheme, compactAlgorithm, cssVar, darkAlgorithm, defaultAlgorithm, tokenToCssVarName }

export interface UseTokenResult {
  /** Tokens configured through ConfigProvider `theme.token` (merged with parents). */
  token: ComputedRef<AliasToken>
  /** Resolved theme scope (class names, css variables, algorithms). */
  theme: ComputedRef<ResolvedTheme>
  isDark: ComputedRef<boolean>
  /** `cssVar('colorPrimary')` -> `'var(--am-color-primary)'` */
  cssVar: typeof cssVar
}

function useToken(): UseTokenResult {
  const config = useConfig()
  return {
    token: computed(() => config.theme.value.token),
    theme: config.theme,
    isDark: computed(() => config.theme.value.isDark),
    cssVar,
  }
}

const theme = {
  defaultAlgorithm,
  darkAlgorithm,
  compactAlgorithm,
  useToken,
  applyTheme,
  cssVar,
}

export { useToken }
export default theme
