import type { Dayjs } from 'dayjs'
import type { DatePickerColumnType, DatePickerDisabledTimes, DatePickerValue } from '../date-picker/interface'
import type { PickerOption } from '../picker-view/interface'
import type { PickerFieldProps, PickerTriggerSlotProps } from '../picker/interface'

/** A dayjs object, or a string in `valueFormat` when `valueFormat` is set. */
export type TimePickerValue = DatePickerValue

export type TimePickerColumnType = Extract<DatePickerColumnType, 'hour' | 'minute' | 'second' | 'meridiem'>

export type TimePickerDisabledTimes = DatePickerDisabledTimes

export interface TimePickerProps extends PickerFieldProps {
  /** Committed value. Supports `v-model:value`. */
  value?: TimePickerValue | null
  defaultValue?: TimePickerValue | null
  /** Display format, it also decides the columns: `HH:mm:ss` | `HH:mm` | `h:mm a` ... */
  format?: string
  /** Format of the bound value: when set, `value` accepts and `change` returns strings in this format */
  valueFormat?: string
  use12Hours?: boolean
  hourStep?: number
  minuteStep?: number
  secondStep?: number
  showHour?: boolean
  showMinute?: boolean
  showSecond?: boolean
  disabledTime?: (date: Dayjs) => TimePickerDisabledTimes
  /** Time shown by the wheels when there is no value, default now */
  defaultOpenValue?: TimePickerValue
  /** Filter / reorder the options of one column */
  filter?: (type: TimePickerColumnType, options: PickerOption[]) => PickerOption[]
  /** Custom option text */
  renderLabel?: (type: TimePickerColumnType, value: number) => string | number
  itemHeight?: number
  visibleItemCount?: number
}

export interface TimePickerEmits {
  'update:value': [value: TimePickerValue | null]
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  /** The committed value changed (confirm or clear) */
  'change': [time: TimePickerValue | null, timeString: string]
  /** A wheel moved, the value is not committed yet */
  'select': [time: TimePickerValue, timeString: string]
  'confirm': [time: TimePickerValue, timeString: string]
  'cancel': []
  'clear': []
}

export interface TimePickerSlots {
  /** Custom trigger */
  default?: (props: PickerTriggerSlotProps<TimePickerValue | null>) => any
  title?: () => any
  suffixIcon?: () => any
  header?: () => any
  footer?: () => any
}
