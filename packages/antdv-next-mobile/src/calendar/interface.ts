import type { Dayjs } from 'dayjs'
import type { CSSProperties } from 'vue'
import type { GetContainer, RenderNodeFn, SizeType, ValidateStatus, VueNode } from '../_util/type'
import type { Variant } from '../form/context'
import type { PickerTriggerSlotProps } from '../picker/interface'

export type CalendarSelectionMode = 'single' | 'range' | 'multiple'

/** A dayjs object, or a string in `valueFormat` when `valueFormat` is set. */
export type CalendarDate = Dayjs | string

/** single: a date; range: `[start, end]`; multiple: a list of dates. */
export type CalendarValue = CalendarDate | CalendarDate[]

export type CalendarDayType = '' | 'selected' | 'start' | 'end' | 'start-end' | 'middle' | 'disabled'

export interface CalendarDay {
  date: Dayjs
  type: CalendarDayType
  /** main text, default the day of month */
  text: string | number
  /** small text above the day, default "today" for the current day */
  topInfo?: string
  /** small text below the day, default the start / end texts in range mode */
  bottomInfo?: string
  className?: string
  isToday: boolean
}

export interface CalendarCellRenderInfo {
  date: Dayjs
  day: CalendarDay
}

export interface CalendarSemanticClassNames {
  root?: string
  trigger?: string
  popup?: string
  header?: string
  body?: string
  month?: string
  day?: string
  footer?: string
}

export interface CalendarSemanticStyles {
  root?: CSSProperties
  trigger?: CSSProperties
  popup?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  month?: CSSProperties
  day?: CSSProperties
  footer?: CSSProperties
}

export interface CalendarProps {
  /** Committed value. Supports `v-model:value`. */
  value?: CalendarValue | null
  defaultValue?: CalendarValue | null
  /** Format of the bound value: when set, `value` accepts and `change` returns strings in this format */
  valueFormat?: string
  selectionMode?: CalendarSelectionMode
  /** Default today */
  minDate?: CalendarDate
  /** Default six months after today */
  maxDate?: CalendarDate
  disabledDate?: (date: Dayjs) => boolean
  /** range: max number of days; multiple: max number of dates */
  maxRange?: number
  /** Show the built-in tip when `maxRange` is exceeded */
  showRangePrompt?: boolean
  rangePrompt?: string
  /** range: allow start and end to be the same day */
  allowSameDay?: boolean
  /** First day of the week: `0` Sunday, `1` Monday */
  weekStartsOn?: 0 | 1
  /** Title of the header, the `title` slot wins */
  title?: VueNode
  showTitle?: boolean
  /** Month number watermark */
  showMark?: boolean
  /** Show the confirm button. `false`: commit as soon as the selection is complete. */
  showConfirm?: boolean
  okText?: string
  /** Height of one row of days in px */
  rowHeight?: number
  /** Tweak a day before it is rendered: texts, class name, type */
  formatter?: (day: CalendarDay) => CalendarDay
  /** Custom content of a day cell, the `cellRender` slot wins */
  cellRender?: RenderNodeFn<CalendarCellRenderInfo>
  /** `true`: bottom popup controlled by `v-model:open`; `false`: inline view */
  poppable?: boolean
  /** Whether the popup is open. Supports `v-model:open`. */
  open?: boolean
  defaultOpen?: boolean
  /** Render an input-like trigger showing the formatted value (popup mode) */
  trigger?: boolean
  /** Display format of the trigger */
  format?: string | ((value: Dayjs) => string)
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  status?: ValidateStatus
  variant?: Variant
  size?: SizeType
  suffixIcon?: VueNode
  id?: string
  /** Teleport target of the popup. Default `document.body`; `false` renders in place. */
  getContainer?: GetContainer
  zIndex?: number
  maskClosable?: boolean
  /** Show the close icon of the popup */
  closable?: boolean
  destroyOnHidden?: boolean
  rootClass?: string
  classes?: CalendarSemanticClassNames
  styles?: CalendarSemanticStyles
}

export interface CalendarEmits {
  'update:value': [value: CalendarValue | null]
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  /** The committed value changed */
  'change': [value: CalendarValue | null, dateString: string | string[]]
  /** A day was tapped; the selection is not committed yet (range may be incomplete) */
  'select': [value: CalendarValue | null]
  'confirm': [value: CalendarValue | null]
  /** The popup was closed without confirming */
  'cancel': []
  'clear': []
  /** A month scrolled into view */
  'monthShow': [info: { date: Dayjs, title: string }]
  /** `maxRange` was exceeded */
  'overRange': []
}

export interface CalendarSlots {
  /** Custom trigger (popup mode) */
  default?: (props: PickerTriggerSlotProps<CalendarValue | null>) => any
  title?: () => any
  suffixIcon?: () => any
  cellRender?: (info: CalendarCellRenderInfo) => any
  /** Replaces the confirm button */
  footer?: (props: { confirm: () => void, disabled: boolean }) => any
}

export interface CalendarExpose {
  /** Scroll the month of `date` into view */
  scrollToDate: (date: CalendarDate) => void
  /** Reset the pending selection to `date` (default: the committed value) and scroll to it */
  reset: (date?: CalendarValue | null) => void
  toggle: (open?: boolean) => void
}
