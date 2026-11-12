<script setup lang="ts">
import type { Key } from '../_util/type'
import type { VirtualListExpose, VirtualListScrollToConfig } from '../virtual-list/interface'
import type { ListEmits, ListProps, ListSlots } from './interface'
import { computed, ref } from 'vue'
import { Spinner } from '../_base'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useSize } from '../config-provider/context'
import { useLocale } from '../locale'
import VirtualList from '../virtual-list/VirtualList.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmList', inheritAttrs: false })

const props = withDefaults(defineProps<ListProps>(), {
  header: undefined,
  footer: undefined,
  mode: 'default',
  bordered: true,
  loading: false,
  virtual: false,
})
const emit = defineEmits<ListEmits>()
const slots = defineSlots<ListSlots>()

const size = useSize(() => props.size)
const emptyLocale = useLocale('Empty')
const commonLocale = useLocale('common')

const hasHeader = computed(() => !!slots.header || isRenderable(props.header))
const hasFooter = computed(() => !!slots.footer || isRenderable(props.footer))
const showEmpty = computed(() => !!props.dataSource && props.dataSource.length === 0 && !props.loading && !slots.default)

function getKey(item: any, index: number): Key {
  const { rowKey } = props
  if (typeof rowKey === 'function')
    return rowKey(item, index)
  if (rowKey && item && typeof item === 'object' && item[rowKey] !== undefined)
    return item[rowKey]
  return index
}

// ---------- virtual (data mode only) ----------
/** matches `--am-list-item-min-height` of every size: the estimate used before a row is measured */
const ITEM_HEIGHTS = { small: 40, middle: 48, large: 56 }

const listRef = ref<VirtualListExpose>()
const isVirtual = computed(() => props.virtual && !!props.dataSource)
const rowHeight = computed(() => props.itemHeight ?? ITEM_HEIGHTS[size.value ?? 'middle'])

/** virtual mode only: scroll to an offset (px), or to a row by `index` / `key` */
function scrollTo(target: number | VirtualListScrollToConfig) {
  listRef.value?.scrollTo(target)
}

defineExpose({ scrollTo })

const classNames = computed(() => [
  'am-list',
  `am-list-${props.mode}`,
  {
    'am-list-sm': size.value === 'small',
    'am-list-lg': size.value === 'large',
    'am-list-bordered': props.bordered,
    'am-list-loading': props.loading,
    'am-list-virtual': isVirtual.value,
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
      <VirtualList
        v-if="isVirtual"
        ref="listRef"
        class="am-list-virtual-list"
        :data="dataSource"
        :height="height"
        :item-height="rowHeight"
        :item-key="getKey"
        @reach-end="emit('reachEnd')"
      >
        <template #default="{ item, index }">
          <slot name="renderItem" :item="item" :index="index">
            <RenderNode :node="renderItem?.(item, index)" />
          </slot>
        </template>
        <!-- inside the scroll container: the loading row follows the last item -->
        <template v-if="showEmpty || loading" #footer>
          <div v-if="showEmpty" class="am-list-empty">
            <slot name="emptyText">
              <RenderNode :node="locale?.emptyText ?? emptyLocale.description" />
            </slot>
          </div>
          <div v-if="loading" class="am-list-spin">
            <Spinner />
            <span>{{ commonLocale.loading }}</span>
          </div>
        </template>
      </VirtualList>
      <template v-else>
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
          <Spinner />
          <span>{{ commonLocale.loading }}</span>
        </div>
      </template>
    </div>
    <div v-if="hasFooter" class="am-list-footer" :class="classes?.footer" :style="styles?.footer">
      <slot name="footer">
        <RenderNode :node="footer" />
      </slot>
    </div>
  </div>
</template>
