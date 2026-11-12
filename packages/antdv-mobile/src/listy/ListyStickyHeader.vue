<script setup lang="ts">
import type { CSSProperties, VNodeChild } from 'vue'
import type { ListyGroupEntry } from './util'
import { computed, ref } from 'vue'
import RenderNode from '../_util/RenderNode'
import { getRenderedRows, getRowElement } from './util'

defineOptions({ name: 'AmListyStickyHeader' })

const props = defineProps<{
  groups: ListyGroupEntry[]
  /** flat row index -> index in `groups` */
  rowGroups: number[]
  renderTitle: (group: ListyGroupEntry) => VNodeChild
  headerClass?: string
  headerStyle?: CSSProperties
  scrollWidth?: number
}>()

/** a header counts as reached once it is within 1px of the top edge (sub-pixel scroll positions) */
const TOP_TOLERANCE = 1

const headerRef = ref<HTMLElement>()
const activeIndex = ref(0)
/** `< 0`: pushed out by the next header; `> 0`: follows the content while it rubber-bands */
const offset = ref(0)

const current = computed(() => props.groups[Math.min(activeIndex.value, props.groups.length - 1)])

/**
 * Finds the group at the top edge of `root` (the scroll container) and how far the next header
 * has pushed the pinned one. Kept in this component so a scroll frame only re-renders the header.
 */
function sync(root: HTMLElement) {
  const rendered = getRenderedRows(root)
  if (!rendered)
    return
  const { elements, first, top } = rendered
  // first rendered row that reaches below the top edge
  let low = 0
  let high = elements.length - 1
  while (low < high) {
    const mid = (low + high) >> 1
    if (elements[mid].getBoundingClientRect().bottom > top + TOP_TOLERANCE)
      high = mid
    else
      low = mid + 1
  }
  // every rendered row is above the viewport (a fling that outran rendering): the next sync fixes it
  if (elements[low].getBoundingClientRect().bottom <= top + TOP_TOLERANCE)
    return

  const active = props.rowGroups[first + low] ?? 0
  activeIndex.value = active

  let next = 0
  const nextGroup = props.groups[active + 1]
  const nextElement = nextGroup && getRowElement(rendered, nextGroup.rowIndex)
  if (nextElement) {
    const height = headerRef.value?.offsetHeight ?? 0
    next = Math.min(0, nextElement.getBoundingClientRect().top - top - height)
  }
  if (root.scrollTop < 0)
    next = -root.scrollTop
  offset.value = next
}

defineExpose({
  sync,
  getHeight: () => headerRef.value?.offsetHeight ?? 0,
})
</script>

<template>
  <div
    v-if="current"
    ref="headerRef"
    class="am-listy-group-header am-listy-group-header-fixed"
    :class="headerClass"
    :style="[
      headerStyle,
      scrollWidth ? { width: `${scrollWidth}px` } : undefined,
      offset ? { transform: `translate3d(0, ${offset}px, 0)` } : undefined,
    ]"
  >
    <RenderNode :node="() => renderTitle(current)" />
  </div>
</template>
