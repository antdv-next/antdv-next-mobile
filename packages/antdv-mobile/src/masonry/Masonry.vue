<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { Key } from '../_util/type'
import type { MasonryEmits, MasonryItemRenderInfo, MasonryItemType, MasonryLayoutInfo, MasonryProps, MasonrySlots } from './interface'
import type { MasonryPosition } from './layout'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { addUnit, cancelRaf, isDef, isNumeric, isRenderable, raf } from '../_util'
import { useEventListener } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { mergeAttrsStyle } from '../_util/vnode'
import { computeMasonryLayout, normalizeColumns } from './layout'
import '../style'
import './style/index.css'

interface MasonryEntry {
  item: MasonryItemType
  index: number
  key: Key
}

interface MasonryRenderEntry extends MasonryEntry {
  position: MasonryPosition | undefined
  info: MasonryItemRenderInfo
  class: unknown[]
  style: CSSProperties
}

defineOptions({ name: 'AmMasonry', inheritAttrs: false })

const props = withDefaults(defineProps<MasonryProps>(), {
  columns: 2,
  fresh: false,
})
const emit = defineEmits<MasonryEmits>()
defineSlots<MasonrySlots>()

const rootRef = ref<HTMLDivElement>()

const entries = computed<MasonryEntry[]>(() =>
  (props.items ?? []).map((item, index) => ({ item, index, key: item.key ?? index })),
)

const columnCount = computed(() => normalizeColumns(props.columns))

// ---------------------------------------------------------------- gutter
const gutters = computed(() => {
  const [x, y] = Array.isArray(props.gutter) ? props.gutter : [props.gutter, undefined]
  const hasValue = (value: unknown) => isDef(value) && value !== ''
  const horizontal = hasValue(x) ? x : undefined
  // same as PC: an empty / zero vertical gutter falls back to the horizontal one
  const vertical = hasValue(y) && Number(y) !== 0 ? y : undefined
  return [horizontal, vertical] as const
})

/** Vertical gutter in px when it can be told without the DOM (numbers), `undefined` for CSS lengths / the token. */
const staticGutterY = computed(() => {
  const value = gutters.value[1] ?? gutters.value[0]
  return isNumeric(value) ? Number(value) : undefined
})
/** Vertical gutter in px read back from the DOM (CSS lengths, the default token). */
const computedGutterY = ref(0)
const gutterY = computed(() => staticGutterY.value ?? computedGutterY.value)

// ---------------------------------------------------------------- layout
const measuredHeights = shallowRef(new Map<Key, number>())
/** Items that kept a position for at least one frame: only those animate when they move. */
const settledKeys = shallowRef(new Set<Key>())

const layout = computed(() => computeMasonryLayout(
  entries.value.map(({ item, key }) => ({
    key,
    height: measuredHeights.value.get(key) ?? item.height,
    column: item.column,
  })),
  columnCount.value,
  gutterY.value,
))

const classNames = computed(() => ['am-masonry', props.rootClass, props.classes?.root])

const mergedStyle = computed<CSSProperties>(() => {
  const [x, y] = gutters.value
  const style: Record<string, any> = {
    '--am-masonry-columns': columnCount.value,
    'height': `${layout.value.height}px`,
  }
  if (x !== undefined)
    style['--am-masonry-gutter-x'] = addUnit(x)
  if (y !== undefined)
    style['--am-masonry-gutter-y'] = addUnit(y)
  return { ...style, ...props.styles?.root }
})

const renderEntries = computed<MasonryRenderEntry[]>(() => entries.value.map((entry) => {
  const { item, index, key } = entry
  const position = layout.value.positions.get(key)
  const column = position?.column ?? 0
  const style: Record<string, any> = { ...props.styles?.item, ...item.style }
  if (position) {
    style['--am-masonry-item-column'] = column
    style['--am-masonry-item-top'] = `${position.top}px`
  }
  return {
    ...entry,
    position,
    info: { ...item, key, index, column },
    class: [
      'am-masonry-item',
      {
        'am-masonry-item-pending': !position,
        'am-masonry-item-motion': !!position && settledKeys.value.has(key),
      },
      props.classes?.item,
      item.class,
    ],
    style,
  }
}))

// ---------------------------------------------------------------- measuring
let measureId = 0
let settleId = 0
let observer: ResizeObserver | undefined
const observedItems = new Set<Element>()

