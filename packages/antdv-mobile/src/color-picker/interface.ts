import type { Component, CSSProperties, VNode, VNodeChild } from 'vue'
import type { GetContainer, Key, SizeType, VueNode } from '../_util/type'
import type { AggregationColor } from './color'

export type { AggregationColor, ColorPickerColorInput, ColorPickerHSB, ColorPickerRGB } from './color'

/** Same name as antdv-next: the color object handed to events, `showText` and `v-model:value`. */
export type Color = AggregationColor

export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb'
export type ColorPickerValueFormat = ColorPickerFormat | ((color: AggregationColor) => string)

/** `null` / `''` means "no color" (cleared) */
export type ColorPickerValueType = AggregationColor | string | null

export interface ColorPickerPresetsItem {
  label: VueNode
  colors: (string | AggregationColor)[]
  /** Whether the group is expanded initially. Default `true`. */
  defaultOpen?: boolean
  key?: Key
}

export interface ColorPickerShowTextInfo {
  color: AggregationColor
}

export interface ColorPickerPanelRenderExtra {
  components: {
    /** palette + sliders + inputs */
    Picker: Component
    /** preset groups */
    Presets: Component
  }
}

export interface ColorPickerPanelRenderInfo {
  /** The default panel, render it with `<component :is="panel" />` */
  panel: VNode
  extra: ColorPickerPanelRenderExtra
}

// ---------- panel ----------
export interface ColorPickerPanelSemanticClassNames {
  root?: string
  /** saturation / brightness square */
  palette?: string
  /** hue and alpha sliders */
  slider?: string
  /** format switch + value inputs */
  input?: string
  presets?: string
}

export interface ColorPickerPanelSemanticStyles {
  root?: CSSProperties
  palette?: CSSProperties
  slider?: CSSProperties
  input?: CSSProperties
  presets?: CSSProperties
}

export interface ColorPickerPanelProps {
  /** Current color. Supports `v-model:value`. */
  value?: ColorPickerValueType
  defaultValue?: ColorPickerValueType
  /** What `update:value` hands out: a format name or a function. Default: the `Color` object. */
  valueFormat?: ColorPickerValueFormat
  /** Format of the value inputs. Supports `v-model:format`. */
  format?: ColorPickerFormat
  defaultFormat?: ColorPickerFormat
  /** Show a clear button */
  allowClear?: boolean
  disabled?: boolean
  /** Hide the alpha slider and input, colors are always opaque */
  disabledAlpha?: boolean
  /** Hide the format switch */
  disabledFormat?: boolean
  presets?: ColorPickerPresetsItem[]
  /** Custom panel content, the `panelRender` slot wins */
  panelRender?: (info: ColorPickerPanelRenderInfo) => VNodeChild
  rootClass?: string
  classes?: ColorPickerPanelSemanticClassNames
  styles?: ColorPickerPanelSemanticStyles
}

export interface ColorPickerPanelEmits {
  'update:value': [value: ColorPickerValueType]
  'update:format': [format: ColorPickerFormat]
  /** The color changed (continuously while dragging) */
  'change': [color: AggregationColor, css: string]
  /** A drag ended, or a change that is not a drag happened */
  'changeComplete': [color: AggregationColor]
  'formatChange': [format: ColorPickerFormat]
  'clear': []
}

export interface ColorPickerPanelSlots {
  panelRender?: (info: ColorPickerPanelRenderInfo) => any
}

// ---------- picker field ----------
export interface ColorPickerSemanticClassNames {
  /** the trigger */
  root?: string
  /** color block of the trigger */
  body?: string
  /** the colored inner part of the block */
  content?: string
  /** text of the trigger (`showText`) */
  description?: string
  /** body of the bottom popup */
  popup?: string
}

export interface ColorPickerSemanticStyles {
  root?: CSSProperties
  body?: CSSProperties
  content?: CSSProperties
  description?: CSSProperties
  popup?: CSSProperties
}

export interface ColorPickerProps {
  /** Committed color. Supports `v-model:value`. */
  value?: ColorPickerValueType
  defaultValue?: ColorPickerValueType
  /** What `update:value` hands out: a format name or a function. Default: the `Color` object. */
  valueFormat?: ColorPickerValueFormat
  /** Format of the value inputs and of the trigger text. Supports `v-model:format`. */
  format?: ColorPickerFormat
  defaultFormat?: ColorPickerFormat
  /** Show a clear button in the panel */
  allowClear?: boolean
  disabled?: boolean
  /** Hide the alpha slider and input, colors are always opaque */
  disabledAlpha?: boolean
  /** Hide the format switch */
  disabledFormat?: boolean
  /** Whether the popup is open. Supports `v-model:open`. */
  open?: boolean
  defaultOpen?: boolean
  presets?: ColorPickerPresetsItem[]
  /** Show the color text next to the block, or render it. The `showText` slot wins. */
  showText?: boolean | ((info: ColorPickerShowTextInfo) => VNodeChild)
  size?: SizeType
  /** Custom panel content, the `panelRender` slot wins */
  panelRender?: (info: ColorPickerPanelRenderInfo) => VNodeChild
  /** Unmount the popup content when closed */
  destroyOnHidden?: boolean
  id?: string
  /** Title of the popup header, the `title` slot wins */
  title?: VueNode
  okText?: string
  cancelText?: string
  /** Teleport target of the popup. Default `document.body`; `false` renders in place. */
  getContainer?: GetContainer
  zIndex?: number
  /** Close (cancel) when the mask is clicked */
  maskClosable?: boolean
  rootClass?: string
  classes?: ColorPickerSemanticClassNames
  styles?: ColorPickerSemanticStyles
}

export interface ColorPickerEmits {
  'update:value': [value: ColorPickerValueType]
  'update:open': [open: boolean]
  'update:format': [format: ColorPickerFormat]
  /** The committed color changed (confirm) */
  'change': [color: AggregationColor, css: string]
  /** A drag ended, or a change that is not a drag happened in the panel. The color is not committed yet. */
  'changeComplete': [color: AggregationColor]
  'formatChange': [format: ColorPickerFormat]
  'openChange': [open: boolean]
  /** The committed color was cleared */
  'clear': []
  /** The pending color of the open panel changed, it is not committed yet */
  'select': [color: AggregationColor, css: string]
  'confirm': [color: AggregationColor]
  'cancel': []
}

export interface ColorPickerTriggerSlotProps {
  open: boolean
  /** the committed color */
  value: AggregationColor
  /** text the built-in trigger would show */
  label: string
  disabled: boolean
  toggle: (open?: boolean) => void
}

export interface ColorPickerSlots {
  /** Custom trigger */
  default?: (props: ColorPickerTriggerSlotProps) => any
  showText?: (info: ColorPickerShowTextInfo) => any
  panelRender?: (info: ColorPickerPanelRenderInfo) => any
  title?: () => any
}

export interface ColorPickerExpose {
  toggle: (open?: boolean) => void
}
