<script setup lang="ts">
import type { SizeType, ValidateStatus, VueNode } from '../_util/type'
import type { Variant } from '../form/context'
import type { PickerFieldSemanticClassNames, PickerFieldSemanticStyles } from './interface'
import { CloseCircleFilled, DownOutlined, RightOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { useCompactItemContext } from '../_base/compact'
import { isRenderable } from '../_util'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import { useFormItemInputContext, useMergedStatus, useVariant } from '../form/context'
import { useLocale } from '../locale'
import '../style'
import './style/index.css'

/** Internal: the input-like trigger shared by every picker field. */
defineOptions({ name: 'AmPickerTrigger', inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** text of the current value, empty -> placeholder */
  label?: VueNode
  placeholder?: string
  open?: boolean
  disabled?: boolean
  allowClear?: boolean
  status?: ValidateStatus
  variant?: Variant
  size?: SizeType
  suffixIcon?: VueNode
  id?: string
  rootClass?: string
  classes?: PickerFieldSemanticClassNames
  styles?: PickerFieldSemanticStyles
}>(), {
  disabled: undefined,
  suffixIcon: undefined,
})
const emit = defineEmits<{ click: [event: Event], clear: [event: MouseEvent] }>()
defineSlots<{ default?: () => any, suffixIcon?: () => any }>()

const formItem = useFormItemInputContext()
const inputLocale = useLocale('Input')
const compact = useCompactItemContext()
const size = useSize(() => props.size ?? compact.size.value)
const disabled = useDisabled(() => props.disabled)
const status = useMergedStatus(() => props.status)
const variant = useVariant(() => props.variant)

const hasValue = computed(() => isRenderable(props.label))
const showClear = computed(() => props.allowClear && hasValue.value && !disabled.value)

const classNames = computed(() => [
  'am-picker-trigger',
  `am-picker-trigger-${variant.value}`,
  {
    'am-picker-trigger-sm': size.value === 'small',
    'am-picker-trigger-lg': size.value === 'large',
    'am-picker-trigger-open': props.open,
    'am-picker-trigger-disabled': disabled.value,
    [`am-picker-trigger-status-${status.value}`]: status.value === 'error' || status.value === 'warning',
  },
  compact.classes.value,
  props.rootClass,
  props.classes?.root,
])

function onClick(event: Event) {
  if (!disabled.value)
    emit('click', event)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onClick(event)
  }
}

function onClear(event: MouseEvent) {
  event.stopPropagation()
  emit('clear', event)
}
</script>

<template>
  <div
    v-bind="$attrs"
    :id="id ?? formItem.id.value"
    :class="classNames"
    :style="styles?.root"
    role="combobox"
    aria-haspopup="dialog"
    :aria-expanded="!!open"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : 0"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span
      class="am-picker-trigger-content"
      :class="[{ 'am-picker-trigger-placeholder': !hasValue }, classes?.content]"
      :style="styles?.content"
    >
      <template v-if="hasValue">
        <slot>
          <RenderNode :node="label" />
        </slot>
      </template>
      <template v-else>{{ placeholder }}</template>
    </span>
    <span
      v-if="showClear"
      class="am-picker-trigger-suffix am-picker-trigger-clear"
      :class="classes?.suffix"
      :style="styles?.suffix"
      role="button"
      :aria-label="inputLocale.clear"
      @click="onClear"
    >
      <CloseCircleFilled />
    </span>
    <span
      v-else-if="$slots.suffixIcon || (suffixIcon !== null && suffixIcon !== false)"
      class="am-picker-trigger-suffix"
      :class="classes?.suffix"
      :style="styles?.suffix"
    >
      <slot name="suffixIcon">
        <RenderNode v-if="suffixIcon !== undefined" :node="suffixIcon" />
        <!-- a borderless field sits in a list cell: use the cell arrow -->
        <RightOutlined v-else-if="variant === 'borderless'" />
        <DownOutlined v-else />
      </slot>
    </span>
  </div>
</template>
