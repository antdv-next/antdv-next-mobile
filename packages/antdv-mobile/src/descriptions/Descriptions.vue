<script setup lang="ts">
import type { VueNode } from '../_util/type'
import type { DescriptionsItemType, DescriptionsProps, DescriptionsSlots } from './interface'
import { computed } from 'vue'
import { clamp, isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmDescriptions', inheritAttrs: false })

const props = withDefaults(defineProps<DescriptionsProps>(), {
  column: 1,
  layout: 'horizontal',
  colon: true,
  contentAlign: 'start',
})
const slots = defineSlots<DescriptionsSlots>()

interface InternalItem {
  key: string | number
  item: DescriptionsItemType
  index: number
  content: VueNode
  span: number
}

const size = useSize(() => props.size)

const hasTitle = computed(() => !!slots.title || isRenderable(props.title))
const hasExtra = computed(() => !!slots.extra || isRenderable(props.extra))

const mergedColumn = computed(() => {
  const column = Math.floor(Number(props.column))
  return column >= 1 ? column : 1
})

/** Resolves every item's span so that each row is completely filled (needed by the bordered grid). */
const mergedItems = computed<InternalItem[]>(() => {
  const column = mergedColumn.value
  const list: InternalItem[] = []
  let rest = column

  const fillPrevious = () => {
    const last = list[list.length - 1]
    if (last && rest > 0 && rest < column)
      last.span += rest
    rest = column
  }

  ;(props.items ?? []).forEach((item, index) => {
    let span: number
    if (item.span === 'filled') {
      span = rest
    }
    else {
      span = clamp(Math.floor(Number(item.span)) || 1, 1, column)
      if (span > rest) {
        fillPrevious()
      }
    }
    list.push({
      key: item.key ?? index,
      item,
      index,
      content: isRenderable(item.content) ? item.content : item.children,
      span,
    })
    rest -= span
    if (rest <= 0)
      rest = column
  })
  fillPrevious()
  return list
})

const classNames = computed(() => [
  'am-descriptions',
  `am-descriptions-${props.layout}`,
  {
    'am-descriptions-bordered': props.bordered,
    'am-descriptions-sm': size.value === 'small',
    'am-descriptions-lg': size.value === 'large',
    'am-descriptions-content-end': props.contentAlign === 'end' && props.layout === 'horizontal',
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div v-if="hasTitle || hasExtra" class="am-descriptions-header" :class="classes?.header" :style="styles?.header">
      <div v-if="hasTitle" class="am-descriptions-title" :class="classes?.title" :style="styles?.title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
      <div v-if="hasExtra" class="am-descriptions-extra" :class="classes?.extra" :style="styles?.extra">
        <slot name="extra">
          <RenderNode :node="extra" />
        </slot>
      </div>
    </div>
    <div class="am-descriptions-view" :style="{ gridTemplateColumns: `repeat(${mergedColumn}, minmax(0, 1fr))` }">
      <div
        v-for="node in mergedItems"
        :key="node.key"
        class="am-descriptions-item"
        :class="node.item.class"
        :style="[{ gridColumn: `span ${node.span}` }, node.item.style]"
      >
        <span
          class="am-descriptions-item-label"
          :class="[{ 'am-descriptions-item-no-colon': !colon }, classes?.label, node.item.classes?.label]"
          :style="[styles?.label, node.item.styles?.label]"
        >
          <slot name="labelRender" :item="node.item" :index="node.index" :value="node.item.label">
            <RenderNode
              v-if="labelRender"
              :node="labelRender"
              :params="{ item: node.item, index: node.index, value: node.item.label }"
            />
            <RenderNode v-else :node="node.item.label" />
          </slot>
        </span>
        <span
          class="am-descriptions-item-content"
          :class="[classes?.content, node.item.classes?.content]"
          :style="[styles?.content, node.item.styles?.content]"
        >
          <slot name="contentRender" :item="node.item" :index="node.index" :value="node.content">
            <RenderNode
              v-if="contentRender"
              :node="contentRender"
              :params="{ item: node.item, index: node.index, value: node.content }"
            />
            <RenderNode v-else :node="node.content" />
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>
