<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { NotificationEmits, NotificationProps, NotificationSlots } from './interface'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@antdv-next/icons'
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { isRenderable, preventDefault } from '../_util'
import { useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmNotification', inheritAttrs: false })

const props = withDefaults(defineProps<NotificationProps>(), {
  title: undefined,
  description: undefined,
  actions: undefined,
  icon: undefined,
  duration: 4.5,
  times: 0,
  showProgress: false,
  pauseOnHover: true,
  closable: true,
  closeIcon: undefined,
  closeDisabled: false,
  placement: 'top',
  role: 'alert',
})
const emit = defineEmits<NotificationEmits>()
defineSlots<NotificationSlots>()
const slots = useSlots()

/** a swipe further than this (px) dismisses the card */
const SWIPE_X = 80
const SWIPE_Y = 32
/** a flick faster than this (px / ms) dismisses it as well */
const VELOCITY = 0.5
const FLICK_DISTANCE = 16

const locale = useLocale('common')

const icons = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
}

const rootRef = ref<HTMLElement>()

const hasIcon = computed(() => !!slots.icon || isRenderable(props.icon) || !!props.type)
const hasTitle = computed(() => !!slots.title || isRenderable(props.title))
const hasDescription = computed(() => !!slots.description || isRenderable(props.description))
const hasActions = computed(() => !!slots.actions || isRenderable(props.actions))
const showClose = computed(() => props.closable && props.closeIcon !== null && props.closeIcon !== false)

// ---------- timer ----------
let timer: ReturnType<typeof setTimeout> | undefined
let startedAt = 0
let remaining = 0
let closed = false
const paused = ref(false)

function close() {
  if (closed)
    return
  closed = true
  clearTimeout(timer)
  timer = undefined
  emit('close')
}

function resume() {
  paused.value = false
  if (closed || props.duration <= 0 || timer)
    return
  startedAt = Date.now()
  timer = setTimeout(close, Math.max(remaining, 0))
}

function pause() {
  if (!timer)
    return
  clearTimeout(timer)
  timer = undefined
  remaining -= Date.now() - startedAt
  paused.value = true
}

function restart() {
  clearTimeout(timer)
  timer = undefined
  remaining = props.duration * 1000
  resume()
}

onMounted(restart)
watch(() => [props.duration, props.times], restart)
onBeforeUnmount(() => clearTimeout(timer))

function hold() {
  if (props.pauseOnHover)
    pause()
}

// ---------- swipe to dismiss ----------
const touch = useTouch()
const dragging = ref(false)
const leaving = ref(false)
const offsetX = ref(0)
const offsetY = ref(0)
let suppressClick = false

function onTouchStart(event: TouchEvent) {
  if (leaving.value)
    return
  suppressClick = false
  touch.start(event)
  dragging.value = true
  hold()
}

function onTouchMove(event: TouchEvent) {
  if (!dragging.value)
    return
  touch.move(event)
  if (touch.isHorizontal()) {
    offsetX.value = touch.deltaX.value
    offsetY.value = 0
  }
  else if (touch.isVertical()) {
    const delta = touch.deltaY.value
    const toEdge = props.placement === 'top' ? delta < 0 : delta > 0
    offsetX.value = 0
    // pulling away from the edge only gives a little
    offsetY.value = toEdge ? delta : delta * 0.2
  }
  if (!touch.isTap.value)
    preventDefault(event)
}

function onTouchEnd() {
  if (!dragging.value)
    return
  dragging.value = false
  suppressClick = !touch.isTap.value
  const velocity = 1 / Math.max(Date.now() - touch.startTime.value, 1)
  const x = offsetX.value
  const y = offsetY.value
  const toEdge = props.placement === 'top' ? y < 0 : y > 0
  const dismissX = Math.abs(x) > SWIPE_X || (Math.abs(x) > FLICK_DISTANCE && Math.abs(x) * velocity > VELOCITY)
  const dismissY = toEdge && (Math.abs(y) > SWIPE_Y || (Math.abs(y) > FLICK_DISTANCE && Math.abs(y) * velocity > VELOCITY))

  if (dismissX || dismissY) {
    leaving.value = true
    const el = rootRef.value
    if (dismissX)
      offsetX.value = Math.sign(x) * ((el?.offsetWidth || 320) + 32)
    else
      offsetY.value = Math.sign(y) * ((el?.offsetHeight || 80) + 32)
    close()
    return
  }
  offsetX.value = 0
  offsetY.value = 0
  resume()
}

function onClick(event: MouseEvent) {
  if (suppressClick) {
    suppressClick = false
    return
  }
  emit('click', event)
}

const dragStyle = computed<CSSProperties | undefined>(() => {
  if (!offsetX.value && !offsetY.value)
    return undefined
  return {
    transform: `translate3d(${offsetX.value}px, ${offsetY.value}px, 0)`,
    opacity: leaving.value ? 0 : undefined,
  }
})

defineExpose({
  nativeElement: rootRef,
})
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    class="am-notification-notice"
    :class="[
      type ? `am-notification-notice-${type}` : undefined,
      {
        'am-notification-notice-closable': showClose,
        'am-notification-notice-dragging': dragging,
        'am-notification-notice-with-description': hasDescription,
      },
      rootClass,
      classes?.root,
    ]"
    :style="[styles?.root, dragStyle]"
    :role="role"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @mouseenter="hold"
    @mouseleave="resume"
    @click="onClick"
  >
    <span v-if="hasIcon" class="am-notification-icon" :class="classes?.icon" :style="styles?.icon">
      <slot name="icon">
        <RenderNode v-if="isRenderable(icon)" :node="icon" />
        <component :is="icons[type]" v-else-if="type" />
      </slot>
    </span>
    <div class="am-notification-section" :class="classes?.section" :style="styles?.section">
      <div v-if="hasTitle" class="am-notification-title" :class="classes?.title" :style="styles?.title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
      <div
        v-if="hasDescription"
        class="am-notification-description"
        :class="classes?.description"
        :style="styles?.description"
      >
        <slot name="description">
          <RenderNode :node="description" />
        </slot>
      </div>
      <div v-if="hasActions" class="am-notification-actions" :class="classes?.actions" :style="styles?.actions">
        <slot name="actions">
          <RenderNode :node="actions" />
        </slot>
      </div>
    </div>
    <button
      v-if="showClose"
      type="button"
      class="am-notification-close"
      :class="classes?.close"
      :style="styles?.close"
      :aria-label="locale.close"
      :disabled="closeDisabled"
      @click.stop="close"
    >
      <slot name="closeIcon">
        <RenderNode v-if="isRenderable(closeIcon) && closeIcon !== true" :node="closeIcon" />
        <CloseOutlined v-else />
      </slot>
    </button>
    <div
      v-if="showProgress && duration > 0"
      class="am-notification-progress"
      :class="classes?.progress"
      :style="styles?.progress"
    >
      <div
        :key="times"
        class="am-notification-progress-bar"
        :style="{ animationDuration: `${duration}s`, animationPlayState: paused ? 'paused' : 'running' }"
      />
    </div>
  </div>
</template>
