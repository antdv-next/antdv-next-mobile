<script setup lang="ts">
import type { Key } from '../_util/type'
import type { IndexBarAnchorRecord } from './context'
import type { IndexBarEmits, IndexBarExpose, IndexBarProps, IndexBarSlots } from './interface'
import { computed, nextTick, onMounted, provide, ref, shallowRef, watch } from 'vue'
import { clamp, getScrollParent, getScrollTop, preventDefault, setScrollTop } from '../_util'
import { useEventListener, useTouch } from '../_util/hooks'
import { indexBarContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmIndexBar', inheritAttrs: false })

const props = withDefaults(defineProps<IndexBarProps>(), {
  sticky: true,
  stickyOffsetTop: 0,
})
const emit = defineEmits<IndexBarEmits>()
defineSlots<IndexBarSlots>()

const rootRef = ref<HTMLElement>()
const sidebarRef = ref<HTMLElement>()
const anchors = shallowRef<IndexBarAnchorRecord[]>([])
const activeIndex = ref<Key>()
const viewportHeight = ref<number>()

/** nearest scroll container (an element or the window), resolved on mount */
const scroller = shallowRef<HTMLElement | Window>()

function sortAnchors(list: IndexBarAnchorRecord[]) {
  return list.slice().sort((a, b) => {
    const elA = a.el()
    const elB = b.el()
    if (!elA || !elB)
      return 0
    return elA.compareDocumentPosition(elB) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  })
}

provide(indexBarContextKey, {
  register: (anchor) => {
    anchors.value = sortAnchors([...anchors.value, anchor])
    nextTick(updateActive)
  },
  unregister: (anchor) => {
    anchors.value = anchors.value.filter(item => item !== anchor)
  },
  activeIndex,
  sticky: computed(() => props.sticky),
})

const indexList = computed<Key[]>(() => props.indexList ?? anchors.value.map(anchor => anchor.index()))

// ---------- scroll tracking ----------
/** top of the scroll viewport: `0` for the window */
function getScrollerTop() {
  const el = scroller.value
  return el instanceof Element ? el.getBoundingClientRect().top : 0
}

function updateActive() {
  if (!scroller.value)
    return
  const top = getScrollerTop() + props.stickyOffsetTop
  let active: Key | undefined
  for (const anchor of anchors.value) {
    const el = anchor.el()
    if (!el)
      continue
    // 1px tolerance for fractional scroll positions
    if (el.getBoundingClientRect().top <= top + 1)
      active = anchor.index()
    else
      break
  }
  if (active !== activeIndex.value) {
    activeIndex.value = active
    if (active !== undefined)
      emit('change', active)
  }
}

function updateViewport() {
  const el = scroller.value
  if (!el)
    return
  const height = el instanceof Element ? el.clientHeight : el.innerHeight
  viewportHeight.value = height ? Math.max(height - props.stickyOffsetTop, 0) : undefined
}

function handleResize() {
  updateViewport()
  updateActive()
}

useEventListener('scroll', updateActive, { target: scroller, passive: true })
useEventListener('resize', handleResize)

onMounted(() => {
  scroller.value = getScrollParent(rootRef.value)
  handleResize()
})

watch(() => props.stickyOffsetTop, handleResize)

function scrollTo(index: Key) {
  const el = anchors.value.find(anchor => String(anchor.index()) === String(index))?.el()
  if (!el || !scroller.value)
    return
  const offset = el.getBoundingClientRect().top - getScrollerTop() - props.stickyOffsetTop
  setScrollTop(scroller.value, Math.max(getScrollTop(scroller.value) + offset, 0))
  updateActive()
}

// ---------- side bar: tap & drag ----------
const touch = useTouch()
const touching = ref(false)
const touchingIndex = ref<Key>()
let touchEndTime = 0

function select(index: Key | undefined) {
  if (index === undefined || index === touchingIndex.value)
    return
  touchingIndex.value = index
  scrollTo(index)
  emit('select', index)
}

function getIndexByPoint(clientY: number) {
  const list = indexList.value
  const rect = sidebarRef.value?.getBoundingClientRect()
  if (!rect || !rect.height || !list.length)
    return undefined
  return list[clamp(Math.floor((clientY - rect.top) / (rect.height / list.length)), 0, list.length - 1)]
}

function getIndexByTarget(target: EventTarget | null) {
  const el = (target as HTMLElement | null)?.closest?.<HTMLElement>('.am-index-bar-index')
  const position = el ? Number(el.dataset.position) : Number.NaN
  return Number.isNaN(position) ? undefined : indexList.value[position]
}

function handleTouchStart(event: TouchEvent) {
  touch.start(event)
  touching.value = true
  touchingIndex.value = undefined
  select(getIndexByPoint(touch.startY.value) ?? getIndexByTarget(event.target))
}

function handleTouchMove(event: TouchEvent) {
  if (!touching.value)
    return
  touch.move(event)
  preventDefault(event)
  select(getIndexByPoint(touch.startY.value + touch.deltaY.value))
}

function handleTouchEnd() {
  touching.value = false
  touchEndTime = Date.now()
}

function handleClick(event: MouseEvent) {
  // the click that follows a touch has already been handled
  if (Date.now() - touchEndTime < 500)
    return
  touchingIndex.value = undefined
  select(getIndexByTarget(event.target))
}

const rootStyle = computed(() => [
  {
    '--am-index-bar-sticky-offset-top': `${props.stickyOffsetTop}px`,
    '--am-index-bar-viewport-height': viewportHeight.value !== undefined ? `${viewportHeight.value}px` : undefined,
    '--am-index-bar-z-index': props.zIndex,
  },
  props.styles?.root,
])

defineExpose<IndexBarExpose>({ scrollTo })
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" class="am-index-bar" :class="[rootClass, classes?.root]" :style="rootStyle">
    <div class="am-index-bar-float">
      <div
        v-if="indexList.length"
        ref="sidebarRef"
        class="am-index-bar-sidebar"
        :class="classes?.sidebar"
        :style="styles?.sidebar"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
        @click="handleClick"
      >
        <span
          v-for="(index, position) in indexList"
          :key="index"
          class="am-index-bar-index"
          :class="[{ 'am-index-bar-index-active': index === activeIndex }, classes?.index]"
          :style="styles?.index"
          :data-position="position"
        >
          {{ index }}
        </span>
      </div>
      <Transition name="am-fade">
        <div v-if="touching && touchingIndex !== undefined" class="am-index-bar-hint" :class="classes?.hint" :style="styles?.hint">
          {{ touchingIndex }}
        </div>
      </Transition>
    </div>
    <slot />
  </div>
</template>
