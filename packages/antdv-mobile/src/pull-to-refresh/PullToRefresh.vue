<script setup lang="ts">
import type { PullToRefreshEmits, PullToRefreshProps, PullToRefreshSlots, PullToRefreshStatus } from './interface'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Spinner } from '../_base'
import { addUnit, getScrollParent, getScrollTop, preventDefault } from '../_util'
import { useControlled, useEventListener, useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmPullToRefresh', inheritAttrs: false })

const props = withDefaults(defineProps<PullToRefreshProps>(), {
  refreshing: undefined,
  pullingText: undefined,
  canReleaseText: undefined,
  refreshingText: undefined,
  completeText: undefined,
  completeDelay: 500,
  headHeight: 50,
  duration: 300,
  disabled: undefined,
})
const emit = defineEmits<PullToRefreshEmits>()
defineSlots<PullToRefreshSlots>()

const locale = useLocale('PullToRefresh')
const disabled = useDisabled(() => props.disabled)
const touch = useTouch()

const rootRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()

const [refreshing, setRefreshing] = useControlled(props, 'refreshing', {
  defaultValue: false,
  onChange: (value: boolean) => emit('update:refreshing', value),
})

const status = ref<PullToRefreshStatus>(refreshing.value ? 'refreshing' : 'normal')
const distance = ref(0)
const dragging = ref(false)

function toPx(value: unknown, fallback: number) {
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value))
  return Number.isNaN(num) ? fallback : num
}
const headHeightPx = computed(() => toPx(props.headHeight, 50))
const thresholdPx = computed(() => toPx(props.threshold ?? props.headHeight, headHeightPx.value))

if (refreshing.value)
  distance.value = headHeightPx.value

const isTouchable = () => status.value !== 'refreshing' && status.value !== 'complete' && !disabled.value

/** The further the finger goes, the less the content follows. */
function ease(value: number) {
  const threshold = thresholdPx.value
  if (value > threshold) {
    if (value < threshold * 2)
      value = threshold + (value - threshold) / 2
    else
      value = threshold * 1.5 + (value - threshold * 2) / 4
  }
  return Math.round(value)
}

function setStatus(value: number, isRefreshing?: boolean) {
  distance.value = value
  const prev = status.value
  if (isRefreshing)
    status.value = 'refreshing'
  else if (value === 0)
    status.value = 'normal'
  else if (value < thresholdPx.value)
    status.value = 'pulling'
  else
    status.value = 'canRelease'
  if (status.value !== prev || dragging.value)
    emit('change', { status: status.value, distance: value })
}

let reachTop = false
let completeTimer: ReturnType<typeof setTimeout> | undefined

function checkPosition(event: TouchEvent) {
  reachTop = !(getScrollTop(getScrollParent(rootRef.value)) > 0)
  if (reachTop) {
    dragging.value = true
    touch.start(event)
  }
}

function onTouchStart(event: TouchEvent) {
  if (isTouchable())
    checkPosition(event)
}

function onTouchMove(event: TouchEvent) {
  if (!isTouchable())
    return
  if (!reachTop)
    checkPosition(event)
  if (!reachTop)
    return
  touch.move(event)
  const { deltaY } = touch
  // horizontal gestures (carousels, swipe actions) and upward scrolls are left alone
  if (touch.isVertical() && deltaY.value >= 0) {
    preventDefault(event)
    setStatus(ease(deltaY.value))
  }
}

function onTouchEnd() {
  if (!reachTop || !isTouchable() || !dragging.value) {
    dragging.value = false
    return
  }
  dragging.value = false
  if (touch.deltaY.value && status.value === 'canRelease') {
    setStatus(headHeightPx.value, true)
    setRefreshing(true)
    // make sure `refreshing` is already true when the listener runs
    nextTick(() => emit('refresh'))
  }
  else {
    setStatus(0)
  }
}

watch(refreshing, (value) => {
  clearTimeout(completeTimer)
  if (value) {
    setStatus(headHeightPx.value, true)
    return
  }
  if (status.value !== 'refreshing') {
    setStatus(0)
    return
  }
  if (props.completeDelay > 0 && props.completeText !== false && props.completeText !== null) {
    status.value = 'complete'
    emit('change', { status: 'complete', distance: distance.value })
    completeTimer = setTimeout(() => setStatus(0), props.completeDelay)
  }
  else {
    setStatus(0)
  }
})

onBeforeUnmount(() => clearTimeout(completeTimer))

// `passive: false` is required to prevent the native scroll / overscroll while pulling
useEventListener('touchmove', onTouchMove as EventListener, { target: trackRef, passive: false })

const info = computed(() => ({ distance: distance.value }))

const trackStyle = computed(() => [
  {
    transitionDuration: `${dragging.value ? 0 : props.duration}ms`,
    transform: distance.value ? `translate3d(0, ${distance.value}px, 0)` : '',
  },
])

const classNames = computed(() => [
  'am-pull-to-refresh',
  `am-pull-to-refresh-${status.value === 'canRelease' ? 'can-release' : status.value}`,
  { 'am-pull-to-refresh-disabled': disabled.value },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div
      ref="trackRef"
      class="am-pull-to-refresh-track"
      :style="trackStyle"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <div class="am-pull-to-refresh-head" :class="classes?.head" :style="[{ height: addUnit(headHeight) }, styles?.head]">
        <slot v-if="status === 'pulling'" name="pulling" v-bind="info">
          <RenderNode v-if="pullingText !== undefined" :node="pullingText" :params="info" />
          <template v-else>
            {{ locale.pulling }}
          </template>
        </slot>
        <slot v-else-if="status === 'canRelease'" name="canRelease" v-bind="info">
          <RenderNode v-if="canReleaseText !== undefined" :node="canReleaseText" :params="info" />
          <template v-else>
            {{ locale.canRelease }}
          </template>
        </slot>
        <slot v-else-if="status === 'refreshing'" name="refreshing" v-bind="info">
          <Spinner class="am-pull-to-refresh-icon" />
          <RenderNode v-if="refreshingText !== undefined" :node="refreshingText" :params="info" />
          <template v-else>
            {{ locale.refreshing }}
          </template>
        </slot>
        <slot v-else-if="status === 'complete'" name="complete" v-bind="info">
          <RenderNode v-if="completeText !== undefined" :node="completeText" :params="info" />
          <template v-else>
            {{ locale.complete }}
          </template>
        </slot>
      </div>
      <div class="am-pull-to-refresh-content" :class="classes?.content" :style="styles?.content">
        <slot />
      </div>
    </div>
  </div>
</template>
