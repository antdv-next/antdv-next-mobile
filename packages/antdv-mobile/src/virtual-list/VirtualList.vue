<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { Key } from '../_util/type'
import type { VirtualListEmits, VirtualListProps, VirtualListScrollToConfig, VirtualListSlots } from './interface'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { addUnit } from '../_util'
import { useVirtualRange } from '../_util/hooks'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmVirtualList', inheritAttrs: false })

const props = withDefaults(defineProps<VirtualListProps>(), {
  data: () => [],
  itemHeight: 44,
  virtual: true,
  fixed: false,
  overscan: 4,
  component: 'div',
})
const emit = defineEmits<VirtualListEmits>()
defineSlots<VirtualListSlots>()

/** viewport used before the container is measured (SSR, jsdom, display: none) */
const FALLBACK_VIEWPORT_ITEMS = 12
const REACH_END_THRESHOLD = 40

const rootRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()
const scrollTop = ref(0)
const viewportHeight = ref(0)
const headerHeight = ref(0)

// ---------- keys & measured heights ----------
function getKey(item: any, index: number): Key {
  const { itemKey } = props
  if (typeof itemKey === 'function')
    return itemKey(item, index)
  if (typeof itemKey === 'string' && item !== null && typeof item === 'object' && item[itemKey] !== undefined)
    return item[itemKey]
  return index
}

const keys = computed(() => props.data.map(getKey))
const measured = new Map<Key, number>()
/** bumped whenever a measured height changes, so the offsets recompute */
const measureVersion = ref(0)

const range = useVirtualRange({
  count: () => props.data.length,
  size: () => {
    if (props.fixed)
      return props.itemHeight
    // eslint-disable-next-line ts/no-unused-expressions
    measureVersion.value
    const list = keys.value
    const estimate = props.itemHeight
    return (index: number) => measured.get(list[index]) ?? estimate
  },
  scrollOffset: () => scrollTop.value - headerHeight.value,
  viewportSize: () => {
    if (viewportHeight.value > 0)
      return viewportHeight.value
    return typeof props.height === 'number' ? props.height : props.itemHeight * FALLBACK_VIEWPORT_ITEMS
  },
  overscan: () => props.overscan,
  enabled: () => props.virtual,
})

const visibleItems = computed(() => {
  const start = range.start.value
  return props.data.slice(start, range.end.value).map((item, i) => ({
    item,
    index: start + i,
    key: keys.value[start + i],
  }))
})

watch(
  () => [range.start.value, range.end.value] as const,
  ([start, end]) => emit('visibleChange', start, end),
)

// drop heights of items that left the data source
watch(keys, (list) => {
  if (!measured.size)
    return
  const alive = new Set(list)
  measured.forEach((_, key) => {
    if (!alive.has(key))
      measured.delete(key)
  })
})

// ---------- measuring ----------
let resizeObserver: ResizeObserver | undefined
const elementKeys = new WeakMap<Element, Key>()
const itemElements = shallowRef(new Map<Key, HTMLElement>())

function setHeight(key: Key, height: number) {
  if (height > 0 && measured.get(key) !== height) {
    measured.set(key, height)
    measureVersion.value++
  }
}

function setItemRef(el: Element | ComponentPublicInstance | null, key: Key) {
  const map = itemElements.value
  const prev = map.get(key)
  const node = el as HTMLElement | null
  if (prev && prev !== node) {
    resizeObserver?.unobserve(prev)
    map.delete(key)
  }
  if (node && prev !== node) {
    map.set(key, node)
    elementKeys.set(node, key)
    if (!props.fixed) {
      resizeObserver?.observe(node)
      setHeight(key, node.offsetHeight)
    }
  }
}

function measureViewport() {
  const el = rootRef.value
  if (!el)
    return
  viewportHeight.value = el.clientHeight
  headerHeight.value = headerRef.value?.offsetHeight ?? 0
}

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement
        if (target === rootRef.value || target === headerRef.value) {
          measureViewport()
          return
        }
        const key = elementKeys.get(target)
        if (key !== undefined)
          setHeight(key, target.offsetHeight)
      })
    })
    if (rootRef.value)
      resizeObserver.observe(rootRef.value)
    if (headerRef.value)
      resizeObserver.observe(headerRef.value)
    if (!props.fixed)
      itemElements.value.forEach(el => resizeObserver!.observe(el))
  }
  measureViewport()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = undefined
})

