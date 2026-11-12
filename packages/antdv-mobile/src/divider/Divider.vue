<script setup lang="ts">
import type { DividerProps, DividerSlots } from './interface'
import { computed } from 'vue'
import { useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmDivider', inheritAttrs: false })

const props = withDefaults(defineProps<DividerProps>(), {
  titlePlacement: 'center',
  vertical: undefined,
  dashed: false,
  plain: true,
})
const slots = defineSlots<DividerSlots>()

const size = useSize(() => props.size)

const isVertical = computed(() => props.vertical ?? (props.orientation ?? props.type) === 'vertical')
const variant = computed(() => props.variant ?? (props.dashed ? 'dashed' : 'solid'))
const placement = computed(() => {
  if (props.titlePlacement === 'left')
    return 'start'
  if (props.titlePlacement === 'right')
    return 'end'
  return props.titlePlacement
})
const hasText = computed(() => !!slots.default && !isVertical.value)

const classNames = computed(() => [
  'am-divider',
  isVertical.value ? 'am-divider-vertical' : 'am-divider-horizontal',
  `am-divider-${variant.value}`,
  {
    'am-divider-with-text': hasText.value,
    [`am-divider-with-text-${placement.value}`]: hasText.value,
    'am-divider-plain': props.plain,
    'am-divider-sm': size.value === 'small',
    'am-divider-md': size.value === 'middle',
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    role="separator"
    :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
  >
    <template v-if="hasText">
      <div class="am-divider-rail am-divider-rail-start" :class="classes?.rail" :style="styles?.rail" />
      <span class="am-divider-content" :class="classes?.content" :style="styles?.content">
        <slot />
      </span>
      <div class="am-divider-rail am-divider-rail-end" :class="classes?.rail" :style="styles?.rail" />
    </template>
  </div>
</template>
