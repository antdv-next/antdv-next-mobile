import type { CSSProperties, VNodeChild } from 'vue'
import type { VueNode } from '../_util/type'

export type StatisticValueType = number | string

export interface StatisticFormatConfig {
  decimalSeparator?: string
  groupSeparator?: string
  precision?: number
}

export type StatisticFormatter = (value: StatisticValueType, config?: StatisticFormatConfig) => VNodeChild

export interface StatisticSemanticClassNames {
  root?: string
  header?: string
  title?: string
  content?: string
  prefix?: string
  value?: string
  suffix?: string
}

export interface StatisticSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  content?: CSSProperties
  prefix?: CSSProperties
  value?: CSSProperties
  suffix?: CSSProperties
}

export interface StatisticProps {
  title?: VueNode
  value?: StatisticValueType
  /** Number of decimals */
  precision?: number
  prefix?: VueNode
  suffix?: VueNode
  /** Customize the value display */
  formatter?: StatisticFormatter
  /** Thousands separator, `,` by default */
  groupSeparator?: string
  /** Decimal separator, `.` by default */
  decimalSeparator?: string
  /** Show a skeleton instead of the value */
  loading?: boolean
  valueStyle?: CSSProperties
  rootClass?: string
  classes?: StatisticSemanticClassNames
  styles?: StatisticSemanticStyles
}

export interface StatisticSlots {
  title?: () => any
  prefix?: () => any
  suffix?: () => any
  formatter?: (ctx: { value: StatisticValueType }) => any
}

export type StatisticTimerType = 'countdown' | 'countup'

export interface StatisticTimeData {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

export interface StatisticTimerProps {
  /** `countdown`: time left until `value`; `countup`: time passed since `value` */
  type?: StatisticTimerType
  /** Target (countdown) or start (countup) timestamp */
  value?: StatisticValueType
  /** `Y M D H m s S` tokens, text inside `[]` is kept as is. `HH:mm:ss` by default */
  format?: string
  title?: VueNode
  prefix?: VueNode
  suffix?: VueNode
  loading?: boolean
  valueStyle?: CSSProperties
  rootClass?: string
  classes?: StatisticSemanticClassNames
  styles?: StatisticSemanticStyles
}

export interface StatisticTimerEmits {
  /** Only fired when `type` is `countdown` */
  finish: []
  /** Fired on every tick with the remaining / elapsed milliseconds */
  change: [value: number]
}

export interface StatisticTimerSlots {
  title?: () => any
  prefix?: () => any
  suffix?: () => any
  /** Custom rendering, e.g. digit blocks */
  formatter?: (ctx: { value: number, formatted: string, time: StatisticTimeData }) => any
}
