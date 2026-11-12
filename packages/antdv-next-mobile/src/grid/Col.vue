<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ColFlexType, ColProps, ColSlots, ColSpanType } from './interface'
import { computed } from 'vue'
import { mergeAttrsStyle } from '../_util/vnode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCol', inheritAttrs: false })

const props = defineProps<ColProps>()
defineSlots<ColSlots>()

const COLUMNS = 24

function toNumber(value?: ColSpanType): number | undefined {
  if (value === undefined || value === null || value === '')
    return undefined
  const num = Number(value)
  return Number.isNaN(num) ? undefined : num
}

function percent(value: number) {
  return `${Number((value / COLUMNS * 100).toFixed(6))}%`
}

function parseFlex(flex: ColFlexType): string {
  if (typeof flex === 'number')
    return `${flex} ${flex} auto`
  if (/^\d+(?:\.\d+)?(?:px|em|rem|%|vw|vh)$/.test(flex))
    return `0 0 ${flex}`
  return flex
}

const span = computed(() => toNumber(props.span))

const classNames = computed(() => [
  'am-col',
  {
    [`am-col-${span.value}`]: span.value !== undefined,
    'am-col-hidden': span.value === 0,
    'am-col-flex': props.flex !== undefined && props.flex !== null,
  },
  props.rootClass,
])

const mergedStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  if (span.value !== undefined && span.value > 0) {
    style.flex = `0 0 ${percent(span.value)}`
    style.maxWidth = percent(span.value)
  }
  const offset = toNumber(props.offset)
  if (offset)
    style.marginInlineStart = percent(offset)
  const push = toNumber(props.push)
  if (push)
    style.insetInlineStart = percent(push)
  const pull = toNumber(props.pull)
  if (pull)
    style.insetInlineEnd = percent(pull)
  if (props.order !== undefined && props.order !== null && props.order !== '')
    style.order = Number(props.order)
  if (props.flex !== undefined && props.flex !== null)
    style.flex = parseFlex(props.flex)
  return style
})
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="mergeAttrsStyle(mergedStyle, $attrs.style)">
    <slot />
  </div>
</template>