function getItemElements(): HTMLElement[] {
  const root = rootRef.value
  // DOM order is data order, so the n-th item element belongs to the n-th entry
  return root ? Array.from(root.children).filter(el => el.classList.contains('am-masonry-item')) as HTMLElement[] : []
}

function getHeight(el: HTMLElement) {
  const { height } = el.getBoundingClientRect()
  const { offsetHeight } = el
  // the rect is sub-pixel exact but scaled by ancestor transforms (popup zoom motion): then trust the layout height
  return Math.abs(height - offsetHeight) > 1 ? offsetHeight : height
}

function sameHeights(a: Map<Key, number>, b: Map<Key, number>) {
  if (a.size !== b.size)
    return false
  for (const [key, value] of b) {
    if (a.get(key) !== value)
      return false
  }
  return true
}

function settle() {
  settleId = 0
  const next = new Set<Key>(layout.value.positions.keys())
  const prev = settledKeys.value
  if (next.size !== prev.size || [...next].some(key => !prev.has(key)))
    settledKeys.value = next
}

function measure() {
  measureId = 0
  const root = rootRef.value
  if (!root)
    return
  const elements = getItemElements()
  const next = new Map<Key, number>()
  entries.value.forEach(({ key }, index) => {
    const el = elements[index]
    if (el)
      next.set(key, getHeight(el))
  })
  if (!sameHeights(measuredHeights.value, next))
    measuredHeights.value = next
  if (staticGutterY.value === undefined)
    computedGutterY.value = Number.parseFloat(window.getComputedStyle(root).rowGap) || 0
  // one frame later, so freshly placed items do not fly in from the top-left corner
  cancelRaf(settleId)
  settleId = raf(settle)
}

/** Batches every re-layout request of a frame into one measuring pass. */
function scheduleMeasure() {
  if (measureId || !rootRef.value)
    return
  measureId = raf(measure)
}

function syncObserver() {
  if (!observer || !rootRef.value)
    return
  const targets = new Set<Element>([rootRef.value, ...(props.fresh ? getItemElements() : [])])
  observedItems.forEach((el) => {
    if (!targets.has(el)) {
      observer!.unobserve(el)
      observedItems.delete(el)
    }
  })
  targets.forEach((el) => {
    if (!observedItems.has(el)) {
      observer!.observe(el)
      observedItems.add(el)
    }
  })
}

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined')
    observer = new ResizeObserver(scheduleMeasure)
  syncObserver()
  scheduleMeasure()
})

onBeforeUnmount(() => {
  cancelRaf(measureId)
  cancelRaf(settleId)
  observer?.disconnect()
  observer = undefined
  observedItems.clear()
})

watch(
  [entries, columnCount, gutters, () => props.fresh],
  () => {
    syncObserver()
    scheduleMeasure()
  },
  { flush: 'post' },
)

// images and other media change the height of an item once they are loaded (`load` / `error` do not bubble)
useEventListener('load', scheduleMeasure, { target: rootRef, capture: true })
useEventListener('error', scheduleMeasure, { target: rootRef, capture: true })

// ---------------------------------------------------------------- layoutChange
let lastColumns = ''

watch(
  layout,
  ({ positions, complete }) => {
    if (!entries.value.length || !complete)
      return
    const sortInfo: MasonryLayoutInfo[] = entries.value.map(({ item, key }) => ({ ...item, key, column: positions.get(key)!.column }))
    const signature = sortInfo.map(({ key, column }) => `${typeof key}:${key}:${column}`).join('|')
    if (signature !== lastColumns) {
      lastColumns = signature
      emit('layoutChange', sortInfo)
    }
  },
  { immediate: true, flush: 'post' },
)

defineExpose({
  get nativeElement() {
    return rootRef.value
  },
  layout: scheduleMeasure,
})
</script>

<template>
  <div ref="rootRef" v-bind="$attrs" :class="classNames" :style="mergeAttrsStyle(mergedStyle, $attrs.style)">
    <div v-for="entry in renderEntries" :key="entry.key" :class="entry.class" :style="entry.style">
      <RenderNode v-if="isRenderable(entry.item.children)" :node="entry.item.children" />
      <slot v-else name="itemRender" v-bind="entry.info">
        <RenderNode :node="itemRender" :params="entry.info" />
      </slot>
    </div>
  </div>
</template>
