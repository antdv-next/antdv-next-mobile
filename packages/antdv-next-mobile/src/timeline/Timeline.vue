<script setup lang="ts">
import type { CSSProperties, VNode } from 'vue'
import type { Key, VueNode } from '../_util/type'
import type { TimelineItemType, TimelineProps, TimelineRenderParams, TimelineSlots } from './interface'
import { Comment, computed, Fragment, Text } from 'vue'
import { Spinner } from '../_base'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmTimeline', inheritAttrs: false })

const props = withDefaults(defineProps<TimelineProps>(), {
  variant: 'outlined',
})
const slots = defineSlots<TimelineSlots>()

interface InternalItem {
  key: Key
  /** The user's item, handed back to the render props / slots */
  item: TimelineItemType
  /** Index in `items` (before `reverse`) */
  index: number
  title: VueNode
  content: VueNode
  icon: VueNode
  loading: boolean
  pending: boolean
  class: unknown[]
  style: CSSProperties | undefined
}

const PRESET_COLORS = ['blue', 'red', 'green', 'gray']

/** `true` when a slot rendered nothing (only comments / empty fragments), so the fallback is used. */
function isEmptyVNodes(nodes: VNode[] | undefined): boolean {
  return !nodes || nodes.every((node) => {
    if (node.type === Comment)
      return true
    if (node.type === Fragment)
      return !Array.isArray(node.children) || isEmptyVNodes(node.children as VNode[])
    return node.type === Text && !String(node.children ?? '').trim()
  })
}

/** Render prop result > item field > deprecated item field. */
function pickNode(...nodes: VueNode[]): VueNode {
  return nodes.find(isRenderable)
}

const mergedMode = computed(() => {
  if (props.mode === 'left')
    return 'start'
  if (props.mode === 'right')
    return 'end'
  return props.mode === 'alternate' || props.mode === 'end' ? props.mode : 'start'
})

const hasPending = computed(() => !!slots.pending || isRenderable(props.pending))

const mergedItems = computed<InternalItem[]>(() => {
  const list: InternalItem[] = (props.items ?? []).map((item, index) => {
    const placement = item.placement
      ?? (item.position === 'left' ? 'start' : item.position === 'right' ? 'end' : item.position)
      ?? (mergedMode.value === 'alternate' ? (index % 2 === 0 ? 'start' : 'end') : mergedMode.value)
    const preset = !!item.color && PRESET_COLORS.includes(item.color)
    const params: TimelineRenderParams = { item, index }
    return {
      key: item.key ?? index,
      item,
      index,
      title: pickNode(props.labelRender?.(params), item.title, item.label),
      content: pickNode(props.contentRender?.(params), item.content, item.children),
      icon: pickNode(props.dotRender?.(params), item.icon, item.dot),
      loading: !!item.loading,
      pending: false,
      class: [
        `am-timeline-item-placement-${placement}`,
        preset ? `am-timeline-item-color-${item.color}` : undefined,
        item.className,
        item.class,
      ],
      style: item.color && !preset ? { '--am-timeline-item-color': item.color, ...item.style } as CSSProperties : item.style,
    }
  })

  if (hasPending.value) {
    list.push({
      key: '__pending__',
      item: {},
      index: list.length,
      title: undefined,
      content: props.pending === true ? undefined : props.pending,
      icon: props.pendingDot,
      loading: true,
      pending: true,
      class: [`am-timeline-item-placement-${mergedMode.value === 'end' ? 'end' : 'start'}`, 'am-timeline-item-pending'],
      style: undefined,
    })
  }
  return props.reverse ? list.reverse() : list
})

/** Titles live in their own column, opposite to the content. */
const layoutAlternate = computed(() => {
  return mergedMode.value === 'alternate'
    || !!slots.labelRender
    || !!props.labelRender
    || mergedItems.value.some(item => isRenderable(item.title))
})

function hasCustomIcon(node: InternalItem) {
  if (node.pending || node.loading || isRenderable(node.icon))
    return true
  return !!slots.dotRender && !isEmptyVNodes(slots.dotRender({ item: node.item, index: node.index }))
}

const classNames = computed(() => [
  'am-timeline',
  `am-timeline-mode-${mergedMode.value}`,
  `am-timeline-${props.variant}`,
  {
    'am-timeline-layout-alternate': layoutAlternate.value,
    'am-timeline-reverse': props.reverse,
    'am-timeline-pending': hasPending.value,
  },
  props.rootClass,
  props.classes?.root,
])

const rootStyle = computed(() => {
  const { titleSpan } = props
  let span: string | undefined
  if (titleSpan !== undefined && titleSpan !== null && titleSpan !== '' && mergedMode.value !== 'alternate') {
    const num = Number(titleSpan)
    span = Number.isNaN(num) ? String(titleSpan) : `${(num / 24) * 100}%`
  }
  return [span ? { '--am-timeline-title-span': span } : undefined, props.styles?.root]
})
</script>

<template>
  <ol v-bind="$attrs" :class="classNames" :style="rootStyle">
    <li
      v-for="(node, position) in mergedItems"
      :key="node.key"
      class="am-timeline-item"
      :class="[node.class, { 'am-timeline-item-last': position === mergedItems.length - 1 }, classes?.item]"
      :style="[styles?.item, node.style]"
    >
      <div
        v-if="layoutAlternate"
        class="am-timeline-item-title"
        :class="classes?.itemTitle"
        :style="styles?.itemTitle"
      >
        <template v-if="!node.pending">
          <slot name="labelRender" :item="node.item" :index="node.index">
            <RenderNode :node="node.title" />
          </slot>
        </template>
      </div>
      <div class="am-timeline-item-rail" :class="classes?.itemRail" :style="styles?.itemRail">
        <span
          class="am-timeline-item-icon"
          :class="[{ 'am-timeline-item-icon-custom': hasCustomIcon(node) }, classes?.itemIcon]"
          :style="styles?.itemIcon"
        >
          <template v-if="node.pending">
            <slot name="pendingDot">
              <RenderNode v-if="isRenderable(node.icon)" :node="node.icon" />
              <Spinner v-else />
            </slot>
          </template>
          <slot v-else name="dotRender" :item="node.item" :index="node.index">
            <RenderNode v-if="isRenderable(node.icon)" :node="node.icon" />
            <Spinner v-else-if="node.loading" />
          </slot>
        </span>
      </div>
      <div class="am-timeline-item-content" :class="classes?.itemContent" :style="styles?.itemContent">
        <slot v-if="node.pending" name="pending">
          <RenderNode :node="node.content" />
        </slot>
        <slot v-else name="contentRender" :item="node.item" :index="node.index">
          <RenderNode :node="node.content" />
        </slot>
      </div>
    </li>
  </ol>
</template>
