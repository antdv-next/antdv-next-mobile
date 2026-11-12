<script setup lang="ts">
import type { SkeletonInputProps } from './interface'
import { computed } from 'vue'
import { useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSkeletonInput', inheritAttrs: false })

const props = defineProps<SkeletonInputProps>()

const size = useSize(() => props.size)

const classNames = computed(() => [
  'am-skeleton',
  'am-skeleton-element',
  { 'am-skeleton-active': props.active, 'am-skeleton-block': props.block },
  props.rootClass,
  props.classes?.root,
])

const contentClass = computed(() => [
  'am-skeleton-input',
  {
    'am-skeleton-input-sm': size.value === 'small',
    'am-skeleton-input-lg': size.value === 'large',
  },
  props.classes?.content,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <span :class="contentClass" :style="styles?.content" />
  </div>
</template>
