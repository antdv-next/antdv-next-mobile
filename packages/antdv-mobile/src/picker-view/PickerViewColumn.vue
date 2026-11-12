<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { RenderNodeFn } from '../_util/type'
import type { PickerOptionRenderInfo, PickerValue } from './interface'
import type { NormalizedPickerOption } from './util'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { cancelRaf, clamp, preventDefault, raf } from '../_util'
import { useTouch, useVirtualRange } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { findEnabledIndex } from './util'

defineOptions({ name: 'AmPickerViewColumn' })

const props = withDefaults(defineProps<{
  options: NormalizedPickerOption[]
  value?: PickerValue
  columnIndex: number
  itemHeight: number
  visibleItemCount: number
  optionRender?: RenderNodeFn<PickerOptionRenderInfo>
  itemClass?: string
  itemStyle?: CSSProperties
  /** `false` renders every option */
  virtual?: boolean
}>(), {
  virtual: true,
  // render-type props include `boolean`: without this Vue casts an absent prop to `false`
  optionRender: undefined,
})
const emit = defineEmits<{ change: [value: PickerValue] }>()
defineSlots<{ option?: (info: PickerOptionRenderInfo) => any }>()

const DEFAULT_DURATION = 200
/** a release within this time (ms) and beyond this distance (px) is a flick */
const MOMENTUM_TIME = 300
const MOMENTUM_DISTANCE = 15
const MOMENTUM_DURATION = 1000
const DECELERATION = 0.003
const WHEEL_INTERVAL = 60

const touch = useTouch()
const wrapperRef = ref<HTMLElement>()

const count = () => props.options.length
const baseOffset = computed(() => (props.itemHeight * (props.visibleItemCount - 1)) / 2)
const currentIndex = computed(() => props.options.findIndex(option => option.value === props.value))
const indexToOffset = (index: number) => -Math.max(index, 0) * props.itemHeight

const offset = ref(indexToOffset(currentIndex.value))
const duration = ref(0)

let startOffset = 0
let touchStartTime = 0
let momentumOffset = 0
let moving = false
let lastWheelTime = 0
let movingTimer: ReturnType<typeof setTimeout> | undefined

// ---------- windowing ----------
/**
 * Position of the wheel while a transition (snap / inertia) is running. `offset` already holds the
 * target then, so the window follows the *rendered* position frame by frame instead, otherwise the
 * rows the wheel is still rolling over would be unmounted. `null`: the wheel rests at `offset`.
 */
const trackedOffset = ref<number | null>(null)
let trackId = -1
let trackTimer: ReturnType<typeof setTimeout> | undefined

const range = useVirtualRange({
  count,
  size: () => props.itemHeight,
  // the wheel is centred: `baseOffset` px of the viewport sit above the selected row
  scrollOffset: () => -(trackedOffset.value ?? offset.value) - baseOffset.value,
  viewportSize: () => props.itemHeight * props.visibleItemCount,
  // one viewport on each side, so drags and inertia never run into blank rows
  overscan: () => Math.max(props.visibleItemCount, 3),
  enabled: () => props.virtual,
})

const visibleOptions = computed(() => {
  const start = range.start.value
  return props.options.slice(start, range.end.value).map((option, i) => ({ option, index: start + i }))
})

watch(
  () => [currentIndex.value, props.itemHeight, count()],
  () => {
    const next = indexToOffset(currentIndex.value)
    if (next !== offset.value) {
      duration.value = DEFAULT_DURATION
      offset.value = next
    }
  },
)

const offsetToIndex = (value: number) => clamp(Math.round(-value / props.itemHeight), 0, Math.max(count() - 1, 0))

function selectIndex(index: number, animateDuration: number) {
  const target = findEnabledIndex(props.options, index)
  if (target < 0)
    return
  duration.value = animateDuration
  offset.value = indexToOffset(target)
  const option = props.options[target]
  if (option.value !== props.value)
    emit('change', option.value)
}

/** position of the wheel in the middle of a running transition */
function getRenderedOffset() {
  const el = wrapperRef.value
  if (!el)
    return offset.value
  const { transform } = window.getComputedStyle(el)
  const translateY = Number(transform.slice(7, transform.length - 1).split(', ')[5])
  return Number.isNaN(translateY) ? offset.value : Math.min(0, translateY - baseOffset.value)
}

function stopMomentum() {
  moving = false
  duration.value = 0
}

function onTouchStart(event: TouchEvent) {
  touch.start(event)
  clearTimeout(movingTimer)
  if (moving)
    offset.value = getRenderedOffset()
  moving = false
  duration.value = 0
  startOffset = offset.value
  touchStartTime = Date.now()
  momentumOffset = startOffset
}

