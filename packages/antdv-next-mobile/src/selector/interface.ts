import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type SelectorValue = string | number

export interface SelectorOption {
  label?: VueNode
  description?: VueNode
  value?: SelectorValue
  disabled?: boolean
  [key: string]: any
}

export interface SelectorFieldNames {
  label?: string
  description?: string
  value?: string
  disabled?: string
}

export interface SelectorChangeExtra {
  /** The selected options, in the order of `value` */
  items: SelectorOption[]
}

export interface SelectorItemContext {
  option: SelectorOption
  index: number
  checked: boolean
  disabled: boolean
}

export interface SelectorSemanticClassNames {
  root?: string
  item?: string
  label?: string
  description?: string
}

export interface SelectorSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  label?: CSSProperties
  description?: CSSProperties
}

export interface SelectorProps {
  options?: SelectorOption[]
  /** Selected values (always an array), supports `v-model:value` */
  value?: SelectorValue[]
  defaultValue?: SelectorValue[]
  multiple?: boolean
  /** Number of columns; without it items wrap by their own width */
  columns?: number
  /** Show the check mark in the corner of selected items */
  showCheckMark?: boolean
  disabled?: boolean
  /** Custom field names of `label` / `description` / `value` / `disabled` in `options` */
  fieldNames?: SelectorFieldNames
  id?: string
  rootClass?: string
  classes?: SelectorSemanticClassNames
  styles?: SelectorSemanticStyles
}

export interface SelectorEmits {
  'update:value': [value: SelectorValue[]]
  'change': [value: SelectorValue[], extra: SelectorChangeExtra]
}

export interface SelectorSlots {
  /** Custom label of every option */
  label?: (ctx: SelectorItemContext) => any
  /** Custom description of every option */
  description?: (ctx: SelectorItemContext) => any
  /** Custom check mark */
  checkMark?: (ctx: SelectorItemContext) => any
}
