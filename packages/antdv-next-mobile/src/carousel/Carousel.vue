<script setup lang="ts">
import type { VNode } from 'vue'
import type { CarouselDotPlacement, CarouselEmits, CarouselProps, CarouselSlots } from './interface'
import { Comment, computed, createTextVNode, Fragment, onActivated, onBeforeUnmount, onDeactivated, onMounted, onUpdated, reactive, ref, Text, watch } from 'vue'
import { clamp, doubleRaf, inBrowser, preventDefault } from '../_util'
import { useEventListener, useTouch } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useConfig } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCarousel', inheritAttrs: false })

const props = withDefaults(defineProps<CarouselProps>(), {
  autoplay: false,
  autoplaySpeed: 3000,
  dots: true,
  infinite: true,
  speed: 300,
  initialSlide: 0,
  vertical: undefined,
  draggable: true,
  allowTouchMove: true,
  effect: 'scrollx',
  slideSize: 100,
  trackOffset: 0,
  stuckAtBoundary: true,
  indicator: undefined,
  stopPropagation: false,
})
const emit = defineEmits<CarouselEmits>()
const slots = defineSlots<CarouselSlots>()

const config = useConfig()
const touch = useTouch()

const rootRef = ref<HTMLElement>()
const count = ref(0)
/** number of slides produced by the last render (synced into `count` after each patch) */
let renderedCount = 0

const state = reactive({
  /** size of the carousel along the sliding axis in px (only used to convert finger distance) */
  rootSize: 0,
  /** index of the active slide, `-1` and `count` are the transient positions of the infinite loop */
  active: props.initialSlide,
  /** track offset in percent of the carousel size */
  offset: 0,
  /** offsets (in percent of a slide) that move the first / last slide to the other end of the track */
  firstOffset: 0,
  lastOffset: 0,
  /** transitions are disabled while following the finger or correcting the position */
  swiping: false,
})

const placement = computed<CarouselDotPlacement>(() => {
  const value = props.dotPlacement ?? props.dotPosition ?? 'bottom'
  if (value === 'left')
    return 'start'
  if (value === 'right')
    return 'end'
  return value
})
const isVertical = computed(() => props.vertical ?? (placement.value === 'start' || placement.value === 'end'))
const isFade = computed(() => props.effect === 'fade')
const isRtl = computed(() => config.direction.value === 'rtl' && !isVertical.value)
const loop = computed(() => props.infinite && count.value > 1)
const touchable = computed(() => props.draggable && props.allowTouchMove && count.value > 1)
/** offset of the track when the last slide touches the end of the carousel */
const minOffset = computed(() => 100 - count.value * props.slideSize)
const maxIndex = computed(() => {
  if (loop.value || isFade.value || !props.stuckAtBoundary || props.slideSize >= 100)
    return Math.max(count.value - 1, 0)
  return clamp(Math.ceil(Math.abs(Math.min(minOffset.value, 0)) / props.slideSize), 0, Math.max(count.value - 1, 0))
})
const current = computed(() => {
  if (!count.value)
    return 0
  return clamp((state.active + count.value) % count.value, 0, count.value - 1)
})
const showDotProgress = computed(() => typeof props.autoplay === 'object' && !!props.autoplay?.dotDuration)

// ---------- slides ----------
function flatten(children: any, out: VNode[] = []): VNode[] {
  if (Array.isArray(children)) {
    children.forEach(child => flatten(child, out))
  }
  else if (typeof children === 'string' || typeof children === 'number') {
    if (String(children).trim())
      out.push(createTextVNode(String(children)))
  }
  else if (children && typeof children === 'object') {
    const vnode = children as VNode
    if (vnode.type === Fragment)
      flatten(vnode.children, out)
    else if (vnode.type === Text ? String(vnode.children).trim() : vnode.type !== Comment)
      out.push(vnode)
  }
  return out
}

function renderSlides() {
  const nodes = flatten(slots.default?.())
  renderedCount = nodes.length
  return nodes
}

// ---------- position ----------
function getTargetActive(pace: number) {
  if (!pace)
    return state.active
  if (isFade.value)
    return loop.value ? (current.value + pace % count.value + count.value) % count.value : clamp(current.value + pace, 0, maxIndex.value)
  if (loop.value)
    return clamp(state.active + pace, -1, count.value)
  return clamp(state.active + pace, 0, maxIndex.value)
}

function getTargetOffset(active: number, drag = 0) {
  let offset = props.trackOffset - active * props.slideSize + drag
  if (!loop.value) {
    const lower = props.stuckAtBoundary ? Math.min(minOffset.value, 0) : props.trackOffset - (count.value - 1) * props.slideSize
    const upper = props.stuckAtBoundary ? 0 : props.trackOffset
    offset = clamp(offset, lower, upper)
  }
  return offset
}

