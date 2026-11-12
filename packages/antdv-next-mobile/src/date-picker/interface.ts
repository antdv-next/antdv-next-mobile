import type { Dayjs } from 'dayjs'
import type { PickerOption, PickerViewSemanticClassNames, PickerViewSemanticStyles } from '../picker-view/interface'
import type { PickerFieldProps, PickerTriggerSlotProps } from '../picker/interface'

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
