<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { LoadingOutlined, PictureOutlined } from '@antdv-next/icons'
import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import { clamp, preventDefault } from '../_util'
import { useTouch } from '../_util/hooks'
import { useLocale } from '../locale'

defineOptions({ name: 'AmImagePreviewItem' })

const props = defineProps<{
  src: string
  alt?: string
  index: number
  active: boolean
  maxZoom: number
  minZoom: number
  doubleTapZoom: boolean | number
  swipeToClose: boolean
  rootWidth: number
  rootHeight: number
  imageClass?: string
  imageStyle?: CSSProperties
}>()

const emit = defineEmits<{
  /** single tap */
  tap: []
  /** dragged down far enough */
  swipeClose: []
  /** 0 - 1 while the image is dragged down */
  dragProgress: [progress: number]
}>()

defineSlots<{ default?: () => any }>()

const TAP_TIME = 250
const CLOSE_DISTANCE = 100

const locale = useLocale('Image')
const touch = useTouch()

const state = reactive({
  scale: 1,
  moveX: 0,
  moveY: 0,
  moving: false,
  zooming: false,
  /** distance the un-zoomed image is dragged down */
  dragY: 0,
  dragging: false,
  /** naturalHeight / naturalWidth */
  imageRatio: 0,
  status: 'loading' as 'loading' | 'loaded' | 'error',
})

const vertical = computed(() => {
  const rootRatio = props.rootHeight / props.rootWidth
  return state.imageRatio > rootRatio
})

const maxMoveX = computed(() => {
  if (!state.imageRatio)
    return 0
  const displayWidth = vertical.value ? props.rootHeight / state.imageRatio : props.rootWidth
  return Math.max(0, (state.scale * displayWidth - props.rootWidth) / 2)
})

const maxMoveY = computed(() => {
  if (!state.imageRatio)
    return 0
  const displayHeight = vertical.value ? props.rootHeight : props.rootWidth * state.imageRatio
  return Math.max(0, (state.scale * displayHeight - props.rootHeight) / 2)
})

