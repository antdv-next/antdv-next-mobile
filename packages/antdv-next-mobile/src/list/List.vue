<script setup lang="ts">
import type { Key } from '../_util/type'
import type { ListProps, ListSlots } from './interface'
import { LoadingOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useSize } from '../config-provider/context'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmList', inheritAttrs: false })

const props = withDefaults(defineProps<ListProps>(), {
  header: undefined,
  footer: undefined,
  mode: 'default',
  bordered: true,
  loading: false,
})
const slots = defineSlots<ListSlots>()

const size = useSize(() => props.size)
const emptyLocale = useLocale('Empty')
const commonLocale = useLocale('common')

const hasNode = (node: unknown) => node !== undefined && node !== null && node !== false && node !== ''
const hasHeader = computed(() => !!slots.header || hasNode(props.header))
const hasFooter = computed(() => !!slots.footer || hasNode(props.footer))
const showEmpty = computed(() => !!props.dataSource && props.dataSource.length === 0 && !props.loading && !slots.default)

function getKey(item: any, index: number): Key {
  const { rowKey } = props
  if (typeof rowKey === 'function')
    return rowKey(item, index)
  if (rowKey && item && typeof item === 'object' && item[rowKey] !== undefined)
    return item[rowKey]
  return index
}

const classNames = computed(() => [
  'am-list',
  `am-list-${props.mode}`,
  {
    'am-list-sm': size.value === 'small',
    'am-list-lg': size.value === 'large',
    'am-list-bordered': props.bordered,
    'am-list-loading': props.loading,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div v-if="hasHeader" class="am-list-header" :class="classes?.header" :style="styles?.header">
      <slot name="header">
        <RenderNode :node="header" />
      </slot>
    </div>
    <div class="am-list-body" :class="classes?.body" :style="styles?.body" :aria-busy="loading || undefined">
      <slot />
      <template v-if="dataSource">
        <template v-for="(item, index) in dataSource" :key="getKey(item, index)">
          <slot name="renderItem" :item="item" :index="index">
            <RenderNode :node="renderItem?.(item, index)" />
          </slot>
        </template>
      </template>
      <div v-if="showEmpty" class="am-list-empty">
        <slot name="emptyText">
          <RenderNode :node="locale?.emptyText ?? emptyLocale.description" />
        </slot>
      </div>
      <div v-if="loading" class="am-list-spin">
        <LoadingOutlined class="am-spin-icon" />
        <span>{{ commonLocale.loading }}</span>
      </div>
    </div>
    <div v-if="hasFooter" class="am-list-footer" :class="classes?.footer" :style="styles?.footer">
      <slot name="footer">
        <RenderNode :node="footer" />
      </slot>
    </div>
  </div>
</template>
