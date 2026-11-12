<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { BadgeRibbonProps, BadgeRibbonSlots } from './interface'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import { isPresetColor } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmBadgeRibbon', inheritAttrs: false })

const props = withDefaults(defineProps<BadgeRibbonProps>(), { placement: 'end' })
defineSlots<BadgeRibbonSlots>()

const preset = computed(() => isPresetColor(props.color))
const colorStyle = computed<CSSProperties | undefined>(() => {
  if (!props.color || preset.value)
    return undefined
  return { '--am-ribbon-color': props.color } as CSSProperties
})
</script>

<template>
  <div v-bind="$attrs" class="am-ribbon-wrapper" :class="[rootClass, classes?.root]" :style="styles?.root">
    <slot />
    <div
      class="am-ribbon"
      :class="[`am-ribbon-placement-${placement}`, { [`am-badge-color-${color}`]: preset }, classes?.indicator]"
      :style="[colorStyle, styles?.indicator]"
    >
      <span class="am-ribbon-content" :class="classes?.content" :style="styles?.content">
        <slot name="text"><RenderNode :node="text" /></slot>
      </span>
      <div class="am-ribbon-corner" />
    </div>
  </div>
</template>
