import type { CSSProperties } from 'vue'
import type { RenderNodeFn } from '../_util/type'

export type PickerValue = string | number

export interface PickerOption {
  label?: string | number
  value?: PickerValue
  disabled?: boolean
  [key: string]: any
}

export interface PickerFieldNames {
  label?: string
  value?: string
  disabled?: string
}

export type PickerColumn = PickerOption[]
/** Static columns, or a function of the current value for cascading columns. */
export type PickerColumns = PickerColumn[] | ((value: PickerValue[]) => PickerColumn[])

export interface PickerChangeInfo {
  /** Selected option of every column (the raw option objects passed in `columns`) */
  items: (PickerOption | undefined)[]
  /** Index of the column that was moved */
  columnIndex?: number
}

export interface PickerOptionRenderInfo {
  option: PickerOption
  index: number
  columnIndex: number
  selected: boolean
}

export interface PickerViewSemanticClassNames {
  root?: string
  column?: string
  item?: string
  indicator?: string
}

export interface PickerViewSemanticStyles {
  root?: CSSProperties
  column?: CSSProperties
  item?: CSSProperties
  indicator?: CSSProperties
}

export interface PickerViewProps {
  /** `PickerOption[][]`, or `(value) => PickerOption[][]` for cascading columns */
  columns?: PickerColumns
  fieldNames?: PickerFieldNames
  /** One value per column. Supports `v-model:value`. */
  value?: PickerValue[]
  defaultValue?: PickerValue[]
  loading?: boolean
  /** Height of one option in px */
  itemHeight?: number
  /** Number of visible options (odd numbers look best) */
  visibleItemCount?: number
  /** Custom option content, the `option` slot wins */
  optionRender?: RenderNodeFn<PickerOptionRenderInfo>
  /** Only mount the options around the visible window of every column. `false` renders all of them. Default `true`. */
  virtual?: boolean
  rootClass?: string
  classes?: PickerViewSemanticClassNames
  styles?: PickerViewSemanticStyles
}

export interface PickerViewEmits {
  'update:value': [value: PickerValue[]]
  'change': [value: PickerValue[], info: PickerChangeInfo]
}

export interface PickerViewSlots {
  option?: (info: PickerOptionRenderInfo) => any
  loading?: () => any
}