const imageStyle = computed<CSSProperties>(() => {
  const { scale, moveX, moveY, dragY, moving, zooming, dragging } = state
  const style: CSSProperties = {
    transitionDuration: zooming || moving || dragging ? '0s' : undefined,
  }
  if (dragY) {
    const shrink = 1 - Math.min(dragY / (props.rootHeight || 600), 1) * 0.4
    style.transform = `translate3d(0, ${dragY}px, 0) scale(${shrink})`
  }
  else if (scale !== 1 || moveX || moveY) {
    style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`
  }
  return style
})

function setScale(scale: number, center?: { x: number, y: number }) {
  const next = clamp(scale, props.minZoom, props.maxZoom + 1)
  if (next === state.scale)
    return
  const ratio = next / state.scale
  state.scale = next
  if (center) {
    // keep the point under the finger(s) in place
    const cx = center.x - props.rootWidth / 2
    const cy = center.y - props.rootHeight / 2
    state.moveX = clamp(cx - (cx - state.moveX) * ratio, -maxMoveX.value, maxMoveX.value)
    state.moveY = clamp(cy - (cy - state.moveY) * ratio, -maxMoveY.value, maxMoveY.value)
  }
  else {
    state.moveX = clamp(state.moveX, -maxMoveX.value, maxMoveX.value)
    state.moveY = clamp(state.moveY, -maxMoveY.value, maxMoveY.value)
  }
}

function resetScale() {
  state.scale = 1
  state.moveX = 0
  state.moveY = 0
}

function toggleScale(center?: { x: number, y: number }) {
  if (state.scale > 1) {
    resetScale()
  }
  else {
    const target = typeof props.doubleTapZoom === 'number' ? props.doubleTapZoom : 2
    setScale(Math.min(target, props.maxZoom), center)
  }
}

const getDistance = (touches: TouchList) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY)
function getCenter(touches: TouchList) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  }
}

let fingerNum = 0
let startMoveX = 0
let startMoveY = 0
let startScale = 1
let startDistance = 0
let touchStartTime = 0
let isImageMoved = false
let doubleTapTimer: ReturnType<typeof setTimeout> | undefined
/** time of the last touch, the click synthesized right after it must be ignored */
let lastTouchTime = 0

function onTouchStart(event: TouchEvent) {
  const { touches } = event
  fingerNum = touches.length
  touch.start(event)
  startMoveX = state.moveX
  startMoveY = state.moveY
  touchStartTime = Date.now()
  isImageMoved = false
  state.moving = fingerNum === 1 && state.scale !== 1
  state.zooming = fingerNum === 2
  state.dragging = false
  if (state.zooming) {
    startScale = state.scale
    startDistance = getDistance(touches)
  }
}

function onTouchMove(event: TouchEvent) {
  const { touches } = event
  touch.move(event)

  if (state.moving) {
    const moveX = touch.deltaX.value + startMoveX
    const moveY = touch.deltaY.value + startMoveY
    // panned to the edge: hand the gesture over to the carousel
    if (touch.isHorizontal() && Math.abs(moveX) > maxMoveX.value && !isImageMoved) {
      state.moving = false
      return
    }
    isImageMoved = true
    preventDefault(event, true)
    state.moveX = clamp(moveX, -maxMoveX.value, maxMoveX.value)
    state.moveY = clamp(moveY, -maxMoveY.value, maxMoveY.value)
    return
  }

  if (state.zooming) {
    preventDefault(event, true)
    if (touches.length === 2 && startDistance)
      setScale((startScale * getDistance(touches)) / startDistance, getCenter(touches))
    return
  }

  if (props.swipeToClose && fingerNum === 1 && state.scale === 1 && touch.isVertical() && (state.dragging || touch.deltaY.value > 0)) {
    preventDefault(event, true)
    state.dragging = true
    state.dragY = Math.max(touch.deltaY.value, 0)
    emit('dragProgress', Math.min(state.dragY / (props.rootHeight || 600) * 2, 1))
  }
}

function checkTap(event: TouchEvent) {
  if (fingerNum > 1 || !touch.isTap.value)
    return
  const deltaTime = Date.now() - touchStartTime
  if (deltaTime >= TAP_TIME)
    return
  if (props.doubleTapZoom) {
    if (doubleTapTimer) {
      clearTimeout(doubleTapTimer)
      doubleTapTimer = undefined
      const point = event.changedTouches?.[0]
      toggleScale(point ? { x: point.clientX, y: point.clientY } : undefined)
    }
    else {
      doubleTapTimer = setTimeout(() => {
        doubleTapTimer = undefined
        emit('tap')
      }, TAP_TIME)
    }
  }
  else {
    emit('tap')
  }
}

function onTouchEnd(event: TouchEvent) {
  let stopPropagation = false

  if (state.dragging) {
    stopPropagation = true
    const velocity = state.dragY / Math.max(Date.now() - touchStartTime, 1)
    const shouldClose = state.dragY > CLOSE_DISTANCE || (state.dragY > 30 && velocity > 0.5)
    state.dragging = false
    if (shouldClose) {
      emit('swipeClose')
    }
    else {
      state.dragY = 0
      emit('dragProgress', 0)
    }
  }

  if (state.moving || state.zooming) {
    stopPropagation = true
    if (state.moving && startMoveX === state.moveX && startMoveY === state.moveY)
      stopPropagation = false

    if (!event.touches.length) {
      state.moving = false
      state.zooming = false
      if (state.scale < 1)
        resetScale()
      if (state.scale > props.maxZoom)
        setScale(props.maxZoom)
      state.moveX = clamp(state.moveX, -maxMoveX.value, maxMoveX.value)
      state.moveY = clamp(state.moveY, -maxMoveY.value, maxMoveY.value)
    }
  }

  // eliminate the synthesized click (and the ghost tap on whatever is below once closed)
  preventDefault(event, stopPropagation)
  checkTap(event)
  touch.reset()
  lastTouchTime = Date.now()
}

function onClick() {
  if (Date.now() - lastTouchTime < 500)
    return
  // mouse users: behave like a single tap
  emit('tap')
}

function onLoad(event: Event) {
  const { naturalWidth, naturalHeight } = event.target as HTMLImageElement
  state.imageRatio = naturalWidth ? naturalHeight / naturalWidth : 0
  state.status = 'loaded'
}

function onError() {
  state.status = 'error'
}

watch(() => props.active, (active) => {
  if (!active)
    resetScale()
})
watch(() => props.src, () => {
  state.status = 'loading'
  resetScale()
})
watch(() => [props.rootWidth, props.rootHeight], resetScale)

onBeforeUnmount(() => clearTimeout(doubleTapTimer))

defineExpose({ resetScale })
</script>

<template>
  <div
    class="am-image-preview-item"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @click="onClick"
  >
    <div class="am-image-preview-image" :class="imageClass" :style="[imageStyle, props.imageStyle]">
      <slot>
        <img
          v-show="state.status !== 'error'"
          class="am-image-preview-img"
          :src="src"
          :alt="alt"
          draggable="false"
          @load="onLoad"
          @error="onError"
        >
      </slot>
    </div>
    <template v-if="!$slots.default">
      <div v-if="state.status === 'loading'" class="am-image-preview-status">
        <LoadingOutlined class="am-spin-icon" />
      </div>
      <div v-else-if="state.status === 'error'" class="am-image-preview-status">
        <PictureOutlined />
        <span class="am-image-preview-status-text">{{ locale.loadFailed }}</span>
      </div>
    </template>
  </div>
</template>
