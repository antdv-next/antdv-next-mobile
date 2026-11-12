<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { RollingTextEmits, RollingTextProps } from './interface'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { addUnit, inBrowser } from '../_util'
import { mergeAttrsStyle } from '../_util/vnode'
import { formatNumbers, getNumberColumns, getTextColumns } from './utils'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmRollingText', inheritAttrs: false })

const props = withDefaults(defineProps<RollingTextProps>(), {
  value: 0,
  from: 0,
  duration: 2,
  autoStart: true,
  direction: 'down',
  stopOrder: 'ltr',
})
const emit = defineEmits<RollingTextEmits>()

/** Seconds between two neighbouring columns coming to a stop. */
const STAGGER = 0.2

const isText = computed(() => Array.isArray(props.texts) && props.texts.length > 0)
const columns = computed(() => isText.value
  ? getTextColumns(props.texts!, props.direction)
  : getNumberColumns(props.from, props.value, props.direction))
const rollingCount = computed(() => columns.value.filter(column => column.rolling).length)
const label = computed(() => isText.value
  ? String(props.texts![props.texts!.length - 1] ?? '')
  : formatNumbers(props.from, props.value).label)

// Rendered rolling on the server too, so the animation plays before hydration.
const rolling = ref(props.autoStart)
/** Bumped on every start: the columns are re-created, which restarts the CSS animation. */
const runId = ref(0)

function prefersReducedMotion() {
  return inBrowser && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** With reduced motion the css jumps to the target and no `animationend` fires. */
function finishWithoutMotion() {
  if (!prefersReducedMotion())
    return
  const id = runId.value
  nextTick(() => {
    if (rolling.value && id === runId.value)
      emit('finish')
  })
}

function start() {
  runId.value += 1
  rolling.value = true
  finishWithoutMotion()
}

function reset() {
  runId.value += 1
  rolling.value = false
}

function getDelay(order: number) {
  const index = props.stopOrder === 'rtl' ? rollingCount.value - 1 - order : order
  return `${index * STAGGER}s`
}

function handleAnimationEnd(order: number) {
  if (!rolling.value)
    return
  const last = props.stopOrder === 'rtl' ? 0 : rollingCount.value - 1
  if (order === last)
    emit('finish')
}

onMounted(() => {
  if (rolling.value)
    finishWithoutMotion()
})

watch(() => props.autoStart, (value) => {
  if (value)
    start()
})

watch(
  () => [props.value, props.from, props.direction, props.texts],
  () => (props.autoStart ? start() : reset()),
  { deep: true },
)

const rootStyle = computed<CSSProperties>(() => {
  const style: Record<string, string> = { '--am-rolling-text-duration': `${props.duration}s` }
  const height = addUnit(props.height)
  if (height)
    style['--am-rolling-text-item-height'] = height
  return { ...style, ...props.styles?.root }
})

defineExpose({ start, reset })
</script>

<template>
  <span
    v-bind="$attrs"
    class="am-rolling-text"
    :class="[
      `am-rolling-text-${direction}`,
      { 'am-rolling-text-rolling': rolling },
      rootClass,
      classes?.root,
    ]"
    :style="mergeAttrsStyle(rootStyle, $attrs.style)"
    role="img"
    :aria-label="label"
  >
    <template v-for="(column, index) in columns" :key="`${runId}-${index}`">
      <span
        v-if="column.rolling"
        class="am-rolling-text-item"
        :class="classes?.item"
        :style="[
          { '--am-rolling-text-steps': column.figures.length - 1, '--am-rolling-text-delay': getDelay(column.order) },
          styles?.item,
        ]"
        aria-hidden="true"
      >
        <span class="am-rolling-text-item-box" @animationend="handleAnimationEnd(column.order)">
          <span v-for="(figure, i) in column.figures" :key="i" class="am-rolling-text-item-figure">{{ figure }}</span>
        </span>
      </span>
      <span v-else class="am-rolling-text-separator" aria-hidden="true">{{ column.figures[0] }}</span>
    </template>
  </span>
</template>
