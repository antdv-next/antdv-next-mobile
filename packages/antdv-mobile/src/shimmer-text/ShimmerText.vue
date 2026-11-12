<script setup lang="ts">
import type { ShimmerTextProps, ShimmerTextSlots } from './interface'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmShimmerText', inheritAttrs: false })

const props = withDefaults(defineProps<ShimmerTextProps>(), {
  content: undefined,
  active: true,
  tag: 'span',
})
defineSlots<ShimmerTextSlots>()

const tokenStyle = computed(() => ({
  '--am-shimmer-text-duration': typeof props.duration === 'number' ? `${props.duration}s` : props.duration,
  '--am-shimmer-text-color': props.color,
  '--am-shimmer-text-shimmer-color': props.shimmerColor,
}))
</script>

<template>
  <component
    :is="tag"
    v-bind="$attrs"
    class="am-shimmer-text"
    :class="[{ 'am-shimmer-text-active': active }, rootClass, classes?.root]"
    :style="[tokenStyle, styles?.root]"
  >
    <slot>
      <RenderNode :node="content" />
    </slot>
  </component>
</template>
