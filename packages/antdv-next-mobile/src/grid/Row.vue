<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { RowProps, RowSlots } from './interface'
import { computed } from 'vue'
import { addUnit } from '../_util'
import { mergeAttrsStyle } from '../_util/vnode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmRow', inheritAttrs: false })

const props = withDefaults(defineProps<RowProps>(), {
  gutter: 0,
  wrap: true,
})
defineSlots<RowSlots>()

const gutters = computed(() => {
  const [h, v] = Array.isArray(props.gutter) ? props.gutter : [props.gutter, 0]
  return [h || 0, v || 0]
})

const classNames = computed(() => [
  'am-row',
  {
    'am-row-no-wrap': props.wrap === false,
    [`am-row-${props.justify}`]: !!props.justify,
    [`am-row-${props.align}`]: !!props.align,
  },
  props.rootClass,
])

const mergedStyle = computed(() => {
  const [h, v] = gutters.value
  const style: Record<string, string | undefined> = {}
  if (h)
    style['--am-row-gutter-x'] = addUnit(h)
  if (v)
    style.rowGap = addUnit(v)
  return style as CSSProperties
})
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="mergeAttrsStyle(mergedStyle, $attrs.style)">
    <slot />
  </div>
</template>
