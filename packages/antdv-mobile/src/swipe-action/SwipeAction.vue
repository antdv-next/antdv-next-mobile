<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SwipeActionEmits, SwipeActionItem, SwipeActionProps, SwipeActionSide, SwipeActionSlots } from './interface'
import { computed, ref } from 'vue'
import { preventDefault } from '../_util'
import { useClickAway, useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSwipeAction', inheritAttrs: false })

const props = withDefaults(defineProps<SwipeActionProps>(), {
  closeOnAction: true,
  closeOnTouchOutside: true,
  disabled: undefined,
  stopPropagation: false,
})
const emit = defineEmits<SwipeActionEmits>()
const slots = defineSlots<SwipeActionSlots>()

/** share of the actions width that has to be revealed to open (and kept to stay open) */
const THRESHOLD = 0.15
/** px / ms, a faster flick opens / closes regardless of the distance */
const VELOCITY = 0.3
const RESISTANCE = 0.3
const PRESET_COLORS = ['primary', 'danger', 'warning', 'success', 'default']

const disabled = useDisabled(() => props.disabled)
const touch = useTouch()

const rootRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const leftRef = ref<HTMLElement>()
const rightRef = ref<HTMLElement>()

const offset = ref(0)
const dragging = ref(false)
const leftWidth = ref(0)
const rightWidth = ref(0)
const opened = ref<SwipeActionSide | ''>('')

const hasLeft = computed(() => !!slots.left || !!props.leftActions?.length)
const hasRight = computed(() => !!slots.right || !!props.rightActions?.length)

function measure() {
  // widths are stretched while overshooting, only measure at rest
  if (Math.abs(offset.value) > Math.max(leftWidth.value, rightWidth.value) && (leftWidth.value || rightWidth.value))
    return
  leftWidth.value = leftRef.value?.offsetWidth ?? 0
  rightWidth.value = rightRef.value?.offsetWidth ?? 0
}

function show(side: SwipeActionSide = 'right') {
  measure()
  const width = side === 'left' ? leftWidth.value : rightWidth.value
  if (!width && !(side === 'left' ? hasLeft.value : hasRight.value))
    return
  offset.value = side === 'left' ? width : -width
  if (opened.value !== side) {
    opened.value = side
    emit('actionsReveal', side)
  }
}

function close() {
  offset.value = 0
  if (opened.value) {
    opened.value = ''
    emit('close')
  }
}

/** Follows the finger inside the bounds and with resistance beyond them. */
function rubber(value: number) {
  const max = leftWidth.value
  const min = -rightWidth.value
  if (value > max)
    return max ? max + (value - max) * RESISTANCE : 0
  if (value < min)
    return min ? min + (value - min) * RESISTANCE : 0
  return value
}

let startOffset = 0
let startTime = 0
let lockClick = false

function onTouchStart(event: TouchEvent) {
  if (disabled.value)
    return
  measure()
  startOffset = offset.value
  startTime = Date.now()
  touch.start(event)
}

function onTouchMove(event: TouchEvent) {
  if (disabled.value)
    return
  touch.move(event)
  // the direction is locked by the first few pixels, vertical scrolling is left to the page
  if (!touch.isHorizontal())
    return
  if (!leftWidth.value && !rightWidth.value)
    return
  lockClick = true
  dragging.value = true
  preventDefault(event, props.stopPropagation)
  offset.value = rubber(touch.deltaX.value + startOffset)
}

function onTouchEnd() {
  if (!dragging.value)
    return
  dragging.value = false
  const side: SwipeActionSide = offset.value > 0 ? 'left' : 'right'
  const width = side === 'left' ? leftWidth.value : rightWidth.value
  const distance = touch.deltaX.value
  const velocity = distance / Math.max(Date.now() - startTime, 1)

  let shouldOpen: boolean
  if (Math.abs(velocity) > VELOCITY && Math.abs(distance) > 10) {
    // a flick decides by its direction
    shouldOpen = side === 'left' ? velocity > 0 : velocity < 0
  }
  else {
    const threshold = opened.value ? 1 - THRESHOLD : THRESHOLD
    shouldOpen = Math.abs(offset.value) > width * threshold
  }

  if (width && offset.value && shouldOpen)
    show(side)
  else
    close()

  // the click synthesized after the drag must not hit the content
  setTimeout(() => {
    lockClick = false
  }, 0)
}

function onClickCapture(event: MouseEvent) {
  const inContent = !!contentRef.value?.contains(event.target as Node)
  if (lockClick) {
    lockClick = false
    if (inContent)
      preventDefault(event, true)
    return
  }
  if (opened.value && inContent) {
    // tapping the content of an opened item only closes it
    preventDefault(event, true)
    close()
  }
}

function onAction(action: SwipeActionItem, event: MouseEvent) {
  action.onClick?.(event)
  emit('action', action, event)
  if (props.closeOnAction)
    close()
}

const closeOnOutside = () => !!opened.value && props.closeOnTouchOutside
useClickAway(rootRef, close, { eventName: 'touchstart', enabled: closeOnOutside })
useClickAway(rootRef, close, { eventName: 'mousedown', enabled: closeOnOutside })

// ---------- render ----------
const trackStyle = computed<CSSProperties>(() => ({
  transform: offset.value ? `translate3d(${offset.value}px, 0, 0)` : '',
  transitionDuration: dragging.value ? '0s' : undefined,
}))

/** stretch the buttons instead of showing a gap while overshooting */
const leftStyle = computed<CSSProperties | undefined>(() => (leftWidth.value && offset.value > leftWidth.value ? { width: `${offset.value}px` } : undefined))
const rightStyle = computed<CSSProperties | undefined>(() => (rightWidth.value && -offset.value > rightWidth.value ? { width: `${-offset.value}px` } : undefined))

const isPreset = (color?: string) => !color || PRESET_COLORS.includes(color)

const classNames = computed(() => [
  'am-swipe-action',
  {
    'am-swipe-action-disabled': disabled.value,
    'am-swipe-action-dragging': dragging.value,
    [`am-swipe-action-open-${opened.value}`]: !!opened.value,
  },
  props.rootClass,
  props.classes?.root,
])

defineExpose({ show, close })
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @click.capture="onClickCapture"
  >
    <div class="am-swipe-action-track" :style="trackStyle">
      <div
        v-if="hasLeft"
        ref="leftRef"
        class="am-swipe-action-actions am-swipe-action-left"
        :class="classes?.actions"
        :style="[leftStyle, styles?.actions]"
      >
        <slot name="left">
          <button
            v-for="action in leftActions"
            :key="action.key"
            type="button"
            class="am-swipe-action-button"
            :class="[`am-swipe-action-button-${isPreset(action.color) ? action.color ?? 'default' : 'custom'}`, classes?.action]"
            :style="[isPreset(action.color) ? undefined : { background: action.color }, styles?.action]"
            @click="onAction(action, $event)"
          >
            <RenderNode :node="action.text" />
          </button>
        </slot>
      </div>
      <div ref="contentRef" class="am-swipe-action-content" :class="classes?.content" :style="styles?.content">
        <slot />
      </div>
      <div
        v-if="hasRight"
        ref="rightRef"
        class="am-swipe-action-actions am-swipe-action-right"
        :class="classes?.actions"
        :style="[rightStyle, styles?.actions]"
      >
        <slot name="right">
          <button
            v-for="action in rightActions"
            :key="action.key"
            type="button"
            class="am-swipe-action-button"
            :class="[`am-swipe-action-button-${isPreset(action.color) ? action.color ?? 'default' : 'custom'}`, classes?.action]"
            :style="[isPreset(action.color) ? undefined : { background: action.color }, styles?.action]"
            @click="onAction(action, $event)"
          >
            <RenderNode :node="action.text" />
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
