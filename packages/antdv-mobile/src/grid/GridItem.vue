<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { GridItemEmits, GridItemProps, GridItemSlots } from './interface'
import { computed, inject } from 'vue'
import { BaseBadge } from '../_base'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import { mergeAttrsStyle } from '../_util/vnode'
import { gridContextKey } from './context'
import '../style'
import './style/grid.css'

defineOptions({ name: 'AmGridItem', inheritAttrs: false })

const props = withDefaults(defineProps<GridItemProps>(), {
  icon: undefined,
  title: undefined,
  badge: undefined,
  disabled: false,
})
const emit = defineEmits<GridItemEmits>()
const slots = defineSlots<GridItemSlots>()

const grid = inject(gridContextKey, undefined)
const clickable = computed(() => (grid?.value.clickable ?? true) && !props.disabled)

const hasIcon = computed(() => !!slots.icon || isRenderable(props.icon))
const hasTitle = computed(() => !!slots.title || isRenderable(props.title))

const classNames = computed(() => [
  'am-grid-item',
  {
    'am-grid-item-clickable': clickable.value,
    'am-grid-item-disabled': props.disabled,
  },
  grid?.value.classes?.item,
  props.rootClass,
  props.classes?.root,
])

const mergedStyle = computed<CSSProperties>(() => {
  const span = Math.floor(Number(props.span))
  return {
    ...(span > 1 ? { gridColumn: `span ${span}` } : undefined),
    ...grid?.value.styles?.item,
    ...props.styles?.root,
  }
})

function handleClick(event: MouseEvent) {
  if (!props.disabled)
    emit('click', event)
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classNames"
    :style="mergeAttrsStyle(mergedStyle, $attrs.style)"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-disabled="disabled || undefined"
    @click="handleClick"
    @keydown.enter="handleClick($event as unknown as MouseEvent)"
  >
    <slot>
      <div
        v-if="hasIcon"
        class="am-grid-item-icon"
        :class="[grid?.classes?.icon, classes?.icon]"
        :style="[grid?.styles?.icon, styles?.icon]"
      >
        <slot name="icon">
          <RenderNode :node="icon" />
        </slot>
        <BaseBadge
          :count="badge"
          class="am-grid-item-badge"
          :class="[{ 'am-grid-item-badge-dot': badge === true }, grid?.classes?.badge, classes?.badge]"
          :style="[grid?.styles?.badge, styles?.badge]"
        />
      </div>
      <div
        v-if="hasTitle"
        class="am-grid-item-title"
        :class="[grid?.classes?.title, classes?.title]"
        :style="[grid?.styles?.title, styles?.title]"
      >
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
        <BaseBadge
          v-if="!hasIcon"
          :count="badge"
          class="am-grid-item-badge"
          :class="[{ 'am-grid-item-badge-dot': badge === true }, grid?.classes?.badge, classes?.badge]"
          :style="[grid?.styles?.badge, styles?.badge]"
        />
      </div>
    </slot>
  </div>
</template>
