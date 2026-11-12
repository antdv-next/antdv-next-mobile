<script setup lang="ts">
import type { SkeletonAvatarConfig, SkeletonParagraphConfig, SkeletonProps, SkeletonSlots, SkeletonTitleConfig } from './interface'
import { computed } from 'vue'
import { addUnit } from '../_util'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSkeleton', inheritAttrs: false })

const props = withDefaults(defineProps<SkeletonProps>(), {
  loading: undefined,
  avatar: false,
  title: true,
  paragraph: true,
})
defineSlots<SkeletonSlots>()

function toConfig<T extends object>(value: boolean | T | undefined): T {
  return (value && typeof value === 'object' ? value : {}) as T
}

const hasAvatar = computed(() => !!props.avatar)
const hasTitle = computed(() => !!props.title)
const hasParagraph = computed(() => !!props.paragraph)

const avatarConfig = computed(() => {
  const config = toConfig<SkeletonAvatarConfig>(props.avatar)
  // Same defaults as antdv-next: a lone title gets a square avatar.
  const shape = config.shape ?? (hasTitle.value && !hasParagraph.value ? 'square' : 'circle')
  const size = config.size ?? 'large'
  return {
    class: [
      'am-skeleton-avatar',
      `am-skeleton-avatar-${shape}`,
      {
        'am-skeleton-avatar-sm': size === 'small',
        'am-skeleton-avatar-lg': size === 'large',
      },
      props.classes?.avatar,
    ],
    style: [
      typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined,
      props.styles?.avatar,
    ],
  }
})

const titleWidth = computed(() => {
  const config = toConfig<SkeletonTitleConfig>(props.title)
  if (config.width !== undefined)
    return addUnit(config.width)
  if (!hasAvatar.value && hasParagraph.value)
    return '38%'
  if (hasAvatar.value && hasParagraph.value)
    return '50%'
  return undefined
})

const rows = computed(() => {
  const config = toConfig<SkeletonParagraphConfig>(props.paragraph)
  const count = config.rows ?? (!hasAvatar.value && hasTitle.value ? 3 : 2)
  const width = config.width ?? (!hasAvatar.value || !hasTitle.value ? '61%' : undefined)
  return Array.from({ length: Math.max(count, 0) }, (_, index) => {
    if (Array.isArray(width))
      return addUnit(width[index])
    return index === count - 1 ? addUnit(width) : undefined
  })
})

const classNames = computed(() => [
  'am-skeleton',
  {
    'am-skeleton-with-avatar': hasAvatar.value,
    'am-skeleton-active': props.active,
    'am-skeleton-round': props.round,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div
    v-if="loading !== false"
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    aria-busy="true"
  >
    <div v-if="hasAvatar" class="am-skeleton-header" :class="classes?.header" :style="styles?.header">
      <span :class="avatarConfig.class" :style="avatarConfig.style" />
    </div>
    <div v-if="hasTitle || hasParagraph" class="am-skeleton-section" :class="classes?.section" :style="styles?.section">
      <div
        v-if="hasTitle"
        class="am-skeleton-title"
        :class="classes?.title"
        :style="[{ width: titleWidth }, styles?.title]"
      />
      <ul v-if="hasParagraph" class="am-skeleton-paragraph" :class="classes?.paragraph" :style="styles?.paragraph">
        <li v-for="(width, index) in rows" :key="index" :style="{ width }" />
      </ul>
    </div>
  </div>
  <slot v-else />
</template>
