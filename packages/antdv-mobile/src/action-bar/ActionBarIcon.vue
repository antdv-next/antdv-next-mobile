<script setup lang="ts">
import type { ActionBarIconEmits, ActionBarIconProps, ActionBarIconSlots } from './interface'
import { computed } from 'vue'
import { BaseBadge } from '../_base'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmActionBarIcon', inheritAttrs: false })

const props = withDefaults(defineProps<ActionBarIconProps>(), {
  icon: undefined,
  text: undefined,
  badge: undefined,
  disabled: undefined,
})
const emit = defineEmits<ActionBarIconEmits>()
const slots = defineSlots<ActionBarIconSlots>()

const disabled = useDisabled(() => props.disabled)

const hasIcon = computed(() => !!slots.icon || isRenderable(props.icon))
const hasText = computed(() => !!slots.text || !!slots.default || isRenderable(props.text))

const classNames = computed(() => [
  'am-action-bar-icon',
  { 'am-action-bar-icon-disabled': disabled.value },
  props.rootClass,
  props.classes?.root,
])

function handleClick(event: MouseEvent) {
  if (!disabled.value)
    emit('click', event)
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="classNames"
    :style="styles?.root"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled || undefined"
    @click="handleClick"
    @keydown.enter="handleClick($event as unknown as MouseEvent)"
  >
    <div v-if="hasIcon" class="am-action-bar-icon-icon" :class="classes?.icon" :style="styles?.icon">
      <slot name="icon">
        <RenderNode :node="icon" />
      </slot>
      <BaseBadge
        :count="badge"
        class="am-action-bar-icon-badge"
        :class="[{ 'am-action-bar-icon-badge-dot': badge === true }, classes?.badge]"
        :style="styles?.badge"
      />
    </div>
    <div v-if="hasText" class="am-action-bar-icon-text" :class="classes?.text" :style="styles?.text">
      <slot name="text">
        <slot>
          <RenderNode :node="text" />
        </slot>
      </slot>
      <BaseBadge
        v-if="!hasIcon"
        :count="badge"
        class="am-action-bar-icon-badge"
        :class="[{ 'am-action-bar-icon-badge-dot': badge === true }, classes?.badge]"
        :style="styles?.badge"
      />
    </div>
  </div>
</template>
