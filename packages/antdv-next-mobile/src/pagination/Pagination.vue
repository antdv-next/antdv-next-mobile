<script setup lang="ts">
import type { VNodeChild } from 'vue'
import type { PaginationEmits, PaginationItemType, PaginationProps, PaginationSlots } from './interface'
import { EllipsisOutlined, LeftOutlined, RightOutlined } from '@antdv-next/icons'
import { computed, h } from 'vue'
import { clamp } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

interface PagerItem {
  type: PaginationItemType
  page: number
  disabled?: boolean
}

defineOptions({ name: 'AmPagination', inheritAttrs: false })

const props = withDefaults(defineProps<PaginationProps>(), {
  defaultCurrent: 1,
  total: 0,
  pageSize: 10,
  simple: false,
  disabled: undefined,
  showLessItems: false,
  hideOnSinglePage: false,
  prevIcon: undefined,
  nextIcon: undefined,
})
const emit = defineEmits<PaginationEmits>()
const slots = defineSlots<PaginationSlots>()

const locale = useLocale('Pagination')
const size = useSize(() => props.size)
const disabled = useDisabled(() => props.disabled)

const pageCount = computed(() => Math.max(Math.ceil(props.total / (props.pageSize > 0 ? props.pageSize : 10)), 1))

const [innerCurrent, setCurrent] = useControlled<PaginationProps, 'current', number>(props, 'current', {
  defaultValue: () => props.defaultCurrent,
  onChange: (page) => {
    emit('update:current', page)
    emit('change', page, props.pageSize)
  },
})

const current = computed(() => clamp(Math.floor(Number(innerCurrent.value)) || 1, 1, pageCount.value))

const range = computed<[number, number]>(() => [
  props.total === 0 ? 0 : (current.value - 1) * props.pageSize + 1,
  Math.min(current.value * props.pageSize, props.total),
])

const jumpStep = computed(() => (props.showLessItems ? 3 : 5))

const pages = computed<PagerItem[]>(() => {
  const count = pageCount.value
  const sibling = props.showLessItems ? 0 : 1
  const page = (p: number): PagerItem => ({ type: 'page', page: p })
  if (count <= sibling * 2 + 5)
    return Array.from({ length: count }, (_, i) => page(i + 1))

  const start = Math.max(Math.min(current.value - sibling, count - sibling * 2 - 2), 3)
  const end = Math.min(Math.max(current.value + sibling, sibling * 2 + 3), count - 2)
  const list: PagerItem[] = [page(1)]
  list.push(start > 3 ? { type: 'jump-prev', page: Math.max(current.value - jumpStep.value, 1) } : page(2))
  for (let p = start; p <= end; p++)
    list.push(page(p))
  list.push(end < count - 2 ? { type: 'jump-next', page: Math.min(current.value + jumpStep.value, count) } : page(count - 1))
  list.push(page(count))
  return list
})

const prevItem = computed<PagerItem>(() => ({ type: 'prev', page: Math.max(current.value - 1, 1), disabled: current.value <= 1 }))
const nextItem = computed<PagerItem>(() => ({
  type: 'next',
  page: Math.min(current.value + 1, pageCount.value),
  disabled: current.value >= pageCount.value,
}))

function renderNode(node: unknown): VNodeChild {
  return typeof node === 'function' ? node() : (node as VNodeChild)
}

function getElement(item: PagerItem): VNodeChild {
  switch (item.type) {
    case 'prev':
      if (slots.prevIcon)
        return slots.prevIcon()
      if (props.prevIcon !== undefined)
        return renderNode(props.prevIcon)
      return props.simple ? locale.value.prev : h(LeftOutlined)
    case 'next':
      if (slots.nextIcon)
        return slots.nextIcon()
      if (props.nextIcon !== undefined)
        return renderNode(props.nextIcon)
      return props.simple ? locale.value.next : h(RightOutlined)
    case 'jump-prev':
    case 'jump-next':
      return h(EllipsisOutlined)
    default:
      return String(item.page)
  }
}

function renderItem(item: PagerItem): VNodeChild {
  const element = getElement(item)
  return props.itemRender ? props.itemRender(item.page, item.type, element) : element
}

function go(item: PagerItem) {
  if (disabled.value || item.disabled || item.page === current.value)
    return
  setCurrent(item.page)
}

const ariaLabel = (item: PagerItem) => (item.type === 'prev' ? locale.value.prev : item.type === 'next' ? locale.value.next : undefined)

const classNames = computed(() => [
  'am-pagination',
  {
    'am-pagination-simple': props.simple,
    'am-pagination-sm': size.value === 'small',
    'am-pagination-lg': size.value === 'large',
    'am-pagination-disabled': disabled.value,
  },
  props.rootClass,
  props.classes?.root,
])

const list = computed(() => (props.simple ? [prevItem.value, nextItem.value] : [prevItem.value, ...pages.value, nextItem.value]))
</script>

<template>
  <nav
    v-if="!(hideOnSinglePage && pageCount <= 1)"
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    :aria-disabled="disabled || undefined"
  >
    <div v-if="slots.showTotal || showTotal" class="am-pagination-total">
      <slot name="showTotal" :total="total" :range="range">
        <RenderNode :node="showTotal?.(total, range)" />
      </slot>
    </div>
    <ul class="am-pagination-list">
      <template v-for="(item, index) in list" :key="`${item.type}-${item.type === 'page' ? item.page : index}`">
        <li
          class="am-pagination-item"
          :class="[
            `am-pagination-${item.type}`,
            {
              'am-pagination-item-active': item.type === 'page' && item.page === current,
              'am-pagination-item-disabled': disabled || item.disabled,
            },
            classes?.item,
          ]"
          :style="styles?.item"
          role="button"
          :tabindex="disabled || item.disabled ? -1 : 0"
          :aria-label="ariaLabel(item)"
          :aria-current="item.type === 'page' && item.page === current ? 'page' : undefined"
          :aria-disabled="disabled || item.disabled || undefined"
          @click="go(item)"
          @keydown.enter="go(item)"
        >
          <slot name="itemRender" :page="item.page" :type="item.type" :element="getElement(item)">
            <RenderNode :node="renderItem(item)" />
          </slot>
        </li>
        <li v-if="simple && item.type === 'prev'" class="am-pagination-simple-pager">
          <span class="am-pagination-simple-current">{{ current }}</span>
          <span class="am-pagination-slash">/</span>
          <span>{{ pageCount }}</span>
        </li>
      </template>
    </ul>
  </nav>
</template>
