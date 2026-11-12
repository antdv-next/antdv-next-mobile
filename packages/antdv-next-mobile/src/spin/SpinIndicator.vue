<script setup lang="ts">
import { computed } from 'vue'
import { clamp } from '../_util'

/** Internal: default ring indicator of Spin (spins, or shows progress when `percent` is a number). */
defineOptions({ name: 'AmSpinIndicator' })

const props = defineProps<{ percent?: number, label?: string }>()

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const hasPercent = computed(() => typeof props.percent === 'number' && !Number.isNaN(props.percent))
const dashOffset = computed(() => CIRCUMFERENCE * (1 - clamp(props.percent ?? 0, 0, 100) / 100))
</script>

<template>
  <svg
    class="am-spin-icon-svg"
    :class="{ 'am-spin-icon-progress': hasPercent }"
    viewBox="0 0 48 48"
    role="img"
    :aria-label="label"
  >
    <circle v-if="hasPercent" class="am-spin-icon-rail" cx="24" cy="24" :r="RADIUS" fill="none" />
    <circle
      class="am-spin-icon-track"
      cx="24"
      cy="24"
      :r="RADIUS"
      fill="none"
      :stroke-dasharray="hasPercent ? CIRCUMFERENCE : undefined"
      :stroke-dashoffset="hasPercent ? dashOffset : undefined"
    />
  </svg>
</template>
