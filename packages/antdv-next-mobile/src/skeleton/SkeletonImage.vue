<script setup lang="ts">
import type { SkeletonImageProps } from './interface'
import { PictureOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { getSizeStyle } from '../_util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSkeletonImage', inheritAttrs: false })

const props = defineProps<SkeletonImageProps>()

const classNames = computed(() => [
  'am-skeleton',
  'am-skeleton-element',
  { 'am-skeleton-active': props.active },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <span class="am-skeleton-image" :class="classes?.content" :style="[getSizeStyle(size), styles?.content]">
      <PictureOutlined class="am-skeleton-image-icon" />
    </span>
  </div>
</template>