function onTouchMove(event: TouchEvent) {
  touch.move(event)
  if (touch.isVertical()) {
    moving = true
    preventDefault(event, true)
  }
  // one extra option of rubber band on both ends
  offset.value = clamp(startOffset + touch.deltaY.value, -(count() * props.itemHeight), props.itemHeight)
  const now = Date.now()
  if (now - touchStartTime > MOMENTUM_TIME) {
    touchStartTime = now
    momentumOffset = offset.value
  }
}

function onTouchEnd() {
  const distance = offset.value - momentumOffset
  const elapsed = Date.now() - touchStartTime
  if (elapsed < MOMENTUM_TIME && Math.abs(distance) > MOMENTUM_DISTANCE) {
    // inertia: keep rolling proportionally to the release speed, then snap
    const speed = Math.abs(distance / Math.max(elapsed, 1))
    const target = offset.value + (speed / DECELERATION) * (distance < 0 ? -1 : 1)
    selectIndex(offsetToIndex(target), MOMENTUM_DURATION)
    return
  }
  selectIndex(offsetToIndex(offset.value), DEFAULT_DURATION)
  // skip the click emitted right after a drag
  movingTimer = setTimeout(() => {
    moving = false
  }, 0)
}

function onClickOption(index: number) {
  if (moving || props.options[index].disabled)
    return
  selectIndex(index, DEFAULT_DURATION)
}

function step(delta: number) {
  const from = currentIndex.value < 0 ? 0 : currentIndex.value
  let index = from + delta
  // jump over disabled options in the moving direction
  while (index >= 0 && index < count() && props.options[index].disabled)
    index += delta
  if (index >= 0 && index < count())
    selectIndex(index, DEFAULT_DURATION)
}

function onWheel(event: WheelEvent) {
  preventDefault(event)
  const now = Date.now()
  if (!event.deltaY || now - lastWheelTime < WHEEL_INTERVAL)
    return
  lastWheelTime = now
  step(event.deltaY > 0 ? 1 : -1)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    preventDefault(event)
    step(event.key === 'ArrowDown' ? 1 : -1)
  }
}

function stopTracking() {
  cancelRaf(trackId)
  clearTimeout(trackTimer)
  trackedOffset.value = null
}

function trackTransition() {
  const rendered = getRenderedOffset()
  if (!duration.value || Math.abs(rendered - offset.value) < 0.5) {
    stopTracking()
    return
  }
  trackedOffset.value = rendered
  trackId = raf(trackTransition)
}

// runs before the DOM is patched: the wheel is still rendered at its previous position
watch(offset, () => {
  stopTracking()
  if (!props.virtual || !duration.value)
    return
  // frames may never come (background tab) and `transitionend` may not fire: always settle on the target
  trackTimer = setTimeout(stopTracking, duration.value + 100)
  trackTransition()
})

onBeforeUnmount(() => {
  clearTimeout(movingTimer)
  stopTracking()
})

const wrapperStyle = computed<CSSProperties>(() => ({
  // leading spacer: the rendered window keeps its place in the full list
  paddingTop: range.offsetBefore.value ? `${range.offsetBefore.value}px` : undefined,
  transform: `translate3d(0, ${offset.value + baseOffset.value}px, 0)`,
  transitionDuration: `${duration.value}ms`,
  transitionProperty: duration.value ? 'transform' : 'none',
}))
</script>

<template>
  <div
    class="am-picker-view-column"
    role="listbox"
    tabindex="0"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @wheel="onWheel"
    @keydown="onKeydown"
  >
    <ul ref="wrapperRef" class="am-picker-view-column-wrapper" :style="wrapperStyle" @transitionend="stopMomentum">
      <li
        v-for="{ option, index } in visibleOptions"
        :key="`${index}-${option.value}`"
        class="am-picker-view-item"
        :class="[
          { 'am-picker-view-item-selected': option.value === value, 'am-picker-view-item-disabled': option.disabled },
          itemClass,
        ]"
        :style="itemStyle"
        role="option"
        :aria-selected="option.value === value"
        :aria-disabled="option.disabled || undefined"
        :aria-setsize="virtual ? options.length : undefined"
        :aria-posinset="virtual ? index + 1 : undefined"
        @click="onClickOption(index)"
      >
        <slot name="option" :option="option.raw" :index="index" :column-index="columnIndex" :selected="option.value === value">
          <RenderNode
            v-if="optionRender !== undefined"
            :node="optionRender"
            :params="{ option: option.raw, index, columnIndex, selected: option.value === value }"
          />
          <span v-else class="am-picker-view-item-text">{{ option.label }}</span>
        </slot>
      </li>
    </ul>
  </div>
</template>
