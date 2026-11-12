<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { VirtualListExpose, VirtualListScrollToConfig } from '../virtual-list/interface'
import type { ListyEmits, ListyProps, ListyScrollAlign, ListyScrollToConfig, ListySlots } from './interface'
import type { ListyGroupEntry, ListyItemRow } from './util'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { addUnit } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useConfig } from '../config-provider/context'
import VirtualList from '../virtual-list/VirtualList.vue'
import ListyStickyHeader from './ListyStickyHeader.vue'
import { flattenRows, getRenderedRows, getRowElement, toTaggedKey } from './util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmListy', inheritAttrs: false })

const props = withDefaults(defineProps<ListyProps>(), {
  items: () => [],
  sticky: false,
  virtual: true,
  rowHoverable: true,
  // font height (22) + `--am-listy-item-padding-block` (12) * 2
  itemHeight: 46,
})
const emit = defineEmits<ListyEmits>()
const slots = defineSlots<ListySlots>()

const config = useConfig()

const listRef = ref<VirtualListExpose>()
const stickyRef = ref<InstanceType<typeof ListyStickyHeader>>()

// ---------- rows ----------
const flat = computed(() => flattenRows(props.items ?? [], props.rowKey, props.group))
const stickyEnabled = computed(() => props.sticky && flat.value.groups.length > 0)

function renderItem(row: ListyItemRow) {
  // called like the PC slot: `(item, index)`, so `#itemRender="item"` receives the item itself
  if (slots.itemRender)
    return (slots.itemRender as (item: any, index: number) => any)(row.item, row.index)
  return props.itemRender?.(row.item, row.index)
}

function renderGroupTitle(group: ListyGroupEntry) {
  if (slots.groupTitle)
    return slots.groupTitle({ groupKey: group.key, items: group.items })
  return props.group?.title ? props.group.title(group.key, group.items) : group.key
}

// ---------- sticky header ----------
function syncSticky() {
  const root = listRef.value?.nativeElement
  if (root)
    stickyRef.value?.sync(root)
}

function onScroll(event: Event) {
  syncSticky()
  emit('scroll', event)
}

/** the rendered window moved: sync again once its rows are in the DOM */
function syncStickyAfterRender() {
  nextTick(syncSticky)
}

onMounted(syncSticky)
watch(flat, syncSticky, { flush: 'post' })

// ---------- scrollTo ----------
function toListAlign(align?: ListyScrollAlign): VirtualListScrollToConfig['align'] {
  return align === 'top' ? 'start' : align === 'bottom' ? 'end' : 'auto'
}

/** height of the header that covers the top of the viewport once `rowIndex` is scrolled to */
function getStickyHeight(root: HTMLElement, rowIndex: number) {
  const group = flat.value.groups[flat.value.rowGroups[rowIndex]]
  const rendered = getRenderedRows(root)
  const header = group && rendered && getRowElement(rendered, group.rowIndex)
  return header?.offsetHeight || stickyRef.value?.getHeight() || 0
}

function scrollToItem(key: string, align: ListyScrollAlign, offset: number) {
  const list = listRef.value!
  const root = list.nativeElement
  const rowIndex = stickyEnabled.value && align !== 'bottom' && root ? flat.value.rows.findIndex(row => row.taggedKey === key) : -1
  if (rowIndex < 0 || !root) {
    list.scrollTo({ key, align: toListAlign(align), offset })
    return
  }
  // a sticky header covers the top of the viewport: keep the item below it
  const headerHeight = getStickyHeight(root, rowIndex)
  if (align === 'top') {
    list.scrollTo({ key, align: 'start', offset: offset + headerHeight })
    return
  }
  // `auto`: resolve the edge here, the header only matters when the item lands at the top
  const rendered = getRenderedRows(root)
  if (!rendered) {
    list.scrollTo({ key, align: 'auto', offset })
    return
  }
  const element = getRowElement(rendered, rowIndex)
  const rect = element?.getBoundingClientRect()
  if (rect ? rect.top < rendered.top + headerHeight : rowIndex < rendered.first)
    list.scrollTo({ key, align: 'start', offset: offset + headerHeight })
  else if (rect ? rect.bottom > rendered.bottom : true)
    list.scrollTo({ key, align: 'end', offset })
}

function scrollTo(target?: ListyScrollToConfig) {
  const list = listRef.value
  if (!list || target === null || target === undefined)
    return
  if (typeof target === 'number') {
    list.scrollTo(target)
  }
  else if ('groupKey' in target) {
    list.scrollTo({ key: toTaggedKey(target.groupKey, 'group'), align: toListAlign(target.align), offset: target.offset ?? 0 })
  }
  else if ('key' in target) {
    scrollToItem(toTaggedKey(target.key, 'item'), target.align ?? 'auto', target.offset ?? 0)
  }
  else {
    if (target.left !== undefined && list.nativeElement)
      list.nativeElement.scrollLeft = target.left
    if (target.top !== undefined)
      list.scrollTo(target.top)
  }
  syncStickyAfterRender()
}

defineExpose({ scrollTo })

// ---------- root ----------
const rootClasses = computed(() => [
  {
    'am-listy-hoverable': props.rowHoverable,
    'am-listy-scroll-x': !!props.scrollWidth,
    'am-listy-rtl': config.direction.value === 'rtl',
  },
  props.rootClass,
  props.classes?.root,
])

const listStyles = computed(() => {
  // `height` is a max height: a short list shrinks to its content
  const root: CSSProperties | undefined = props.height !== undefined && props.height !== ''
    ? { height: 'auto', maxHeight: addUnit(props.height), ...props.styles?.root }
    : props.styles?.root
  return { root, holder: props.scrollWidth ? { width: `${props.scrollWidth}px` } : undefined }
})
</script>

<template>
  <VirtualList
    ref="listRef"
    v-bind="$attrs"
    class="am-listy"
    :class="rootClasses"
    :dir="config.direction.value"
    :data="flat.rows"
    :height="typeof height === 'number' ? height : undefined"
    :item-height="itemHeight"
    item-key="taggedKey"
    :virtual="virtual"
    :styles="listStyles"
    @scroll="onScroll"
    @visible-change="syncStickyAfterRender"
    @reach-end="emit('reachEnd')"
  >
    <!--
      The pinned header lives in VirtualList's header slot, which Listy turns into a zero-height
      sticky layer: it stays inside the scroll container, so touches on it still scroll the list.
      This conditional slot also makes VirtualList re-render whenever Listy does, which keeps the
      rows below in sync with `itemRender` / slot changes.
    -->
    <template v-if="stickyEnabled" #header>
      <ListyStickyHeader
        ref="stickyRef"
        :groups="flat.groups"
        :row-groups="flat.rowGroups"
        :render-title="renderGroupTitle"
        :header-class="classes?.groupHeader"
        :header-style="styles?.groupHeader"
        :scroll-width="scrollWidth"
      />
    </template>
    <template #default="{ item: row }">
      <div
        v-if="row.type === 'group'"
        class="am-listy-group-header"
        :class="classes?.groupHeader"
        :style="styles?.groupHeader"
      >
        <RenderNode :node="() => renderGroupTitle(row.group)" />
      </div>
      <div v-else class="am-listy-item" :class="classes?.item" :style="styles?.item">
        <RenderNode :node="() => renderItem(row)" />
      </div>
    </template>
  </VirtualList>
</template>
