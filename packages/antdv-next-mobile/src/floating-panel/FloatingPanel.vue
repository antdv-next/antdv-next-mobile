<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { FloatingPanelEmits, FloatingPanelProps, FloatingPanelSlots } from './interface'
import { computed, onMounted, ref, watch } from 'vue'
import { clamp, doubleRaf, preventDefault } from '../_util'
import { useControlled, useEventListener, useLockScroll, useTouch } from '../_util/hooks'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmFloatingPanel', inheritAttrs: false })

const props = withDefaults(defineProps<FloatingPanelProps>(), {
  contentDraggable: true,
  duration: 300,
  safeArea: true,
  lockScroll: false,
  fixed: true,
})
const emit = defineEmits<FloatingPanelEmits>()
defineSlots<FloatingPanelSlots>()

/** how much the panel follows the finger beyond the first / last anchor */
const DAMP = 0.2
/** px / ms, a faster flick moves to the next anchor in that direction */
const VELOCITY = 0.5
const DEFAULT_MIN = 100

const touch = useTouch()
const rootRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

/** height available to the panel, measured on mount (viewport or positioned parent) */
const availableHeight = ref(0)
const dragging = ref(false)
const immediate = ref(false)

const anchors = computed(() => {
  if (props.anchors?.length)
    return [...props.anchors].sort((a, b) => a - b)
  return [DEFAULT_MIN, Math.max(Math.round(availableHeight.value * 0.6), DEFAULT_MIN)]
})
const boundary = computed(() => ({ min: anchors.value[0], max: anchors.value[anchors.value.length - 1] }))

const [height, setHeightState] = useControlled(props, 'height', {
  defaultValue: () => boundary.value.min,
  onChange: (value: number) => emit('update:height', value),
})

function closest(list: number[], target: number) {
  return list.reduce((prev, cur) => (Math.abs(prev - target) <= Math.abs(cur - target) ? prev : cur))
}

function ease(moveY: number) {
  const abs = Math.abs(moveY)
  const { min, max } = boundary.value
  if (abs > max)
    return -(max + (abs - max) * DAMP)
  if (abs < min)
    return -(min - (min - abs) * DAMP)
  return moveY
}

function setHeight(value: number, options: { immediate?: boolean } = {}) {
  const next = Math.max(value, 0)
  if (options.immediate) {
    immediate.value = true
    doubleRaf(() => {
      immediate.value = false
    })
  }
  if (next !== height.value) {
    setHeightState(next)
    emit('heightChange', next, { animating: !options.immediate })
  }
}

function measure() {
  const root = rootRef.value
  if (!root)
    return
  const parent = props.fixed ? null : (root.offsetParent as HTMLElement | null)
  availableHeight.value = parent?.clientHeight || window.innerHeight
}

onMounted(() => {
  measure()
  if (props.height === undefined && height.value !== boundary.value.min)
    setHeightState(boundary.value.min)
})
useEventListener('resize', measure)
watch(() => props.fixed, measure, { flush: 'post' })

// keep the panel on an anchor when the anchors change
watch(boundary, () => {
  if (dragging.value)
    return
  const next = closest(anchors.value, height.value)
  if (next !== height.value)
    setHeight(next)
})

// ---------- touch ----------
let startY = 0
let startTime = 0
let maxScroll = -1

function onTouchStart(event: TouchEvent) {
  touch.start(event)
  dragging.value = true
  startY = -height.value
  startTime = Date.now()
  maxScroll = -1
}

function onTouchMove(event: TouchEvent) {
  if (!dragging.value)
    return
  touch.move(event)
  const target = event.target as Node
  const content = contentRef.value
  if (content && (content === target || content.contains(target))) {
    const { scrollTop } = content
    // once the content has been scrolled during this gesture, the gesture belongs to the content
    maxScroll = Math.max(maxScroll, scrollTop)
    if (!props.contentDraggable)
      return
    if (-startY < boundary.value.max)
      preventDefault(event, true)
    else if (!(scrollTop <= 0 && touch.deltaY.value > 0) || maxScroll > 0)
      return
  }
  else {
    preventDefault(event, true)
  }
  const moveY = touch.deltaY.value + startY
  const next = -ease(moveY)
  if (next !== height.value) {
    setHeightState(next)
    emit('heightChange', next, { animating: false })
  }
}

function onTouchEnd() {
  if (!dragging.value)
    return
  maxScroll = -1
  dragging.value = false
  const startHeight = -startY
  const moved = height.value !== startHeight
  const distance = touch.deltaY.value
  const velocity = distance / Math.max(Date.now() - startTime, 1)

  let target = closest(anchors.value, height.value)
  if (moved && Math.abs(velocity) > VELOCITY && Math.abs(distance) > 10) {
    if (velocity < 0)
      target = anchors.value.find(anchor => anchor > startHeight) ?? boundary.value.max
    else
      target = [...anchors.value].reverse().find(anchor => anchor < startHeight) ?? boundary.value.min
  }
  if (target !== height.value) {
    setHeightState(target)
    emit('heightChange', target, { animating: true })
  }
  else if (moved) {
    emit('heightChange', target, { animating: true })
  }
}

useLockScroll(rootRef, () => props.lockScroll || dragging.value)
// `passive: false` is required to prevent the page from scrolling while the panel is dragged
useEventListener('touchmove', onTouchMove as EventListener, { target: rootRef, passive: false })

const rootStyle = computed<CSSProperties>(() => ({
  height: `${boundary.value.max}px`,
  transform: `translateY(calc(100% - ${clamp(height.value, 0, Number.MAX_SAFE_INTEGER)}px))`,
  transitionDuration: dragging.value || immediate.value ? '0ms' : `${props.duration}ms`,
  zIndex: props.zIndex,
}))

const classNames = computed(() => [
  'am-floating-panel',
  {
    'am-floating-panel-absolute': !props.fixed,
    'am-floating-panel-safe-area': props.safeArea,
    'am-floating-panel-dragging': dragging.value,
  },
  props.rootClass,
  props.classes?.root,
])

defineExpose({ setHeight })
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    :class="classNames"
    :style="[rootStyle, styles?.root]"
    @touchstart.passive="onTouchStart"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div class="am-floating-panel-header" :class="classes?.header" :style="styles?.header">
      <slot name="header">
        <div class="am-floating-panel-bar" />
      </slot>
    </div>
    <div ref="contentRef" class="am-floating-panel-content" :class="classes?.content" :style="styles?.content">
      <slot />
    </div>
  </div>
</template>
