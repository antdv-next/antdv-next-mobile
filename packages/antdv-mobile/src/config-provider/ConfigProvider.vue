<script setup lang="ts">
import type { ConfigContext, ConfigProviderProps, ConfigProviderSlots } from './context'
import { computed, provide, ref, useId, watch } from 'vue'
import { isDef } from '../_util'
import { mergeTheme, resolveTheme } from '../theme/util'
import { configContextKey, useConfig } from './context'
import { measureUnit, watchUnit } from './unit'
import '../style'

defineOptions({ name: 'AmConfigProvider', inheritAttrs: false })

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  componentDisabled: undefined,
})
defineSlots<ConfigProviderSlots>()

const parent = useConfig()

const themeConfig = computed(() => mergeTheme(parent.themeConfig.value, props.theme))
// unique, SSR-stable class for the stylesheet that carries component tokens
const scope = `am-scope-${useId().replace(/[^\w-]/g, '')}`
const theme = computed(() => resolveTheme(themeConfig.value, scope))

// a scope that sets its own unit / design width (`theme.token`) measures them with a probe element
const hasUnit = computed(() => {
  const token = themeConfig.value?.token
  return themeConfig.value?.inherit === false || isDef(token?.unit) || isDef(token?.designWidth)
})
const probeRef = ref<HTMLElement>()
const ownUnit = ref(parent.unit.value)
const ownDesignUnit = ref(parent.designUnit.value)
watch(probeRef, (probe, _, onCleanup) => {
  if (probe)
    onCleanup(watchUnit(probe, { unit: ownUnit, designUnit: ownDesignUnit }))
}, { flush: 'post' })
// the probe stays, but what it measures changes with the tokens
watch(() => theme.value.style, () => {
  if (probeRef.value) {
    const measured = measureUnit(probeRef.value)
    ownUnit.value = measured.unit
    ownDesignUnit.value = measured.designUnit
  }
}, { flush: 'post' })

const context: ConfigContext = {
  locale: computed(() => props.locale ?? parent.locale.value),
  direction: computed(() => props.direction ?? parent.direction.value),
  componentSize: computed(() => props.componentSize ?? parent.componentSize.value),
  componentDisabled: computed(() => props.componentDisabled ?? parent.componentDisabled.value),
  getPopupContainer: computed(() => props.getPopupContainer ?? parent.getPopupContainer.value),
  themeConfig,
  theme,
  unit: computed(() => (hasUnit.value ? ownUnit.value : parent.unit.value)),
  designUnit: computed(() => (hasUnit.value ? ownDesignUnit.value : parent.designUnit.value)),
}

// a literal <style> tag is stripped by the SFC compiler
const styleTag = 'style'

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
    <component :is="styleTag" v-if="theme.css">
      {{ theme.css }}
    </component>
    <span v-if="hasUnit" ref="probeRef" class="am-unit-probe" aria-hidden="true" />
    <slot />
  </div>
</template>
