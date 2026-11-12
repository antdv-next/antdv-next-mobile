<script setup lang="ts">
import type { EmptyProps, EmptySlots } from './interface'
import { computed } from 'vue'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import DefaultImage from './DefaultImage.vue'
import { PRESENTED_IMAGE_SIMPLE } from './images'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmEmpty', inheritAttrs: false })

const props = withDefaults(defineProps<EmptyProps>(), {
  image: undefined,
  description: undefined,
})
const slots = defineSlots<EmptySlots>()

const locale = useLocale('Empty')

const hasCustomImage = computed(() => props.image !== undefined && props.image !== null && props.image !== true && props.image !== '')
const isImageUrl = computed(() => typeof props.image === 'string' && props.image !== '')
const showDescription = computed(() => !!slots.description || (props.description !== false && props.description !== null))
const hasCustomDescription = computed(() => props.description !== undefined && props.description !== true && props.description !== '')
const alt = computed(() => (typeof props.description === 'string' && props.description ? props.description : locale.value.description))

const classNames = computed(() => [
  'am-empty',
  { 'am-empty-normal': props.image === PRESENTED_IMAGE_SIMPLE },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div v-if="image !== false" class="am-empty-image" :class="classes?.image" :style="styles?.image">
      <slot name="image">
        <img v-if="isImageUrl" :src="(image as string)" :alt="alt" draggable="false">
        <RenderNode v-else-if="hasCustomImage" :node="image" />
        <DefaultImage v-else />
      </slot>
    </div>
    <div v-if="showDescription" class="am-empty-description" :class="classes?.description" :style="styles?.description">
      <slot name="description">
        <RenderNode v-if="hasCustomDescription" :node="description" />
        <template v-else>
          {{ locale.description }}
        </template>
      </slot>
    </div>
    <div v-if="$slots.default" class="am-empty-footer" :class="classes?.footer" :style="styles?.footer">
      <slot />
    </div>
  </div>
</template>
