<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { GridContext } from './context'
import type { GridEmits, GridItemType, GridProps, GridSlots } from './interface'
import { computed, provide } from 'vue'
import { addUnit } from '../_util'
import { mergeAttrsStyle } from '../_util/vnode'
import { gridContextKey } from './context'
import GridItem from './GridItem.vue'
import '../style'
import './style/grid.css'

defineOptions({ name: 'AmGrid', inheritAttrs: false })

const props = withDefaults(defineProps<GridProps>(), {
  items: () => [],
  bordered: false,
  square: false,
  orientation: 'vertical',
  clickable: true,
})
const emit = defineEmits<GridEmits>()
defineSlots<GridSlots>()

const gaps = computed(() => {
  const [x, y = x] = Array.isArray(props.gap) ? props.gap : [props.gap]
  return [x, y].map(value => (value === undefined || value === null || value === '' || Number(value) === 0 ? undefined : addUnit(value)))
})

const classNames = computed(() => [
  'am-grid',
  {
    'am-grid-bordered': props.bordered,
    'am-grid-gapped': gaps.value.some(Boolean),
    'am-grid-square': props.square,
    'am-grid-horizontal': props.orientation === 'horizontal',
  },
  props.rootClass,
  props.classes?.root,
])

const mergedStyle = computed<CSSProperties>(() => {
  const style: Record<string, any> = {}
  const columns = Number(props.columns)
  if (columns > 0)
    style['--am-grid-columns'] = Math.floor(columns)
  const [x, y] = gaps.value
  if (x)
    style.columnGap = x
  if (y)
    style.rowGap = y
  if (props.iconSize !== undefined && props.iconSize !== null && props.iconSize !== '')
    style['--am-grid-icon-size'] = addUnit(props.iconSize)
  return { ...style, ...props.styles?.root }
})

provide(gridContextKey, computed<GridContext>(() => ({
  clickable: props.clickable,
  classes: props.classes,
  styles: props.styles,
})))

function handleClick(item: GridItemType, index: number, event: MouseEvent) {
  emit('itemClick', item, index, event)
}
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="mergeAttrsStyle(mergedStyle, $attrs.style)">
    <GridItem
      v-for="(item, index) in items"
      :key="item.key ?? index"
      :icon="item.icon"
      :title="item.title"
      :badge="item.badge"
      :span="item.span"
      :disabled="item.disabled"
      :class="item.class"
      :style="item.style"
      @click="handleClick(item, index, $event)"
    >
      <template v-if="$slots.icon" #icon>
        <slot name="icon" :item="item" :index="index" />
      </template>
      <template v-if="$slots.title" #title>
        <slot name="title" :item="item" :index="index" />
      </template>
    </GridItem>
    <slot />
  </div>
</template>
