<script setup lang="ts">
import type { FloatButtonEmits, FloatButtonOffset, FloatButtonProps, FloatButtonSlots } from './interface'
import { FileTextOutlined } from '@antdv-next/icons'
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import { BaseBadge } from '../_base'
import { clamp, isRenderable, preventDefault } from '../_util'
import { useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { floatButtonGroupContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmFloatButton', inheritAttrs: false })

const props = withDefaults(defineProps<FloatButtonProps>(), {
  icon: undefined,
  content: undefined,
  description: undefined,
  type: 'default',
  htmlType: 'button',
  draggable: false,
  axis: 'xy',
  gap: 16,
})
const emit = defineEmits<FloatButtonEmits>()
const slots = defineSlots<FloatButtonSlots>()

const group = inject(floatButtonGroupContextKey, null)
const rootRef = ref<HTMLElement>()

const mergedShape = computed(() => group?.shape.value ?? props.shape ?? 'circle')
const mergedContent = computed(() => (isRenderable(props.content) ? props.content : props.description))
const hasContent = computed(() => !!slots.default || isRenderable(mergedContent.value))
const hasIcon = computed(() => !!slots.icon || isRenderable(props.icon))
const canDrag = computed(() => props.draggable && !group)

// ---------- drag ----------
const touch = useTouch()
const position = ref<FloatButtonOffset | undefined>(props.offset)
const dragging = ref(false)
let startPosition: FloatButtonOffset = { x: 0, y: 0 }
let bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 }
let justDragged = false
let resetTimer: ReturnType<typeof setTimeout> | undefined

watch(() => props.offset, (value) => {
  if (value)
    position.value = { x: value.x, y: value.y }
})

function measure(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  // `position: absolute` usage: move inside the offset parent instead of the viewport
  const parent = window.getComputedStyle(el).position === 'absolute' ? el.offsetParent as HTMLElement | null : null
  let originX = 0
  let originY = 0
  let width = window.innerWidth
  let height = window.innerHeight
  if (parent) {
    const parentRect = parent.getBoundingClientRect()
    originX = parentRect.left + parent.clientLeft
    originY = parentRect.top + parent.clientTop
    width = parent.clientWidth
    height = parent.clientHeight
  }
  const gap = props.gap
  bounds = {
    minX: gap,
    maxX: Math.max(gap, width - rect.width - gap),
    minY: gap,
    maxY: Math.max(gap, height - rect.height - gap),
  }
  return { x: rect.left - originX, y: rect.top - originY }
}

function onTouchStart(event: TouchEvent) {
  const el = rootRef.value
  if (!canDrag.value || !el)
    return
  touch.start(event)
  const current = measure(el)
  startPosition = position.value ?? current
  dragging.value = true
}

function onTouchMove(event: TouchEvent) {
  if (!dragging.value)
    return
  touch.move(event)
  if (touch.isTap.value)
    return
  preventDefault(event)
  applyMove()
}

function applyMove() {
  const next = { ...startPosition }
  if (props.axis !== 'y')
    next.x = clamp(startPosition.x + touch.deltaX.value, bounds.minX, bounds.maxX)
  if (props.axis !== 'x')
    next.y = clamp(startPosition.y + touch.deltaY.value, bounds.minY, bounds.maxY)
  position.value = next
}

function onTouchEnd() {
  if (!dragging.value)
    return
  dragging.value = false
  if (touch.isTap.value || !position.value)
    return
  const next = { ...position.value }
  if (props.magnetic === 'x')
    next.x = next.x - bounds.minX < bounds.maxX - next.x ? bounds.minX : bounds.maxX
  else if (props.magnetic === 'y')
    next.y = next.y - bounds.minY < bounds.maxY - next.y ? bounds.minY : bounds.maxY
  position.value = next
  emit('update:offset', next)
  emit('offsetChange', next)
  // a drag must not be followed by a click
  justDragged = true
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    justDragged = false
  }, 0)
}

// mouse fallback so dragging also works in desktop browsers
function toTouchEvent(event: MouseEvent) {
  return { touches: [{ clientX: event.clientX, clientY: event.clientY }] } as unknown as TouchEvent
}

function onMouseMove(event: MouseEvent) {
  if (!dragging.value)
    return
  touch.move(toTouchEvent(event))
  if (touch.isTap.value)
    return
  preventDefault(event)
  applyMove()
}

function onMouseUp() {
  removeMouseListeners()
  onTouchEnd()
}

function removeMouseListeners() {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}

function onMouseDown(event: MouseEvent) {
  if (event.button !== 0 || dragging.value)
    return
  onTouchStart(toTouchEvent(event))
  if (dragging.value) {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
}

onBeforeUnmount(() => {
  clearTimeout(resetTimer)
  removeMouseListeners()
})

const positionStyle = computed(() => {
  if (!position.value || group)
    return undefined
  return {
    inset: '0 auto auto 0',
    transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
  }
})

function onClick(event: MouseEvent) {
  if (justDragged) {
    justDragged = false
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}

defineExpose({
  nativeElement: rootRef,
})
</script>

<template>
  <component
    :is="href !== undefined ? 'a' : 'button'"
    ref="rootRef"
    v-bind="$attrs"
    class="am-float-button"
    :class="[
      `am-float-button-${type}`,
      `am-float-button-${mergedShape}`,
      {
        'am-float-button-in-group': !!group,
        'am-float-button-with-content': hasContent,
        'am-float-button-draggable': canDrag,
        'am-float-button-dragging': dragging,
      },
      rootClass,
      classes?.root,
    ]"
    :style="[positionStyle, styles?.root]"
    :type="href !== undefined ? undefined : htmlType"
    :href="href"
    :target="href !== undefined ? target : undefined"
    :aria-label="ariaLabel"
    @click="onClick"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <BaseBadge
      v-if="badge"
      :count="badge.count"
      :dot="badge.dot"
      :overflow-count="badge.overflowCount"
      :show-zero="badge.showZero"
      :color="badge.color"
      class="am-float-button-badge"
      :class="[classes?.badge, { 'am-float-button-badge-dot': badge.dot }]"
      :style="styles?.badge"
    />
    <span class="am-float-button-body">
      <span v-if="hasIcon || !hasContent" class="am-float-button-icon" :class="classes?.icon" :style="styles?.icon">
        <slot name="icon">
          <RenderNode v-if="isRenderable(icon)" :node="icon" />
          <FileTextOutlined v-else />
        </slot>
      </span>
      <span v-if="hasContent" class="am-float-button-content" :class="classes?.content" :style="styles?.content">
        <slot>
          <RenderNode :node="mergedContent" />
        </slot>
      </span>
    </span>
  </component>
</template>
