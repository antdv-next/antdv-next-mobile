<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref } from 'vue'
import { clamp } from '../_util'
import { useColorDrag } from './useColorDrag'

/** Internal: hue / alpha slider. */
defineOptions({ name: 'AmColorPickerSlider' })

const props = defineProps<{
  type: 'hue' | 'alpha'
  value: number
  max: number
  disabled?: boolean
  /** css color of the handle */
  handleColor?: string
  railStyle?: CSSProperties
}>()
const emit = defineEmits<{ change: [value: number], complete: [] }>()

const railRef = ref<HTMLElement>()

const { dragging, handlers } = useColorDrag(railRef, {
  disabled: () => !!props.disabled,
  onChange: x => emit('change', Math.round(x * props.max)),
  onEnd: () => emit('complete'),
})

function onKeydown(event: KeyboardEvent) {
  if (props.disabled)
    return
  const offset = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[event.key]
  if (!offset)
    return
  event.preventDefault()
  const next = clamp(props.value + offset, 0, props.max)
  if (next !== props.value) {
    emit('change', next)
    emit('complete')
  }
}
</script>

<template>
  <div
    class="am-color-picker-slider"
    :class="[`am-color-picker-slider-${type}`, { 'am-color-picker-slider-dragging': dragging }]"
    v-on="handlers"
  >
    <div ref="railRef" class="am-color-picker-slider-rail">
      <span class="am-color-picker-slider-rail-inner" :style="railStyle" />
      <span
        class="am-color-picker-handle am-color-picker-slider-handle"
        :style="{ left: `${(value / max) * 100}%`, backgroundColor: handleColor }"
        role="slider"
        :tabindex="disabled ? -1 : 0"
        :aria-label="type"
        aria-valuemin="0"
        :aria-valuemax="max"
        :aria-valuenow="value"
        :aria-disabled="disabled || undefined"
        @keydown="onKeydown"
      />
    </div>
  </div>
</template>
