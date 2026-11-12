<script setup lang="ts">
import type { VNodeChild } from 'vue'
import type { AggregationColor } from './color'
import type { ColorDragInfo } from './context'
import type {
  ColorPickerFormat,
  ColorPickerPanelRenderExtra,
  ColorPickerPanelRenderInfo,
  ColorPickerPanelSemanticClassNames,
  ColorPickerPanelSemanticStyles,
  ColorPickerPresetsItem,
} from './interface'
import { computed, h, provide, shallowRef } from 'vue'
import { provideNoCompact } from '../_base/compact'
import RenderNode from '../_util/RenderNode'
import { useDisabled } from '../config-provider/context'
import { formItemInputContextKey } from '../form/context'
import { genAlphaColor, genClearColor, generateColor, getColorAlpha } from './color'
import { provideColorPickerPanelContext } from './context'
import PanelContent from './PanelContent.vue'
import PanelPicker from './PanelPicker.vue'
import PanelPresets from './PanelPresets.vue'
import '../style'
import './style/index.css'

/**
 * Internal: the stateless panel shared by `ColorPickerPanel` (inline) and `ColorPicker` (bottom sheet).
 * It shows `color` and reports what the user picked; the owner decides when that is committed.
 */
defineOptions({ name: 'AmColorPickerPanelBody', inheritAttrs: false })

const props = withDefaults(defineProps<{
  color: AggregationColor
  format: ColorPickerFormat
  allowClear?: boolean
  disabled?: boolean
  disabledAlpha?: boolean
  disabledFormat?: boolean
  presets?: ColorPickerPresetsItem[]
  panelRender?: (info: ColorPickerPanelRenderInfo) => VNodeChild
  rootClass?: string
  classes?: ColorPickerPanelSemanticClassNames
  styles?: ColorPickerPanelSemanticStyles
}>(), {
  disabled: undefined,
})
const emit = defineEmits<{
  change: [color: AggregationColor, dragging: boolean]
  changeComplete: [color: AggregationColor]
  clear: [color: AggregationColor]
  formatChange: [format: ColorPickerFormat]
}>()
defineSlots<{ panelRender?: (info: ColorPickerPanelRenderInfo) => any }>()

const disabled = useDisabled(() => props.disabled)

// The inputs of the panel are not fields of the surrounding FormItem / Space.Compact.
provide(formItemInputContextKey, {
  status: computed(() => '' as const),
  id: computed(() => undefined),
  onFieldChange: () => {},
  onFieldBlur: () => {},
  isFormItemInput: false,
})
provideNoCompact()

/**
 * The last color picked here. It carries what a string round trip through the owner loses
 * (the hue of a grey / black color, the `cleared` flag), so it wins while it is still the same color.
 */
const local = shallowRef<AggregationColor>()
const color = computed(() => {
  const cached = local.value
  return cached && cached.equals(props.color) && cached.cleared === props.color.cleared ? cached : props.color
})

function fill(next: AggregationColor, info?: ColorDragInfo) {
  let result = next
  if (color.value.cleared) {
    const rgb = result.toRgb()
    // picking on a cleared color starts from a fully saturated, opaque one
    if (!rgb.r && !rgb.g && !rgb.b && info) {
      result = generateColor({
        h: info.type === 'hue' ? info.value : 0,
        s: 1,
        b: 1,
        a: info.type === 'alpha' ? info.value / 100 : 1,
      })
    }
    else {
      result = genAlphaColor(result)
    }
  }
  if (props.disabledAlpha && getColorAlpha(result) < 100)
    result = genAlphaColor(result)
  return result
}

function change(next: AggregationColor, dragging = false, info?: ColorDragInfo) {
  if (disabled.value)
    return
  const result = fill(next, info)
  local.value = result
  emit('change', result, dragging)
  if (!dragging)
    emit('changeComplete', result)
}

function changeComplete() {
  if (!disabled.value)
    emit('changeComplete', local.value ?? color.value)
}

function clear() {
  if (disabled.value || color.value.cleared)
    return
  const result = genClearColor(color.value)
  local.value = result
  emit('clear', result)
}

provideColorPickerPanelContext({
  color,
  format: computed(() => props.format),
  disabled,
  allowClear: computed(() => !!props.allowClear),
  disabledAlpha: computed(() => !!props.disabledAlpha),
  disabledFormat: computed(() => !!props.disabledFormat),
  presets: computed(() => props.presets),
  classes: computed(() => props.classes),
  styles: computed(() => props.styles),
  change,
  changeComplete,
  clear,
  setFormat: (format) => {
    if (format !== props.format)
      emit('formatChange', format)
  },
})

const extra: ColorPickerPanelRenderExtra = { components: { Picker: PanelPicker, Presets: PanelPresets } }
/** a fresh vnode per render, like the `panel` of antdv-next */
const renderInfo = (): ColorPickerPanelRenderInfo => ({ panel: h(PanelContent), extra })
</script>

<template>
  <div
    v-bind="$attrs"
    class="am-color-picker-panel"
    :class="[{ 'am-color-picker-panel-disabled': disabled }, rootClass, classes?.root]"
    :style="styles?.root"
  >
    <slot name="panelRender" v-bind="renderInfo()">
      <RenderNode v-if="panelRender" :node="panelRender" :params="renderInfo()" />
      <PanelContent v-else />
    </slot>
  </div>
</template>
