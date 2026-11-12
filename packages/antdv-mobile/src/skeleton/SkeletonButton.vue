<script setup lang="ts">
import type { SkeletonButtonProps } from './interface'
import { computed } from 'vue'
import { useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSkeletonButton', inheritAttrs: false })

const props = withDefaults(defineProps<SkeletonButtonProps>(), { shape: 'default' })

const size = useSize(() => props.size)

const classNames = computed(() => [
  'am-skeleton',
  'am-skeleton-element',
  { 'am-skeleton-active': props.active, 'am-skeleton-block': props.block },
  props.rootClass,
  props.classes?.root,
])

const contentClass = computed(() => [
  'am-skeleton-button',
  {
    [`am-skeleton-button-${props.shape}`]: props.shape !== 'default',
    'am-skeleton-button-sm': size.value === 'small',
    'am-skeleton-button-lg': size.value === 'large',
  },
  props.classes?.content,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <span :class="contentClass" :style="styles?.content" />
  </div>
</template>
