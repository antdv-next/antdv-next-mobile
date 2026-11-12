<script setup lang="ts">
import type { CardMetaProps, CardMetaSlots } from './interface'
import { computed } from 'vue'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCardMeta', inheritAttrs: false })

const props = defineProps<CardMetaProps>()
const slots = defineSlots<CardMetaSlots>()

const hasAvatar = computed(() => !!slots.avatar || isRenderable(props.avatar))
const hasTitle = computed(() => !!slots.title || isRenderable(props.title))
const hasDescription = computed(() => !!slots.description || isRenderable(props.description))
</script>

<template>
  <div v-bind="$attrs" class="am-card-meta" :class="[rootClass, classes?.root]" :style="styles?.root">
    <div v-if="hasAvatar" class="am-card-meta-avatar" :class="classes?.avatar" :style="styles?.avatar">
      <slot name="avatar">
        <RenderNode :node="avatar" />
      </slot>
    </div>
    <div
      v-if="hasTitle || hasDescription"
      class="am-card-meta-section"
      :class="classes?.section"
      :style="styles?.section"
    >
      <div v-if="hasTitle" class="am-card-meta-title" :class="classes?.title" :style="styles?.title">
        <slot name="title">
          <RenderNode :node="title" />
        </slot>
      </div>
      <div
        v-if="hasDescription"
        class="am-card-meta-description"
        :class="classes?.description"
        :style="styles?.description"
      >
        <slot name="description">
          <RenderNode :node="description" />
        </slot>
      </div>
    </div>
  </div>
</template>
