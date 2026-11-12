import type { CSSProperties, VNodeChild } from 'vue'
import type { RenderNodeFn, VueNode } from '../_util/type'
import type { PickerFieldProps, PickerTriggerSlotProps } from '../picker/interface'

export type CascaderValue = string | number

export interface CascaderOption {
  label?: string | number
  value?: CascaderValue
  disabled?: boolean
  /** `false` + `loadData`: children are loaded when the option is selected */
  isLeaf?: boolean
  children?: CascaderOption[]
  [key: string]: any
}

export interface CascaderFieldNames {
  label?: string
  value?: string
  children?: string
}

export interface CascaderOptionRenderInfo {
  option: CascaderOption
  /** 0-based level of the option */
  level: number
  selected: boolean
}

export interface CascaderViewSemanticClassNames {
  root?: string
  tabs?: string
  tab?: string
  list?: string
  option?: string
}

export interface CascaderViewSemanticStyles {
  root?: CSSProperties
  tabs?: CSSProperties
  tab?: CSSProperties
  list?: CSSProperties
  option?: CSSProperties
}

export interface CascaderBaseProps {
  options?: CascaderOption[]
  fieldNames?: CascaderFieldNames
  /** Emit `change` on every level instead of only when a leaf is selected */
  changeOnSelect?: boolean
  /** Lazy load children of an option with `isLeaf: false`. Set `children` on the target option, optionally return a promise. */
  loadData?: (selectedOptions: CascaderOption[]) => void | Promise<void>
  /** Custom option content, the `option` slot wins */
  optionRender?: RenderNodeFn<CascaderOptionRenderInfo>
  /** Content shown when a level has no options, the `notFoundContent` slot wins */
  notFoundContent?: VueNode
}

export interface CascaderViewProps extends CascaderBaseProps {
  /** Path of values. Supports `v-model:value`. */
  value?: CascaderValue[]
  defaultValue?: CascaderValue[]
  /** Text of the tab of a level that has no selection yet */
  placeholder?: string
  rootClass?: string
  classes?: CascaderViewSemanticClassNames
  styles?: CascaderViewSemanticStyles
}

export interface CascaderViewEmits {
  'update:value': [value: CascaderValue[]]
  'change': [value: CascaderValue[], selectedOptions: CascaderOption[]]
  /** An option was tapped (fires for every level) */
  'select': [option: CascaderOption, level: number]
  /** A leaf was selected: the path is complete */
  'finish': [value: CascaderValue[], selectedOptions: CascaderOption[]]
  'tabChange': [index: number]
}

export interface CascaderViewSlots {
  option?: (info: CascaderOptionRenderInfo) => any
  notFoundContent?: () => any
}

export interface CascaderProps extends CascaderBaseProps, PickerFieldProps {
  /** Committed path of values. Supports `v-model:value`. */
  value?: CascaderValue[]
  defaultValue?: CascaderValue[]
  /** Text of the trigger, default joins the labels with ` / `. The `displayRender` slot wins. */
  displayRender?: (labels: string[], selectedOptions: CascaderOption[]) => VNodeChild
}

export interface CascaderEmits {
  'update:value': [value: CascaderValue[]]
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  /** The committed value changed */
  'change': [value: CascaderValue[], selectedOptions: CascaderOption[]]
  'select': [option: CascaderOption, level: number]
  'confirm': [value: CascaderValue[], selectedOptions: CascaderOption[]]
  'cancel': []
  'clear': []
  'tabChange': [index: number]
}

export interface CascaderSlots {
  /** Custom trigger */
  default?: (props: PickerTriggerSlotProps<CascaderValue[]> & { selectedOptions: CascaderOption[] }) => any
  title?: () => any
  suffixIcon?: () => any
  displayRender?: (props: { labels: string[], selectedOptions: CascaderOption[] }) => any
  option?: (info: CascaderOptionRenderInfo) => any
  notFoundContent?: () => any
}
