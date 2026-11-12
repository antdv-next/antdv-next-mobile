<script setup lang="ts">
import type { ConfigContext, ConfigProviderProps, ConfigProviderSlots } from './context'
import { computed, provide } from 'vue'
import { mergeTheme, resolveTheme } from '../theme/util'
import { configContextKey, useConfig } from './context'
import '../style'

defineOptions({ name: 'AmConfigProvider', inheritAttrs: false })

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  componentDisabled: undefined,
})
defineSlots<ConfigProviderSlots>()

const parent = useConfig()

const themeConfig = computed(() => mergeTheme(parent.themeConfig.value, props.theme))
const theme = computed(() => resolveTheme(themeConfig.value))

const context: ConfigContext = {
  locale: computed(() => props.locale ?? parent.locale.value),
  direction: computed(() => props.direction ?? parent.direction.value),
  componentSize: computed(() => props.componentSize ?? parent.componentSize.value),
  componentDisabled: computed(() => props.componentDisabled ?? parent.componentDisabled.value),
  getPopupContainer: computed(() => props.getPopupContainer ?? parent.getPopupContainer.value),
  themeConfig,
  theme,
}

provide(configContextKey, context)
</script>

<template>
  <div
    class="am-config-provider"
    :class="theme.className"
    :style="theme.style"
    :dir="context.direction.value"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
