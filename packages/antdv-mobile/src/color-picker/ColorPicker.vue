<script setup lang="ts">
import type { AggregationColor } from './color'
import type {
  ColorPickerEmits,
  ColorPickerExpose,
  ColorPickerFormat,
  ColorPickerProps,
  ColorPickerSlots,
  ColorPickerValueType,
} from './interface'
import { computed, shallowRef, watch } from 'vue'
import { useControlled } from '../_util/hooks'
import RenderNode from '../_util/RenderNode'
import { useLocale } from '../locale'
import PickerPopup from '../picker/PickerPopup.vue'
import PickerTrigger from '../picker/PickerTrigger.vue'
import { usePickerField } from '../picker/usePickerField'
import { formatColor, generateColor, getColorAlpha } from './color'
import ColorBlock from './ColorBlock.vue'
import PanelBody from './PanelBody.vue'
import '../style'
import './style/index.css'

defineOptions({ name: 'AmColorPicker', inheritAttrs: false })

const props = withDefaults(defineProps<ColorPickerProps>(), {
  value: undefined,
  allowClear: false,
  disabled: undefined,
  disabledAlpha: false,
  disabledFormat: false,
  open: undefined,
  defaultOpen: false,
  showText: false,
  destroyOnHidden: false,
  getContainer: undefined,
  maskClosable: true,
})
const emit = defineEmits<ColorPickerEmits>()
const slots = defineSlots<ColorPickerSlots>()

const locale = useLocale('ColorPicker')

const { open, setOpen, toggle, disabled, commit } = usePickerField(props, (value) => {
  emit('update:open', value)
  emit('openChange', value)
})

const [value, setValue] = useControlled<ColorPickerProps, 'value', ColorPickerValueType>(props, 'value', {
  defaultValue: () => props.defaultValue ?? null,
})
const [format, setFormat] = useControlled<ColorPickerProps, 'format', ColorPickerFormat>(props, 'format', {
  defaultValue: () => props.defaultFormat ?? 'hex',
  onChange: (next) => {
    emit('update:format', next)
    emit('formatChange', next)
  },
})

/** keeps the `cleared` flag / hue of the color committed last when it comes back as a string */
const cache = shallowRef<AggregationColor>()
const color = computed(() => {
  const next = generateColor(value.value ?? '')
  return cache.value && next.equals(cache.value) ? cache.value : next
})

/** text of the trigger */
const label = computed(() => {
  const current = color.value
  if (current.cleared)
    return locale.value.transparent
  if (format.value === 'rgb')
    return current.toRgbString()
  if (format.value === 'hsb')
    return current.toHsbString()
  const hex = current.toHexString().toUpperCase()
  const alpha = getColorAlpha(current)
  return alpha < 100 ? `${hex.slice(0, 7)},${alpha}%` : hex
})
const hasText = computed(() => !!slots.showText || !!props.showText)

/** color of the panel while the popup is open, committed on confirm */
const pending = shallowRef<AggregationColor>(color.value)

watch(open, (val) => {
  if (val)
    pending.value = color.value
})
watch(color, (val) => {
  pending.value = val
})

const isSame = (a: AggregationColor, b: AggregationColor) => a.equals(b) && a.cleared === b.cleared

function update(next: AggregationColor) {
  cache.value = next
  let output: ColorPickerValueType = next
  if (props.valueFormat)
    output = typeof props.valueFormat === 'function' ? props.valueFormat(next) : formatColor(next, props.valueFormat)
  setValue(output)
  emit('update:value', output)
  emit('change', next, next.toCssString())
  if (next.cleared)
    emit('clear')
  commit()
}

function onSelect(next: AggregationColor) {
  pending.value = next
  emit('select', next, next.toCssString())
}

function onPanelClear(next: AggregationColor) {
  onSelect(next)
  emit('changeComplete', next)
}

function onConfirm() {
  const next = pending.value
  if (!isSame(next, color.value))
    update(next)
  emit('confirm', next)
  setOpen(false)
}

function onCancel() {
  emit('cancel')
  setOpen(false)
}

defineExpose<ColorPickerExpose>({ toggle })
</script>

<template>
  <slot v-if="$slots.default" :open="open" :value="color" :label="label" :disabled="disabled" :toggle="toggle" />
  <PickerTrigger
    v-else
    v-bind="$attrs"
    :id="id"
    class="am-color-picker"
    :label="label"
    :open="open"
    :disabled="disabled"
    :size="size"
    :suffix-icon="null"
    :root-class="rootClass"
    :classes="{ root: classes?.root }"
    :styles="{ root: styles?.root }"
    @click="toggle()"
  >
    <ColorBlock
      class="am-color-picker-trigger-block"
      :class="classes?.body"
      :style="styles?.body"
      :color="color.toCssString()"
      :cleared="color.cleared"
      :inner-class="classes?.content"
      :inner-style="styles?.content"
    />
    <span v-if="hasText" class="am-color-picker-trigger-text" :class="classes?.description" :style="styles?.description">
      <slot name="showText" :color="color">
        <RenderNode v-if="typeof showText === 'function'" :node="showText" :params="{ color }" />
        <template v-else>
          {{ label }}
        </template>
      </slot>
    </span>
  </PickerTrigger>
  <PickerPopup
    :open="open"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    :get-container="getContainer"
    :z-index="zIndex"
    :mask-closable="maskClosable"
    :destroy-on-hidden="destroyOnHidden"
    :root-class="rootClass"
    :popup-class="classes?.popup"
    :popup-style="styles?.popup"
    @confirm="onConfirm"
    @cancel="onCancel"
  >
    <template v-if="$slots.title" #title>
      <slot name="title" />
    </template>
    <PanelBody
      class="am-color-picker-popup-panel"
      :color="pending"
      :format="format"
      :allow-clear="allowClear"
      :disabled="disabled"
      :disabled-alpha="disabledAlpha"
      :disabled-format="disabledFormat"
      :presets="presets"
      :panel-render="panelRender"
      @change="onSelect"
      @change-complete="emit('changeComplete', $event)"
      @clear="onPanelClear"
      @format-change="setFormat"
    >
      <template v-if="$slots.panelRender" #panelRender="info">
        <slot name="panelRender" v-bind="info" />
      </template>
    </PanelBody>
  </PickerPopup>
</template>
