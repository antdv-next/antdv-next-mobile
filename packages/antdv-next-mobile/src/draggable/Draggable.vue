<script setup lang="ts">
import type { DraggableEmits, DraggableProps, DraggableSlots } from './interface'
import { getCurrentInstance, ref } from 'vue'
import { Portal } from '../_base'
import { useDraggable, useEventListener } from '../_util/hooks'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmDraggable', inheritAttrs: false })

const props = withDefaults(defineProps<DraggableProps>(), {
  axis: 'xy',
  gap: 0,
  disabled: false,
  getContainer: undefined,
})
const emit = defineEmits<DraggableEmits>()
defineSlots<DraggableSlots>()

const rootRef = ref<HTMLElement>()

// The root sits below a Portal, so Vue does not hand it the scope id of the parent component.
// Positioning a Draggable from a scoped style is the main use case: pass the id on by hand.
const scopeId = getCurrentInstance()?.vnode.scopeId
const scopeAttrs = scopeId ? { [scopeId]: '' } : undefined

const drag = useDraggable(rootRef, {
  disabled: () => props.disabled,
  axis: () => props.axis,
  magnetic: () => props.magnetic,
  gap: () => props.gap,
  offset: () => props.offset,
  onStart: () => emit('dragStart'),
  onEnd(offset) {
    emit('update:offset', offset)
    emit('offsetChange', offset)
    emit('dragEnd', offset)
  },
})
const dragging = drag.dragging
const dragStyle = drag.style

useEventListener('resize', drag.resize)

function onClick(event: MouseEvent) {
  if (drag.consumeClick()) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}

function reset() {
  drag.reset()
  if (drag.position.value)
    emit('update:offset', drag.position.value)
}

defineExpose({
  reset,
  resize: drag.resize,
  nativeElement: rootRef,
})
</script>

<template>
  <Portal v-slot="{ theme }" :get-container="getContainer" fallback="inline">
    <div
      ref="rootRef"
      v-bind="{ ...scopeAttrs, ...$attrs }"
      class="am-draggable"
      :class="[
        theme.class,
        {
          'am-draggable-dragging': dragging,
          'am-draggable-disabled': disabled,
        },
        rootClass,
        classes?.root,
      ]"
      :style="[theme.style, zIndex !== undefined ? { zIndex } : undefined, dragStyle, styles?.root]"
      :dir="theme.dir"
      @click="onClick"
      @mousedown="drag.onMouseDown"
      @touchstart="drag.onTouchStart"
      @touchmove="drag.onTouchMove"
      @touchend="drag.onTouchEnd"
      @touchcancel="drag.onTouchEnd"
    >
      <slot :dragging="dragging" />
    </div>
  </Portal>
</template>
