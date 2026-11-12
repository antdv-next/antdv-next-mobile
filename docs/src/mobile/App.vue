<script setup lang="ts">
import type { ThemeConfig } from '@antdv-next/mobile'
import { applyTheme, ConfigProvider } from '@antdv-next/mobile'
import enUS from '@antdv-next/mobile/locale/en_US'
import zhCN from '@antdv-next/mobile/locale/zh_CN'
import { computed, watchEffect } from 'vue'
import { useDocsLocale } from '../shared/locale'
import { useDocsTheme } from '../shared/theme'

const docsTheme = useDocsTheme()
const docsLocale = useDocsLocale()
// built-in component texts follow the language of the docs
const locale = computed(() => (docsLocale.locale === 'zh-CN' ? zhCN : enUS))

const theme = computed<ThemeConfig>(() => ({
  algorithm: [docsTheme.dark ? 'dark' : 'default', ...(docsTheme.compact ? ['compact' as const] : [])],
  token: {
    colorPrimary: docsTheme.primary,
    ...(docsTheme.radius !== 8
      ? {
          borderRadius: docsTheme.radius,
          borderRadiusSM: Math.max(docsTheme.radius - 4, 1),
          borderRadiusLG: docsTheme.radius + 4,
          borderRadiusXL: docsTheme.radius + 8,
        }
      : {}),
  },
}))

// The same theme goes to <html> (page background, body-level popups) and to static APIs (Modal.confirm, Toast ...).
watchEffect(() => {
  applyTheme(theme.value)
  ConfigProvider.config({ theme: theme.value, locale: locale.value })
  document.documentElement.lang = docsLocale.locale
})
</script>

<template>
  <ConfigProvider :theme="theme" :locale="locale">
    <RouterView />
  </ConfigProvider>
</template>
