<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { BadgeProps, BadgeSlots } from './interface'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import { isPresetColor } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmBadge', inheritAttrs: false })

const props = withDefaults(defineProps<BadgeProps>(), {
  count: undefined,
  overflowCount: 99,
  dot: false,
  showZero: false,
  title: undefined,
})
const slots = defineSlots<BadgeSlots>()

const isEmpty = (val: unknown) => val === undefined || val === null || val === '' || val === false
const isPrimitive = (val: unknown): val is string | number => typeof val === 'string' || typeof val === 'number'

const hasStatus = computed(() => !isEmpty(props.status) || !isEmpty(props.color))
const isCustomCount = computed(() => !!slots.count || (!isEmpty(props.count) && !isPrimitive(props.count)))
const isZero = computed(() => props.count === 0 || props.count === '0')
const hasText = computed(() => !!slots.text || !isEmpty(props.text))

/** No wrapped content + status / color and nothing to count: a status dot with text. */
const isStatusMode = computed(() => !slots.default && hasStatus.value && !isCustomCount.value && (isEmpty(props.count) || hasText.value))

const isDot = computed(() => {
  if (isCustomCount.value)
    return false
  if (props.dot)
    return !isZero.value || props.showZero
  // wrapped content with only `status` / `color`: show as a dot
  return hasStatus.value && isEmpty(props.count)
})

const displayCount = computed(() => {
  const { count, overflowCount } = props
  if (!isPrimitive(count))
    return ''
  const num = Number(count)
  if (count !== '' && !Number.isNaN(num) && num > overflowCount)
    return `${overflowCount}+`
  return String(count)
})

const isHidden = computed(() => {
  if (isCustomCount.value || isDot.value)
    return false
  return isEmpty(props.count) || (isZero.value && !props.showZero)
})

const mergedTitle = computed(() => {
  if (props.title === null || props.title === false)
    return undefined
  return props.title ?? (isPrimitive(props.count) && !isDot.value ? String(props.count) : undefined)
})

const colorStyle = computed<CSSProperties | undefined>(() => {
  if (isEmpty(props.color) || isPresetColor(props.color))
    return undefined
  return { '--am-badge-color': props.color } as CSSProperties
})

function toNegative(value: number | string) {
  if (typeof value === 'number')
    return `${-value}px`
  return /^-?\d+(?:\.\d+)?$/.test(value) ? `${-Number(value)}px` : `calc(${value} * -1)`
}

const offsetStyle = computed<CSSProperties | undefined>(() => {
  if (!props.offset || !slots.default)
    return undefined
  const [x, y] = props.offset
  return {
    insetInlineEnd: toNegative(x),
    marginTop: typeof y === 'number' || /^-?\d+(?:\.\d+)?$/.test(y) ? `${Number(y)}px` : y,
  }
})

const colorClass = computed(() => ({
  [`am-badge-status-${props.status}`]: !isEmpty(props.status),
  [`am-badge-color-${props.color}`]: isPresetColor(props.color),
}))

const classNames = computed(() => [
  'am-badge',
  {
    'am-badge-status': isStatusMode.value,
    'am-badge-not-a-wrapper': !slots.default,
  },
  props.rootClass,
  props.classes?.root,
])

const indicatorClass = computed(() => [
  'am-badge-indicator',
  isDot.value ? 'am-badge-dot' : 'am-badge-count',
  {
    'am-badge-count-sm': !isDot.value && props.size === 'small',
    'am-badge-multiple-words': !isDot.value && displayCount.value.length > 1,
  },
  colorClass.value,
  props.classes?.indicator,
])
</script>

<template>
  <span v-bind="$attrs" :class="classNames" :style="styles?.root">
    <slot />
    <template v-if="isStatusMode">
      <span
        class="am-badge-indicator am-badge-status-dot"
        :class="[colorClass, classes?.indicator]"
        :style="[colorStyle, styles?.indicator]"
      />
      <span v-if="hasText" class="am-badge-status-text">
        <slot name="text"><RenderNode :node="text" /></slot>
      </span>
    </template>
    <span
      v-else-if="isCustomCount"
      class="am-badge-indicator am-badge-custom-count"
      :class="classes?.indicator"
      :style="[offsetStyle, styles?.indicator]"
    >
      <slot name="count"><RenderNode :node="count" /></slot>
    </span>
    <Transition v-else name="am-badge-zoom">
      <sup
        v-if="!isHidden"
        :class="indicatorClass"
        :style="[colorStyle, offsetStyle, styles?.indicator]"
        :title="mergedTitle"
      >
        <template v-if="!isDot">{{ displayCount }}</template>
      </sup>
    </Transition>
  </span>
</template>