function move(pace = 0, drag = 0) {
  const active = getTargetActive(pace)
  state.active = active
  if (isFade.value || count.value <= 1) {
    state.offset = 0
    state.firstOffset = 0
    state.lastOffset = 0
    return
  }
  const offset = getTargetOffset(active, drag)
  if (loop.value) {
    // fill the gap at either end with the slide of the other end
    state.firstOffset = offset < minOffset.value ? count.value * 100 : 0
    state.lastOffset = offset > 0 ? -count.value * 100 : 0
  }
  else {
    state.firstOffset = 0
    state.lastOffset = 0
  }
  state.offset = offset
}

/** Brings a transient loop position (`-1` / `count`) back into range without animation. */
function correctPosition() {
  if (isFade.value || !loop.value)
    return false
  if (state.active <= -1 || state.active >= count.value) {
    state.swiping = true
    move(state.active <= -1 ? count.value : -count.value)
    return true
  }
  return false
}

let afterChangeTimer: ReturnType<typeof setTimeout> | undefined

function run(pace: number, animate: boolean) {
  const prev = current.value
  const target = getTargetActive(pace)
  const next = count.value ? (target + count.value) % count.value : 0
  const changed = next !== prev
  if (changed)
    emit('beforeChange', prev, next)
  state.swiping = !animate
  move(pace)
  if (!changed)
    return
  clearTimeout(afterChangeTimer)
  if (animate && props.speed > 0)
    afterChangeTimer = setTimeout(() => emit('afterChange', current.value), props.speed)
  else
    emit('afterChange', next)
}

function change(pace: number, animate = true) {
  if (count.value <= 1)
    return
  if (correctPosition() && animate) {
    // let the corrected position be painted before animating from it
    doubleRaf(() => run(pace, true))
  }
  else {
    run(pace, animate)
  }
}

function goTo(slide: number, dontAnimate = false) {
  if (count.value <= 1)
    return
  const corrected = correctPosition()
  const index = clamp(Math.round(slide), 0, count.value - 1)
  const pace = index - current.value
  const start = () => run(pace, !dontAnimate)
  if (corrected && !dontAnimate && pace)
    doubleRaf(start)
  else
    start()
  startAutoplay()
}

function next() {
  if (loop.value || current.value < maxIndex.value)
    change(1)
  startAutoplay()
}

function prev() {
  if (loop.value || current.value > 0)
    change(-1)
  startAutoplay()
}

// ---------- autoplay ----------
let autoplayTimer: ReturnType<typeof setTimeout> | undefined
let touching = false

function stopAutoplay() {
  clearTimeout(autoplayTimer)
  autoplayTimer = undefined
}

function startAutoplay() {
  stopAutoplay()
  if (!inBrowser || !props.autoplay || count.value <= 1 || touching || document.hidden)
    return
  autoplayTimer = setTimeout(() => {
    if (!loop.value && current.value >= maxIndex.value)
      change(-current.value)
    else
      change(1)
    startAutoplay()
  }, Math.max(props.autoplaySpeed, 0))
}

// ---------- measure ----------
function resize() {
  const root = rootRef.value
  if (!root)
    return
  state.rootSize = isVertical.value ? root.offsetHeight : root.offsetWidth
}

function reset(active = current.value) {
  count.value = renderedCount
  state.active = clamp(active, 0, Math.max(isFade.value ? count.value - 1 : maxIndex.value, 0))
  state.swiping = true
  resize()
  move()
  startAutoplay()
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  reset(props.initialSlide)
  if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(rootRef.value)
  }
})
onUpdated(() => {
  if (renderedCount !== count.value)
    reset()
})
onActivated(() => {
  resize()
  startAutoplay()
})
onDeactivated(stopAutoplay)
onBeforeUnmount(() => {
  stopAutoplay()
  clearTimeout(afterChangeTimer)
  resizeObserver?.disconnect()
})

useEventListener('resize', resize)
useEventListener('orientationchange', resize)
useEventListener('visibilitychange', () => (document.hidden ? stopAutoplay() : startAutoplay()), {
  target: inBrowser ? document : undefined,
})

watch(() => [props.autoplay, props.autoplaySpeed], startAutoplay, { deep: true })
watch(
  () => [props.slideSize, props.trackOffset, props.infinite, props.stuckAtBoundary, props.effect, isVertical.value],
  () => reset(),
)

// ---------- touch ----------
let touchStartTime = 0
let dragging = false

