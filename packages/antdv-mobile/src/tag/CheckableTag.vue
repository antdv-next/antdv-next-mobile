<script setup lang="ts">
import type { CheckableTagEmits, CheckableTagProps, CheckableTagSlots } from './interface'
import { computed } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmCheckableTag', inheritAttrs: false })

const props = withDefaults(defineProps<CheckableTagProps>(), {
  checked: undefined,
  defaultChecked: false,
  disabled: undefined,
  round: false,
})
const emit = defineEmits<CheckableTagEmits>()
const slots = defineSlots<CheckableTagSlots>()

const size = useSize(() => props.size)
const disabled = useDisabled(() => props.disabled)

const [checked, setChecked] = useControlled(props, 'checked', {
  defaultValue: props.defaultChecked,
  onChange: (value: boolean) => {
    emit('update:checked', value)
    emit('change', value)
  },
})

const hasIcon = computed(() => !!slots.icon || (props.icon !== undefined && props.icon !== null && props.icon !== false))

const classNames = computed(() => [
  'am-tag',
  'am-tag-checkable',
  {
    'am-tag-checkable-checked': checked.value,
    'am-tag-checkable-disabled': disabled.value,
    'am-tag-sm': size.value === 'small',
    'am-tag-lg': size.value === 'large',
    'am-tag-round': props.round,
  },
  props.rootClass,
])

function handleClick(event: MouseEvent) {
  if (disabled.value)
    return
  setChecked(!checked.value)
  emit('click', event)
}

function handleKeydown(event: KeyboardEvent) {
  if (disabled.value || (event.key !== 'Enter' && event.key !== ' '))
    return
  event.preventDefault()
  setChecked(!checked.value)
}
</script>

<template>
  <span
    v-bind="$attrs"
    :class="classNames"
    role="checkbox"
    :aria-checked="checked"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : 0"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span v-if="hasIcon" class="am-tag-icon">
      <slot name="icon"><RenderNode :node="icon" /></slot>
    </span>
    <span v-if="$slots.default" class="am-tag-content">
      <slot />
    </span>
  </span>
</template>
