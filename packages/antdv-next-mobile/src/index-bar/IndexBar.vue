<script setup lang="ts">
import type { Key } from '../_util/type'
import type { IndexBarAnchorRecord } from './context'
import type { IndexBarEmits, IndexBarExpose, IndexBarProps, IndexBarSlots } from './interface'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from 'vue'
import { clamp, getScrollParent, preventDefault } from '../_util'
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

let scroller: HTMLElement | Window | undefined

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
const isWindow = (el: HTMLElement | Window): el is Window => el === window

function getScrollerTop() {
  return scroller && !isWindow(scroller) ? scroller.getBoundingClientRect().top : 0
}

function updateActive() {
  if (!scroller)
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
  if (!scroller)
    return
  const height = isWindow(scroller) ? scroller.innerHeight : scroller.clientHeight
  viewportHeight.value = height ? Math.max(height - props.stickyOffsetTop, 0) : undefined
}

function handleResize() {
  updateViewport()
  updateActive()
}

onMounted(() => {
  scroller = getScrollParent(rootRef.value)
  scroller.addEventListener('scroll', updateActive, { passive: true })
  window.addEventListener('resize', handleResize)
  handleResize()
})

onBeforeUnmount(() => {
  scroller?.removeEventListener('scroll', updateActive)
  window.removeEventListener('resize', handleResize)
})

watch(() => props.stickyOffsetTop, handleResize)

function scrollTo(index: Key) {
  const el = anchors.value.find(anchor => String(anchor.index()) === String(index))?.el()
  if (!el || !scroller)
    return
  const offset = el.getBoundingClientRect().top - getScrollerTop() - props.stickyOffsetTop
  if (isWindow(scroller))
    scroller.scrollTo(scroller.scrollX, Math.max(scroller.scrollY + offset, 0))
  else
    scroller.scrollTop += offset
  updateActive()
}

// ---------- side bar: tap & drag ----------
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
  touching.value = true
  touchingIndex.value = undefined
  select(getIndexByPoint(event.touches[0].clientY) ?? getIndexByTarget(event.target))
}

function handleTouchMove(event: TouchEvent) {
  if (!touching.value)
    return
  preventDefault(event)
  select(getIndexByPoint(event.touches[0].clientY))
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