// ---------- scrolling ----------
let reachedEnd = false

function onScroll(event: Event) {
  const el = rootRef.value
  if (!el)
    return
  scrollTop.value = el.scrollTop
  emit('scroll', event)
  const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - REACH_END_THRESHOLD
  if (atEnd && !reachedEnd)
    emit('reachEnd')
  reachedEnd = atEnd
}

watch(() => props.data.length, () => {
  reachedEnd = false
})

/**
 * In measured mode an index-based scroll is computed from estimates first; while the real
 * heights come in, the target is re-applied so it lands exactly. A newer scrollTo() or a
 * user gesture cancels the pending settle.
 */
const SETTLE_WINDOW = 400
let settle: { apply: () => void, until: number } | undefined

function cancelSettle() {
  settle = undefined
}

watch(measureVersion, () => {
  if (!settle)
    return
  if (Date.now() > settle.until) {
    settle = undefined
    return
  }
  settle.apply()
})

function scrollTo(target: number | VirtualListScrollToConfig) {
  const el = rootRef.value
  cancelSettle()
  if (!el)
    return
  if (typeof target === 'number') {
    el.scrollTop = target
    scrollTop.value = target
    return
  }
  let index = target.index
  if (index === undefined && target.key !== undefined)
    index = keys.value.indexOf(target.key)
  if (index === undefined || index < 0)
    return
  const align = target.align ?? 'start'
  const offset = target.offset ?? 0
  let first = true

  const apply = () => {
    const viewport = el.clientHeight || viewportHeight.value
    const itemTop = headerHeight.value + range.offsetOf(index!)
    const itemSize = range.sizeOf(index!)
    let top = itemTop - offset
    if (align === 'center') {
      top = itemTop - (viewport - itemSize) / 2
    }
    else if (align === 'end') {
      top = itemTop + itemSize - viewport + offset
    }
    else if (align === 'auto') {
      const current = el.scrollTop
      if (itemTop >= current && itemTop + itemSize <= current + viewport)
        return
      top = itemTop < current ? itemTop - offset : itemTop + itemSize - viewport + offset
    }
    top = Math.max(top, 0)
    // only the first jump may animate; corrections must not restart a smooth scroll
    if (first && target.behavior && typeof el.scrollTo === 'function')
      el.scrollTo({ top, behavior: target.behavior })
    else
      el.scrollTop = top
    first = false
    scrollTop.value = top
  }

  apply()
  if (!props.fixed && props.virtual)
    settle = { apply, until: Date.now() + SETTLE_WINDOW }
}

defineExpose({
  scrollTo,
  getScrollTop: () => rootRef.value?.scrollTop ?? 0,
  /** the scroll container */
  nativeElement: rootRef,
})
</script>

<template>
  <div
    ref="rootRef"
    v-bind="$attrs"
    class="am-virtual-list"
    :class="[rootClass, classes?.root]"
    :style="[{ height: addUnit(height) }, styles?.root]"
    @scroll.passive="onScroll"
    @touchstart.passive="cancelSettle"
    @wheel.passive="cancelSettle"
  >
    <div v-if="$slots.header" ref="headerRef" class="am-virtual-list-header">
      <slot name="header" />
    </div>
    <div
      class="am-virtual-list-holder"
      :class="classes?.holder"
      :style="[virtual ? { height: `${range.totalSize.value}px` } : undefined, styles?.holder]"
    >
      <component
        :is="component"
        class="am-virtual-list-inner"
        :class="classes?.list"
        :style="[virtual ? { transform: `translate3d(0, ${range.offsetBefore.value}px, 0)` } : undefined, styles?.list]"
      >
        <div
          v-for="entry in visibleItems"
          :key="entry.key"
          :ref="(el) => setItemRef(el, entry.key)"
          class="am-virtual-list-item"
          :class="[
            { 'am-virtual-list-item-first': entry.index === 0, 'am-virtual-list-item-last': entry.index === data.length - 1 },
            classes?.item,
          ]"
          :style="[fixed ? { height: `${itemHeight}px` } : undefined, styles?.item]"
          :data-index="entry.index"
        >
          <slot :item="entry.item" :index="entry.index" />
        </div>
      </component>
    </div>
    <div v-if="$slots.footer" class="am-virtual-list-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
