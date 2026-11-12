import type { RenderNodeFn, VueNode } from '../_util/type'
import type { PickerFieldProps, PickerTriggerSlotProps } from '../picker/interface'

export type SelectValue = string | number

export interface SelectOption {
  label?: string | number
  value?: SelectValue
  disabled?: boolean
  /** Secondary text below the label */
  description?: string
  /** Makes the entry a group: `{ label, options }` */
  options?: SelectOption[]
  [key: string]: any
}

export interface SelectFieldNames {
  label?: string
  value?: string
  /** key of the children of a group */
  options?: string
}

export interface SelectLabeledValue {
  label: string | number
  value: SelectValue
}

/** single: a value; multiple: a list. With `labelInValue` every value is `{ label, value }`. */
export type SelectValueType = SelectValue | SelectLabeledValue | SelectValue[] | SelectLabeledValue[]

export type SelectFilterOption = boolean | ((input: string, option: SelectOption) => boolean)

export interface SelectSearchConfig {
  placeholder?: string
  filterOption?: SelectFilterOption
  /** Focus the search input when the popup opens (raises the keyboard) */
  autoFocus?: boolean
}

export interface SelectOptionRenderInfo {
  option: SelectOption
  index: number
  selected: boolean
}

export interface SelectProps extends PickerFieldProps {
  options?: SelectOption[]
  fieldNames?: SelectFieldNames
  /** Committed value. Supports `v-model:value`. */
  value?: SelectValueType | null
  defaultValue?: SelectValueType | null
  /** `multiple`: checklist with a confirm button. Default: pick one and close. */
  mode?: 'multiple'
  /** Bind `{ label, value }` objects instead of raw values */
  labelInValue?: boolean
  /** Show a search input at the top of the popup */
  showSearch?: boolean | SelectSearchConfig
  /** `false` disables local filtering (remote search); a function customises it */
  filterOption?: SelectFilterOption
  /** Custom option content, the `option` slot wins */
  optionRender?: RenderNodeFn<SelectOptionRenderInfo>
  /** Custom label of a selected value in the trigger, the `labelRender` slot wins */
  labelRender?: RenderNodeFn<SelectLabeledValue>
  /** Content shown when there is no option, the `notFoundContent` slot wins */
  notFoundContent?: VueNode
  /** multiple: max number of selected options */
  maxCount?: number
  /** multiple: max number of labels shown in the trigger */
  maxTagCount?: number
  /** Text for the labels hidden by `maxTagCount`, default `+N...` */
  maxTagPlaceholder?: RenderNodeFn<SelectLabeledValue[]>
  loading?: boolean
  /** Only mount the options around the visible window (through `VirtualList`). `false` renders every option. Default `true`. */
  virtual?: boolean
  /** Max height of the option list in the popup. Default `360` (`--am-select-list-max-height`). */
  listHeight?: number | string
  /** Height of one option in px: the min-height of an option and the estimate used before a row is measured. Default `48`. */
  listItemHeight?: number
}

export interface SelectEmits {
  'update:value': [value: SelectValueType | null]
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  /** The committed value changed */
  'change': [value: SelectValueType | null, option: SelectOption | SelectOption[] | undefined]
  /** An option was picked (multiple: checked, not committed yet) */
  'select': [value: SelectValue, option: SelectOption]
  /** multiple: an option was unchecked (not committed yet) */
  'deselect': [value: SelectValue, option: SelectOption]
  'search': [value: string]
  'confirm': [value: SelectValueType | null]
  'cancel': []
  'clear': []
}

export interface SelectSlots {
  /** Custom trigger */
  default?: (props: PickerTriggerSlotProps<SelectValueType | null>) => any
  title?: () => any
  suffixIcon?: () => any
  option?: (info: SelectOptionRenderInfo) => any
  labelRender?: (item: SelectLabeledValue) => any
  notFoundContent?: () => any
}
