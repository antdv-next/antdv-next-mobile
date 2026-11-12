import type { Dayjs } from 'dayjs'
import type { GetContainer, SizeType, ValidateStatus, VueNode } from '../_util/type'
import type { Variant } from '../form/context'
import type { PickerOption, PickerViewSemanticClassNames, PickerViewSemanticStyles } from '../picker-view/interface'
import type { PickerFieldProps, PickerFieldSemanticClassNames, PickerFieldSemanticStyles, PickerTriggerSlotProps } from '../picker/interface'

/** A dayjs object, or a string in `valueFormat` when `valueFormat` is set. */
export type DatePickerValue = Dayjs | string

export type DatePickerMode = 'date' | 'month' | 'year' | 'quarter' | 'week' | 'time'

export type DatePickerColumnType = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'meridiem'

export interface DatePickerShowTime {
  /** Decides the time columns, e.g. `HH:mm:ss` | `HH:mm` | `h:mm a` */
  format?: string
  showHour?: boolean
  showMinute?: boolean
  showSecond?: boolean
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
}

export interface DatePickerDisabledTimes {
  disabledHours?: () => number[]
  disabledMinutes?: (hour: number) => number[]
  disabledSeconds?: (hour: number, minute: number) => number[]
}

export interface DatePickerBaseProps {
  /** Selection precision. `time` renders time wheels only (what TimePicker uses). */
  picker?: DatePickerMode
  /** Add time wheels to the date wheels (`picker="date"` only) */
  showTime?: boolean | DatePickerShowTime
  /** Display format of the value (dayjs format string or function). For `picker="time"` it also decides the columns. */
  format?: string | ((value: Dayjs) => string)
  /** Format of the bound value: when set, `value` accepts and `change` returns strings in this format */
  valueFormat?: string
  minDate?: DatePickerValue
  maxDate?: DatePickerValue
  /** Disabled dates are greyed out and skipped */
  disabledDate?: (current: Dayjs, info: { type: DatePickerMode }) => boolean
  disabledTime?: (date: Dayjs) => DatePickerDisabledTimes
  /** Date shown by the wheels when there is no value, default now */
  defaultPickerValue?: DatePickerValue
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  /** Filter / reorder the options of one column */
  filter?: (type: DatePickerColumnType, options: PickerOption[]) => PickerOption[]
  /** Custom option text, default appends the unit of the locale (`2024年`) */
  renderLabel?: (type: DatePickerColumnType, value: number) => string | number
  itemHeight?: number
  visibleItemCount?: number
  /** Only mount the wheel options around the visible window. `false` renders all of them. Default `true`. */
  virtual?: boolean
}

export interface DatePickerViewProps extends DatePickerBaseProps {
  /** Supports `v-model:value` */
  value?: DatePickerValue | null
  defaultValue?: DatePickerValue | null
  rootClass?: string
  classes?: PickerViewSemanticClassNames
  styles?: PickerViewSemanticStyles
}

export interface DatePickerViewEmits {
  'update:value': [value: DatePickerValue]
  'change': [value: DatePickerValue, dateString: string]
}

export interface DatePickerProps extends DatePickerBaseProps, PickerFieldProps {
  /** Committed value. Supports `v-model:value`. */
  value?: DatePickerValue | null
  defaultValue?: DatePickerValue | null
}

export interface DatePickerEmits {
  'update:value': [value: DatePickerValue | null]
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  /** The committed value changed (confirm or clear) */
  'change': [value: DatePickerValue | null, dateString: string]
  /** A wheel moved, the value is not committed yet */
  'select': [value: DatePickerValue, dateString: string]
  'confirm': [value: DatePickerValue, dateString: string]
  'cancel': []
  'clear': []
}

export interface DatePickerSlots {
  /** Custom trigger */
  default?: (props: PickerTriggerSlotProps<DatePickerValue | null>) => any
  title?: () => any
  suffixIcon?: () => any
  /** Content between the header and the wheels */
  header?: () => any
  /** Content below the wheels */
  footer?: () => any
}

/** `[start, end]`, same value type as DatePicker on both sides. `null`: that side is empty. */
export type RangePickerValue = [DatePickerValue | null, DatePickerValue | null]

export type RangePickerRange = 'start' | 'end'

export interface RangePickerInfo {
  /** the side that changed */
  range: RangePickerRange
}

export interface RangePickerProps extends DatePickerBaseProps {
  /** Committed `[start, end]`. Supports `v-model:value`. */
  value?: RangePickerValue | null
  defaultValue?: RangePickerValue | null
  /** Placeholders of the start and the end side */
  placeholder?: [string, string]
  /** Separator between the two sides of the trigger, the `separator` slot wins */
  separator?: VueNode
  /** Allow a side to stay empty: a side without a value whose tab was never opened is committed as `null` */
  allowEmpty?: boolean | [boolean, boolean]
  /** Disable the field, or one side of it with `[start, end]` (a disabled side keeps its value) */
  disabled?: boolean | [boolean, boolean]
  /** Whether the popup is open. Supports `v-model:open`. */
  open?: boolean
  defaultOpen?: boolean
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

export interface RangePickerEmits {
  'update:value': [value: RangePickerValue | null]
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  /** The committed value changed (confirm or clear) */
  'change': [value: RangePickerValue | null, dateStrings: [string, string]]
  /** A wheel moved, the value is not committed yet (same as PC) */
  'calendarChange': [value: RangePickerValue, dateStrings: [string, string], info: RangePickerInfo]
  'confirm': [value: RangePickerValue, dateStrings: [string, string]]
  'cancel': []
  'clear': []
}

export interface RangePickerTriggerSlotProps {
  open: boolean
  value: RangePickerValue | null
  /** text shown by the built-in trigger (`''` when empty) */
  label: string
  /** formatted start and end (`''` when empty) */
  labels: [string, string]
  disabled: boolean
  /** `range`: the tab to open on */
  toggle: (open?: boolean, range?: RangePickerRange) => void
}

export interface RangePickerSlots {
  /** Custom trigger */
  default?: (props: RangePickerTriggerSlotProps) => any
  title?: () => any
  suffixIcon?: () => any
  separator?: () => any
  /** Content between the tabs and the wheel */
  header?: () => any
  /** Content below the wheel */
  footer?: () => any
}
