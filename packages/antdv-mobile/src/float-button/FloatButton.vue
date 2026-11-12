<script setup lang="ts">
import type { FloatButtonEmits, FloatButtonProps, FloatButtonSlots } from './interface'
import { FileTextOutlined } from '@antdv-next/icons'
import { computed, inject, ref } from 'vue'
import { BaseBadge } from '../_base'
import { isRenderable } from '../_util'
import { useDraggable } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { floatButtonGroupContextKey } from './context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmFloatButton', inheritAttrs: false })

const props = withDefaults(defineProps<FloatButtonProps>(), {
  icon: undefined,
  content: undefined,
  description: undefined,
  type: 'default',
  htmlType: 'button',
  draggable: false,
  axis: 'xy',
  gap: 16,
})
const emit = defineEmits<FloatButtonEmits>()
const slots = defineSlots<FloatButtonSlots>()

const group = inject(floatButtonGroupContextKey, null)
const rootRef = ref<HTMLElement>()

const mergedShape = computed(() => group?.shape.value ?? props.shape ?? 'circle')
const mergedContent = computed(() => (isRenderable(props.content) ? props.content : props.description))
const hasContent = computed(() => !!slots.default || isRenderable(mergedContent.value))
const hasIcon = computed(() => !!slots.icon || isRenderable(props.icon))
const canDrag = computed(() => props.draggable && !group)

// ---------- drag ----------
const drag = useDraggable(rootRef, {
  disabled: () => !canDrag.value,
  axis: () => props.axis,
  magnetic: () => props.magnetic,
  gap: () => props.gap,
  offset: () => props.offset,
  onEnd(offset) {
    emit('update:offset', offset)
    emit('offsetChange', offset)
  },
})
const dragging = drag.dragging
const positionStyle = computed(() => (group ? undefined : drag.style.value))

function onClick(event: MouseEvent) {
  if (drag.consumeClick()) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}

defineExpose({
  nativeElement: rootRef,
})
</script>

<template>
  <component
    :is="href !== undefined ? 'a' : 'button'"
    ref="rootRef"
    v-bind="$attrs"
    class="am-float-button"
    :class="[
      `am-float-button-${type}`,
      `am-float-button-${mergedShape}`,
      {
        'am-float-button-in-group': !!group,
        'am-float-button-with-content': hasContent,
        'am-float-button-draggable': canDrag,
        'am-float-button-dragging': dragging,
      },
      rootClass,
      classes?.root,
    ]"
    :style="[positionStyle, styles?.root]"
    :type="href !== undefined ? undefined : htmlType"
    :href="href"
    :target="href !== undefined ? target : undefined"
    :aria-label="ariaLabel"
    @click="onClick"
    @mousedown="drag.onMouseDown"
    @touchstart="drag.onTouchStart"
    @touchmove="drag.onTouchMove"
    @touchend="drag.onTouchEnd"
    @touchcancel="drag.onTouchEnd"
  >
    <BaseBadge
      v-if="badge"
      :count="badge.count"
      :dot="badge.dot"
      :overflow-count="badge.overflowCount"
      :show-zero="badge.showZero"
      :color="badge.color"
      class="am-float-button-badge"
      :class="[classes?.badge, { 'am-float-button-badge-dot': badge.dot }]"
      :style="styles?.badge"
    />
    <span class="am-float-button-body">
      <span v-if="hasIcon || !hasContent" class="am-float-button-icon" :class="classes?.icon" :style="styles?.icon">
        <slot name="icon">
          <RenderNode v-if="isRenderable(icon)" :node="icon" />
          <FileTextOutlined v-else />
        </slot>
      </span>
      <span v-if="hasContent" class="am-float-button-content" :class="classes?.content" :style="styles?.content">
        <slot>
          <RenderNode :node="mergedContent" />
        </slot>
      </span>
    </span>
  </component>
</template>
