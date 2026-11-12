import type { CSSProperties } from 'vue'
import type { GetContainer, RenderNodeFn, SizeType, ValidateStatus, VueNode } from '../_util/type'
import type { Variant } from '../form/context'
import type {
  PickerChangeInfo,
  PickerColumns,
  PickerFieldNames,
  PickerOption,
  PickerOptionRenderInfo,
  PickerValue,
} from '../picker-view/interface'

export interface PickerFieldSemanticClassNames {
  /** the trigger */
  root?: string
  /** value / placeholder text of the trigger */
  content?: string
  suffix?: string
  /** body of the bottom popup */
  popup?: string
}

export interface PickerFieldSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  suffix?: CSSProperties
  popup?: CSSProperties
}

/** Props shared by every "picker field" (Picker / DatePicker / TimePicker / Cascader / Select / Calendar). */
export interface PickerFieldProps {
  /** Whether the popup is open. Supports `v-model:open`. */
  open?: boolean
  defaultOpen?: boolean
  placeholder?: string
  disabled?: boolean
  /** Show a clear icon when there is a value */
  allowClear?: boolean
  status?: ValidateStatus
  variant?: Variant
  size?: SizeType
  /** Render the built-in input-like trigger. `false`: control the popup with `v-model:open` only. */
  trigger?: boolean
  /** Suffix icon of the trigger, the `suffixIcon` slot wins. `null` hides it. */
  suffixIcon?: VueNode
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
  /** Unmount the popup content when closed */
  destroyOnHidden?: boolean
  rootClass?: string
  classes?: PickerFieldSemanticClassNames
  styles?: PickerFieldSemanticStyles
}

/** Slot params of the default (custom trigger) slot. */
export interface PickerTriggerSlotProps<V = any> {
  open: boolean
  value: V
  /** text shown by the built-in trigger (`''` when empty) */
  label: string
  disabled: boolean
  toggle: (open?: boolean) => void
}

export interface PickerProps extends PickerFieldProps {
  /** `PickerOption[][]`, or `(value) => PickerOption[][]` for cascading columns */
  columns?: PickerColumns
  fieldNames?: PickerFieldNames
  /** Committed value, one per column. Supports `v-model:value`. */
  value?: PickerValue[]
  defaultValue?: PickerValue[]
  loading?: boolean
  itemHeight?: number
  visibleItemCount?: number
  optionRender?: RenderNodeFn<PickerOptionRenderInfo>
  /** Text of the trigger, default joins the labels with ` / ` */
  format?: (items: (PickerOption | undefined)[]) => string
}

export interface PickerEmits {
  'update:value': [value: PickerValue[]]
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  /** The committed value changed (confirm or clear) */
  'change': [value: PickerValue[], info: PickerChangeInfo]
  /** A wheel moved, the value is not committed yet */
  'select': [value: PickerValue[], info: PickerChangeInfo]
  'confirm': [value: PickerValue[], info: PickerChangeInfo]
  'cancel': []
  'clear': []
}

export interface PickerSlots {
  /** Custom trigger */
  default?: (props: PickerTriggerSlotProps<PickerValue[]> & { items: (PickerOption | undefined)[] }) => any
  title?: () => any
  suffixIcon?: () => any
  option?: (info: PickerOptionRenderInfo) => any
  /** Content between the header and the wheels */
  header?: () => any
  /** Content below the wheels */
  footer?: () => any
}

export type { PickerChangeInfo, PickerColumn, PickerColumns, PickerFieldNames, PickerOption, PickerOptionRenderInfo, PickerValue } from '../picker-view/interface'
