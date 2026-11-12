<script setup lang="ts">
import { computed, ref } from 'vue'
import { generateColor } from './color'
import { useColorPickerPanelContext } from './context'
import { useColorDrag } from './useColorDrag'

/** Internal: saturation (x) / brightness (y) square. */
defineOptions({ name: 'AmColorPickerPalette' })

const ctx = useColorPickerPanelContext()
const rootRef = ref<HTMLElement>()

const hsb = computed(() => ctx.color.value.toHsb())

const { dragging, handlers } = useColorDrag(rootRef, {
  disabled: () => ctx.disabled.value,
  onChange: (x, y) => ctx.change(generateColor({ h: hsb.value.h, s: x, b: 1 - y, a: hsb.value.a }), true),
  onEnd: () => ctx.changeComplete(),
})
</script>

<template>
  <div
    ref="rootRef"
    class="am-color-picker-palette"
    :class="[{ 'am-color-picker-palette-dragging': dragging }, ctx.classes.value?.palette]"
    :style="[{ backgroundColor: `hsl(${hsb.h}, 100%, 50%)` }, ctx.styles.value?.palette]"
    v-on="handlers"
  >
    <span
      class="am-color-picker-handle am-color-picker-palette-handle"
      :style="{ left: `${hsb.s * 100}%`, top: `${(1 - hsb.b) * 100}%`, backgroundColor: generateColor({ ...hsb, a: 1 }).toRgbString() }"
    />
  </div>
</template>
