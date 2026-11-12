<script setup lang="ts">
import type { CSSProperties } from 'vue'

/** Internal: a color swatch on a checkerboard, or the "no color" mark. */
defineOptions({ name: 'AmColorPickerBlock' })

defineProps<{
  /** css color */
  color?: string
  /** show the "no color" mark instead of the color */
  cleared?: boolean
  innerClass?: string
  innerStyle?: CSSProperties
}>()
</script>

<template>
  <span class="am-color-picker-block" :class="{ 'am-color-picker-block-cleared': cleared }">
    <span
      v-if="!cleared"
      class="am-color-picker-block-inner"
      :class="innerClass"
      :style="[{ background: color }, innerStyle]"
    />
  </span>
</template>
