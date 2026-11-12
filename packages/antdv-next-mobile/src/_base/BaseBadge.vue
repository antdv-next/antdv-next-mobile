<script setup lang="ts">
import { computed } from 'vue'
import '../style'
import './style/badge.css'

/**
 * Count / dot bubble shared by Badge, TabBar, SideBar and FloatButton.
 * Positioning is left to the consumer (it is an inline element by default).
 */
defineOptions({ name: 'AmBaseBadge' })

const props = withDefaults(defineProps<{
  /** number / text to show; `true` is a dot */
  count?: number | string | boolean | null
  dot?: boolean
  overflowCount?: number
  showZero?: boolean
  /** any css color; default is the error color */
  color?: string
}>(), {
  count: undefined,
  dot: false,
  overflowCount: 99,
  showZero: false,
})

defineSlots<{ default?: () => any }>()

const isDot = computed(() => props.dot || props.count === true)
const isZero = computed(() => props.count === 0 || props.count === '0')

const visible = computed(() => {
  if (isDot.value)
    return !isZero.value || props.showZero
  const { count } = props
  if (count === undefined || count === null || count === false || count === '')
    return false
  return !isZero.value || props.showZero
})

const text = computed(() => {
  const { count, overflowCount } = props
  if (typeof count === 'number' || (typeof count === 'string' && count !== '' && !Number.isNaN(Number(count))))
    return Number(count) > overflowCount ? `${overflowCount}+` : String(count)
  return typeof count === 'string' ? count : ''
})
</script>

<template>
  <sup
    v-if="visible"
    class="am-base-badge"
    :class="{ 'am-base-badge-dot': isDot }"
    :style="color ? { background: color } : undefined"
  >
    <slot v-if="!isDot">{{ text }}</slot>
  </sup>
</template>
