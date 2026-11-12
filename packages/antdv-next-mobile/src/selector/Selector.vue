<script setup lang="ts">
import type { VueNode } from '../_util/type'
import type { SelectorEmits, SelectorItemContext, SelectorOption, SelectorProps, SelectorSlots, SelectorValue } from './interface'
import { CheckOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { isDef, isRenderable } from '../_util'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmSelector', inheritAttrs: false })

const props = withDefaults(defineProps<SelectorProps>(), {
  options: () => [],
  multiple: false,
  showCheckMark: true,
  disabled: undefined,
})
const emit = defineEmits<SelectorEmits>()
defineSlots<SelectorSlots>()

interface NormalizedItem {
  key: SelectorValue
  value: SelectorValue
  label: VueNode
  description: VueNode
  disabled: boolean
  option: SelectorOption
}

const disabled = useDisabled(() => props.disabled)
const formItem = useFormItemInputContext()

const items = computed<NormalizedItem[]>(() => {
  const { label = 'label', description = 'description', value = 'value', disabled: disabledKey = 'disabled' } = props.fieldNames ?? {}
  return props.options.map((option, index) => ({
    key: option[value] ?? index,
    value: option[value],
    label: option[label],
    description: option[description],
    disabled: !!option[disabledKey],
    option,
  }))
})

const [value, setValue] = useControlled(props, 'value', {
  defaultValue: (): SelectorValue[] => props.defaultValue ?? [],
  onChange: (val: SelectorValue[]) => {
    const selected = val
      .map(v => items.value.find(item => item.value === v)?.option)
      .filter(isDef)
    emit('update:value', val)
    emit('change', val, { items: selected })
    formItem.onFieldChange()
  },
})

const selectedList = computed<SelectorValue[]>(() => (Array.isArray(value.value) ? value.value : []))

function isChecked(item: NormalizedItem) {
  return selectedList.value.includes(item.value)
}

function isItemDisabled(item: NormalizedItem) {
  return disabled.value || item.disabled
}

function toggle(item: NormalizedItem) {
  if (isItemDisabled(item))
    return
  const checked = isChecked(item)
  if (props.multiple)
    setValue(checked ? selectedList.value.filter(v => v !== item.value) : [...selectedList.value, item.value])
  else
    setValue(checked ? [] : [item.value])
}

function handleKeydown(event: KeyboardEvent, item: NormalizedItem) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle(item)
  }
}

function getContext(item: NormalizedItem, index: number): SelectorItemContext {
  return { option: item.option, index, checked: isChecked(item), disabled: isItemDisabled(item) }
}

const classNames = computed(() => [
  'am-selector',
  {
    'am-selector-multiple': props.multiple,
    'am-selector-disabled': disabled.value,
    'am-selector-grid': !!props.columns,
  },
  props.rootClass,
  props.classes?.root,
])

const rootStyle = computed(() => [
  props.columns ? { '--am-selector-columns': props.columns } : undefined,
  props.styles?.root,
])
</script>

<template>
  <div
    v-bind="$attrs"
    :id="id ?? formItem.id.value"
    :class="classNames"
    :style="rootStyle"
    :role="multiple ? 'group' : 'radiogroup'"
    :aria-disabled="disabled || undefined"
  >
    <div
      v-for="(item, index) in items"
      :key="item.key"
      class="am-selector-item"
      :class="[
        { 'am-selector-item-active': isChecked(item), 'am-selector-item-disabled': isItemDisabled(item) },
        classes?.item,
      ]"
      :style="styles?.item"
      :role="multiple ? 'checkbox' : 'radio'"
      :tabindex="isItemDisabled(item) ? -1 : 0"
      :aria-checked="isChecked(item)"
      :aria-disabled="isItemDisabled(item) || undefined"
      @click="toggle(item)"
      @keydown="handleKeydown($event, item)"
      @blur="formItem.onFieldBlur()"
    >
      <div class="am-selector-item-label" :class="classes?.label" :style="styles?.label">
        <slot name="label" v-bind="getContext(item, index)">
          <RenderNode :node="item.label" />
        </slot>
      </div>
      <div
        v-if="$slots.description || isRenderable(item.description)"
        class="am-selector-item-description"
        :class="classes?.description"
        :style="styles?.description"
      >
        <slot name="description" v-bind="getContext(item, index)">
          <RenderNode :node="item.description" />
        </slot>
      </div>
      <div v-if="showCheckMark && isChecked(item)" class="am-selector-check-mark" aria-hidden="true">
        <slot name="checkMark" v-bind="getContext(item, index)">
          <CheckOutlined />
        </slot>
      </div>
    </div>
  </div>
</template>
