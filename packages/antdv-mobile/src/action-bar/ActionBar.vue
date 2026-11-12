<script setup lang="ts">
import type { ActionBarProps, ActionBarSlots } from './interface'
import { computed } from 'vue'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmActionBar', inheritAttrs: false })

const props = withDefaults(defineProps<ActionBarProps>(), {
  fixed: true,
  placeholder: false,
  safeArea: true,
  bordered: true,
  prefix: undefined,
})
const slots = defineSlots<ActionBarSlots>()

const hasPrefix = computed(() => !!slots.prefix || isRenderable(props.prefix))

const classNames = computed(() => [
  'am-action-bar',
  {
    'am-action-bar-fixed': props.fixed,
    'am-action-bar-placeholder': props.fixed && props.placeholder,
    'am-action-bar-safe-area': props.safeArea,
    'am-action-bar-bordered': props.bordered,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div v-bind="$attrs" :class="classNames" :style="styles?.root">
    <div
      class="am-action-bar-content"
      :class="classes?.content"
      :style="[zIndex !== undefined ? { zIndex } : undefined, styles?.content]"
    >
      <div v-if="hasPrefix" class="am-action-bar-prefix" :class="classes?.prefix" :style="styles?.prefix">
        <slot name="prefix">
          <RenderNode :node="prefix" />
        </slot>
      </div>
      <slot />
    </div>
  </div>
</template>
