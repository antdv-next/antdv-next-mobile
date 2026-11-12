import type { CSSProperties } from 'vue'

export type RollingTextDirection = 'up' | 'down'
export type RollingTextStopOrder = 'ltr' | 'rtl'

export interface RollingTextSemanticClassNames {
  root?: string
  item?: string
}

export interface RollingTextSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
}

export interface RollingTextProps {
  /** Target number */
  value?: number
  /** Start number */
  from?: number
  /** Duration of one column, in seconds */
  duration?: number
  /** Start rolling when mounted (and again whenever the value changes) */
  autoStart?: boolean
  /** Rolling direction of the figures */
  direction?: RollingTextDirection
  /** Which side stops first */
  stopOrder?: RollingTextStopOrder
  /** Roll through these texts instead of numbers; the first one is the start, the last one the target */
  texts?: string[]
  /** Row height, a number is in px */
  height?: number | string
  rootClass?: string
  classes?: RollingTextSemanticClassNames
  styles?: RollingTextSemanticStyles
}

export interface RollingTextEmits {
  /** The last column stopped */
  finish: []
}

export interface RollingTextExpose {
  /** (Re)start rolling from the start value */
  start: () => void
  /** Stop and go back to the start value */
  reset: () => void
}
