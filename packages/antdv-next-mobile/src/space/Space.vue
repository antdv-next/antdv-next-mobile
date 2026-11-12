<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SpaceProps, SpaceSize, SpaceSlots } from './interface'
import { computed } from 'vue'
import { addUnit } from '../_util'
import RenderNode from '../_util/RenderNode'
import { flattenChildren, mergeAttrsStyle } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSpace', inheritAttrs: false })

const props = withDefaults(defineProps<SpaceProps>(), {
  size: 'small',
  vertical: undefined,
  wrap: false,
  block: false,
})
const slots = defineSlots<SpaceSlots>()

const presetSizes = ['small', 'middle', 'large']
const isPreset = (size: SpaceSize) => typeof size === 'string' && presetSizes.includes(size)

const isVertical = computed(() => props.vertical ?? (props.orientation ?? props.direction) === 'vertical')
const mergedAlign = computed(() => props.align ?? (isVertical.value ? undefined : 'center'))
const sizes = computed<[SpaceSize, SpaceSize]>(() => {
  const [h, v] = Array.isArray(props.size) ? props.size : [props.size, props.size]
  return [h ?? 'small', v ?? 'small']
})
const hasSeparator = computed(() => !!slots.separator || (props.separator !== undefined && props.separator !== null && props.separator !== false))

const classNames = computed(() => {
  const [h, v] = sizes.value
  return [
    'am-space',
    isVertical.value ? 'am-space-vertical' : 'am-space-horizontal',
    {
      [`am-space-align-${mergedAlign.value}`]: !!mergedAlign.value,
      'am-space-wrap': props.wrap,
      'am-space-block': props.block,
      [`am-space-gap-col-${h}`]: isPreset(h),
      [`am-space-gap-row-${v}`]: isPreset(v),
    },
    props.rootClass,
    props.classes?.root,
  ]
})

const mergedStyle = computed<CSSProperties>(() => {
  const [h, v] = sizes.value
  const style: CSSProperties = {}
  if (!isPreset(h))
    style.columnGap = addUnit(h)
  if (!isPreset(v))
    style.rowGap = addUnit(v)
  return { ...style, ...props.styles?.root }
})

// Slot content is collected while rendering (by the root `v-if`) so that it stays reactive.
let children: ReturnType<typeof flattenChildren> = []
function collectChildren() {
  children = flattenChildren(slots.default?.())
  return children.length > 0
}
const getChildren = () => children
</script>

<template>
  <div v-if="collectChildren()" v-bind="$attrs" :class="classNames" :style="mergeAttrsStyle(mergedStyle, $attrs.style)">
    <template v-for="(child, index) in getChildren()" :key="index">
      <div class="am-space-item" :class="classes?.item" :style="styles?.item">
        <RenderNode :node="child" />
      </div>
      <span
        v-if="hasSeparator && index < getChildren().length - 1"
        class="am-space-item-separator"
        :class="classes?.separator"
        :style="styles?.separator"
      >
        <slot name="separator"><RenderNode :node="separator" /></slot>
      </span>
    </template>
  </div>
</template>