const delta = computed(() => (isVertical.value ? touch.deltaY.value : touch.deltaX.value * (isRtl.value ? -1 : 1)))
const isCorrectDirection = () => (isVertical.value ? touch.isVertical() : touch.isHorizontal())

function onTouchStart(event: TouchEvent) {
  if (!touchable.value)
    return
  touch.start(event)
  touchStartTime = Date.now()
  touching = true
  dragging = true
  stopAutoplay()
  resize()
  if (!isFade.value) {
    correctPosition()
    state.swiping = true
  }
}

function onTouchMove(event: TouchEvent) {
  if (!touchable.value || !dragging)
    return
  touch.move(event)
  if (!isCorrectDirection())
    return
  const atEdge = !loop.value && ((current.value === 0 && delta.value > 0) || (current.value >= maxIndex.value && delta.value < 0))
  if (!atEdge)
    preventDefault(event, props.stopPropagation)
  if (!isFade.value && state.rootSize) {
    const max = loop.value ? props.slideSize : Number.POSITIVE_INFINITY
    move(0, clamp(delta.value / state.rootSize * 100, -max, max))
  }
}

function onTouchEnd() {
  if (!dragging)
    return
  dragging = false
  touching = false
  const distance = delta.value
  const size = state.rootSize * props.slideSize / 100
  const duration = Math.max(Date.now() - touchStartTime, 1)
  const velocity = distance / duration
  const shouldSwipe = Math.abs(velocity) > 0.25 || (size > 0 && Math.abs(distance) > size / 2)
  if (shouldSwipe && isCorrectDirection() && distance) {
    let pace = distance > 0 ? -1 : 1
    if (!loop.value && !isFade.value && size > 0)
      pace = -Math[distance > 0 ? 'ceil' : 'floor'](distance / size)
    run(pace, true)
  }
  else {
    state.swiping = false
    move()
  }
  startAutoplay()
}

// ---------- render helpers ----------
const sign = computed(() => (isRtl.value ? -1 : 1))
const translate = (value: number) => (isVertical.value ? `translate3d(0, ${value}%, 0)` : `translate3d(${value * sign.value}%, 0, 0)`)
const duration = computed(() => `${state.swiping ? 0 : props.speed}ms`)

const trackStyle = computed(() => [
  isFade.value ? undefined : { transform: translate(state.offset), transitionDuration: duration.value },
  props.styles?.track,
])

function slideStyle(index: number) {
  const size = `${props.slideSize}%`
  if (isFade.value) {
    return [
      { opacity: index === current.value ? 1 : 0, transitionDuration: duration.value, zIndex: index === current.value ? 1 : 0 },
      props.styles?.slide,
    ]
  }
  let offset = 0
  if (index === 0)
    offset = state.firstOffset
  else if (index === count.value - 1)
    offset = state.lastOffset
  return [
    isVertical.value ? { height: size } : { width: size },
    offset ? { transform: translate(offset) } : undefined,
    props.styles?.slide,
  ]
}

const classNames = computed(() => [
  'am-carousel',
  {
    'am-carousel-vertical': isVertical.value,
    'am-carousel-fade': isFade.value,
    'am-carousel-rtl': isRtl.value,
  },
  props.rootClass,
  props.classes?.root,
])

const indicatorInfo = computed(() => ({ current: current.value, total: count.value }))

defineExpose({ goTo, next, prev, resize })
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <div class="am-carousel-track" :class="classes?.track" :style="trackStyle">
      <div
        v-for="(node, index) in renderSlides()"
        :key="node.key ?? index"
        class="am-carousel-slide"
        :class="[{ 'am-carousel-slide-active': index === current }, classes?.slide]"
        :style="slideStyle(index)"
        :aria-hidden="index !== current || undefined"
      >
        <component :is="node" />
      </div>
    </div>
    <slot name="indicator" v-bind="indicatorInfo">
      <RenderNode v-if="indicator !== undefined" :node="indicator" :params="indicatorInfo" />
      <ul
        v-else-if="dots && count > 1"
        class="am-carousel-dots"
        :class="[
          `am-carousel-dots-${placement}`,
          typeof dots === 'object' ? dots.class : undefined,
          classes?.dots,
        ]"
        :style="styles?.dots"
      >
        <li
          v-for="index in count"
          :key="index"
          class="am-carousel-dot"
          :class="[
            {
              'am-carousel-dot-active': index - 1 === current,
              'am-carousel-dot-progress': showDotProgress && index - 1 === current,
            },
            classes?.dot,
          ]"
          :style="[showDotProgress ? { '--am-carousel-dot-duration': `${autoplaySpeed}ms` } : undefined, styles?.dot]"
          @click="goTo(index - 1)"
        />
      </ul>
    </slot>
  </div>
</template>
