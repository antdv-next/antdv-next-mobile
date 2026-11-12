<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { FlexProps, FlexSlots } from './interface'
import { computed } from 'vue'
import { addUnit } from '../_util'
import { mergeAttrsStyle } from '../space/util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmFlex', inheritAttrs: false })

const props = withDefaults(defineProps<FlexProps>(), {
  vertical: undefined,
  wrap: undefined,
  component: 'div',
})
defineSlots<FlexSlots>()

const presetGaps = ['small', 'middle', 'large']

const isVertical = computed(() => props.vertical ?? props.orientation === 'vertical')
const isPresetGap = computed(() => typeof props.gap === 'string' && presetGaps.includes(props.gap))

const classNames = computed(() => [
  'am-flex',
  {
    'am-flex-vertical': isVertical.value,
    'am-flex-wrap': props.wrap === true || props.wrap === 'wrap',
    [`am-flex-gap-${props.gap}`]: isPresetGap.value,
  },
  props.rootClass,
])

const mergedStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (typeof props.wrap === 'string' && props.wrap !== 'wrap')
    style.flexWrap = props.wrap
  if (props.justify)
    style.justifyContent = props.justify
  if (props.align)
    style.alignItems = props.align
  if (props.flex !== undefined)
    style.flex = props.flex
  if (!isPresetGap.value && props.gap !== undefined && props.gap !== null)
    style.gap = addUnit(props.gap)
  return style
})
</script>

<template>
  <component :is="component" v-bind="$attrs" :class="classNames" :style="mergeAttrsStyle(mergedStyle, $attrs.style)">
    <slot />
  </component>
</template>
