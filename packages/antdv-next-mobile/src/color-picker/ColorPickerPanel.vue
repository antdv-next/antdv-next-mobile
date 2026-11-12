<script setup lang="ts">
import type { AggregationColor } from './color'
import type {
  ColorPickerFormat,
  ColorPickerPanelEmits,
  ColorPickerPanelProps,
  ColorPickerPanelSlots,
  ColorPickerValueType,
} from './interface'
import { computed, shallowRef } from 'vue'
import { useControlled } from '../_util/hooks'
import { useFormItemInputContext } from '../form/context'
import { formatColor, generateColor } from './color'
import PanelBody from './PanelBody.vue'

defineOptions({ name: 'AmColorPickerPanel', inheritAttrs: false })

const props = withDefaults(defineProps<ColorPickerPanelProps>(), {
  value: undefined,
  allowClear: false,
  disabled: undefined,
  disabledAlpha: false,
  disabledFormat: false,
})
const emit = defineEmits<ColorPickerPanelEmits>()
defineSlots<ColorPickerPanelSlots>()

const formItem = useFormItemInputContext()

const [value, setValue] = useControlled<ColorPickerPanelProps, 'value', ColorPickerValueType>(props, 'value', {
  defaultValue: () => props.defaultValue ?? null,
})
const [format, setFormat] = useControlled<ColorPickerPanelProps, 'format', ColorPickerFormat>(props, 'format', {
  defaultValue: () => props.defaultFormat ?? 'hex',
  onChange: (next) => {
    emit('update:format', next)
    emit('formatChange', next)
  },
})

/** keeps the `cleared` flag / hue of the color emitted last when it comes back as a string */
const cache = shallowRef<AggregationColor>()
const color = computed(() => {
  const next = generateColor(value.value ?? '')
  return cache.value && next.equals(cache.value) ? cache.value : next
})

function toValue(next: AggregationColor): ColorPickerValueType {
  if (!props.valueFormat)
    return next
  return typeof props.valueFormat === 'function' ? props.valueFormat(next) : formatColor(next, props.valueFormat)
}

function onChange(next: AggregationColor) {
  cache.value = next
  const output = toValue(next)
  setValue(output)
  emit('update:value', output)
  emit('change', next, next.toCssString())
  formItem.onFieldChange()
}

function onClear(next: AggregationColor) {
  onChange(next)
  emit('changeComplete', next)
  emit('clear')
}
</script>

<template>
  <PanelBody
    v-bind="$attrs"
    :color="color"
    :format="format"
    :allow-clear="allowClear"
    :disabled="disabled"
    :disabled-alpha="disabledAlpha"
    :disabled-format="disabledFormat"
    :presets="presets"
    :panel-render="panelRender"
    :root-class="rootClass"
    :classes="classes"
    :styles="styles"
    @change="onChange"
    @change-complete="emit('changeComplete', $event)"
    @clear="onClear"
    @format-change="setFormat"
  >
    <template v-if="$slots.panelRender" #panelRender="info">
      <slot name="panelRender" v-bind="info" />
    </template>
  </PanelBody>
</template>
