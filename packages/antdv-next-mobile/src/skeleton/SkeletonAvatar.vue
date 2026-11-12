<script setup lang="ts">
import type { SkeletonAvatarProps } from './interface'
import { computed } from 'vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSkeletonAvatar', inheritAttrs: false })

const props = withDefaults(defineProps<SkeletonAvatarProps>(), { shape: 'circle' })

const classNames = computed(() => [
  'am-skeleton',
  'am-skeleton-element',
  { 'am-skeleton-active': props.active },
  props.rootClass,
  props.classes?.root,
])

const contentClass = computed(() => [
  'am-skeleton-avatar',
  `am-skeleton-avatar-${props.shape}`,
  {
    'am-skeleton-avatar-sm': props.size === 'small',
    'am-skeleton-avatar-lg': props.size === 'large',
  },
  props.classes?.content,
])

const contentStyle = computed(() => [
  typeof props.size === 'number' ? { width: `${props.size}px`, height: `${props.size}px` } : undefined,
  props.styles?.content,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <span :class="contentClass" :style="contentStyle" />
  </div>
</template>
