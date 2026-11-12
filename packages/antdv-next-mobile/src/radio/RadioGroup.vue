<script setup lang="ts">
import type { RadioChangeEvent, RadioGroupEmits, RadioGroupProps, RadioGroupSlots, RadioOptionType } from './interface'
import { computed, provide, useId } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useDisabled, useSize } from '../config-provider/context'
import { useFormItemInputContext } from '../form/context'
import { radioGroupContextKey } from './context'
import Radio from './Radio.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmRadioGroup', inheritAttrs: false })

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: undefined,
  block: undefined,
  vertical: undefined,
  buttonStyle: 'outline',
})
const emit = defineEmits<RadioGroupEmits>()
const slots = defineSlots<RadioGroupSlots>()

const formItem = useFormItemInputContext()
const disabled = useDisabled(() => props.disabled)
const size = useSize(() => props.size)
const defaultName = useId()

const [value, setValue] = useControlled<RadioGroupProps, 'value', any>(props, 'value', {
  defaultValue: () => props.defaultValue,
  onChange: val => emit('update:value', val),
})

const mergedOptions = computed<RadioOptionType[]>(() =>
  (props.options ?? []).map(option =>
    typeof option === 'string' || typeof option === 'number' ? { label: option, value: option } : option,
  ),
)

const isVertical = computed(() => props.vertical ?? props.orientation === 'vertical')
const isButton = computed(() => props.optionType === 'button')

function select(event: RadioChangeEvent) {
  const next = event.target.value
  if (next === value.value)
    return
  setValue(next)
  emit('change', event)
  formItem.onFieldChange()
}

provide(radioGroupContextKey, {
  value: computed(() => value.value),
  disabled,
  name: computed(() => props.name ?? defaultName),
  optionType: computed(() => props.optionType),
  buttonStyle: computed(() => props.buttonStyle),
  size,
  block: computed(() => props.block),
  classes: computed(() => props.classes),
  styles: computed(() => props.styles),
  iconSlot: () => slots.icon,
  select,
})

const classNames = computed(() => [
  'am-radio-group',
  `am-radio-group-${props.buttonStyle}`,
  {
    'am-radio-group-button': isButton.value,
    'am-radio-group-vertical': isVertical.value,
    'am-radio-group-block': props.block,
    'am-radio-group-sm': size.value === 'small',
    'am-radio-group-lg': size.value === 'large',
    'am-radio-group-disabled': disabled.value,
  },
  props.rootClass,
  props.classes?.root,
])
</script>

<template>
  <div
    v-bind="$attrs"
    :id="id ?? formItem.id.value"
    :class="classNames"
    :style="styles?.root"
    role="radiogroup"
    :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
    :aria-disabled="disabled || undefined"
  >
    <template v-if="mergedOptions.length">
      <Radio
        v-for="(option, index) in mergedOptions"
        :id="option.id"
        :key="`${typeof option.value}-${option.value}`"
        :value="option.value"
        :disabled="option.disabled"
        :title="option.title"
        :required="option.required"
        :class="option.class"
        :style="option.style"
      >
        <slot name="labelRender" :item="option" :index="index">
          <RenderNode v-if="labelRender" :node="labelRender" :params="{ item: option, index }" />
          <RenderNode v-else :node="option.label" />
        </slot>
      </Radio>
    </template>
    <slot v-else />
  </div>
</template>
