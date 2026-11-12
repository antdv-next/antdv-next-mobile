import type { CSSProperties, VNodeChild } from 'vue'
import type { Numeric } from '../_util/type'

export type ProgressType = 'line' | 'circle' | 'dashboard'
export type ProgressStatus = 'normal' | 'exception' | 'active' | 'success'
export type ProgressSize = 'small' | 'medium' | 'default'
export type ProgressGapPlacement = 'top' | 'bottom' | 'start' | 'end'

/** `{ from, to }` or percentage stops such as `{ '0%': '#108ee9', '100%': '#87d068' }` */
export interface ProgressGradient {
  /** Only for `type="line"`, `to right` by default */
  direction?: string
  from?: string
  to?: string
  [percent: string]: string | undefined
}

export interface ProgressSuccessConfig {
  percent?: number
  strokeColor?: string
}

export interface ProgressPercentPosition {
  align?: 'start' | 'center' | 'end'
  type?: 'inner' | 'outer'
}

export interface ProgressStepsConfig {
  count: number
  gap?: number
}

export interface ProgressSizeConfig {
  width?: number
  height?: number
}

export interface ProgressSemanticClassNames {
  root?: string
  body?: string
  rail?: string
  track?: string
  indicator?: string
}

export interface ProgressSemanticStyles {
  root?: CSSProperties
  body?: CSSProperties
  rail?: CSSProperties
  track?: CSSProperties
  indicator?: CSSProperties
}

export interface ProgressProps {
  type?: ProgressType
  percent?: number
  /** Template of the info text */
  format?: (percent?: number, successPercent?: number) => VNodeChild
  /** `success` is set automatically when `percent` reaches 100 */
  status?: ProgressStatus
  showInfo?: boolean
  /** line: thickness in px; circle / dashboard: percentage of the canvas size */
  strokeWidth?: number
  strokeLinecap?: 'butt' | 'square' | 'round'
  /** A color, a gradient, or one color per step when `steps` is set */
  strokeColor?: string | string[] | ProgressGradient
  railColor?: string
  /** @deprecated Please use `railColor` instead */
  trailColor?: string
  /** Completed segment */
  success?: ProgressSuccessConfig
  /** Gap of the circle in degrees (0 - 295), `75` for dashboard */
  gapDegree?: number
  gapPlacement?: ProgressGapPlacement
  /**
   * line: `[width, height]` (a number is the thickness); circle / dashboard: diameter.
   */
  size?: number | [Numeric, number] | ProgressSize | ProgressSizeConfig
  /** Split a line progress into steps */
  steps?: number | ProgressStepsConfig
  /** Position of the info text, only for `type="line"` */
  percentPosition?: ProgressPercentPosition
  /** Rounds the number of finished steps, `Math.round` by default */
  rounding?: (step: number) => number
  rootClass?: string
  classes?: ProgressSemanticClassNames
  styles?: ProgressSemanticStyles
}

export interface ProgressSlots {
  /** Custom info content */
  default?: (ctx: { percent: number, successPercent?: number }) => any
}
