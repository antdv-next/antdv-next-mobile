import type { CSSProperties } from 'vue'
import type { SizeType, VueNode } from '../_util/type'

export interface SpinSemanticClassNames {
  root?: string
  section?: string
  indicator?: string
  description?: string
  container?: string
}

export interface SpinSemanticStyles {
  root?: CSSProperties
  section?: CSSProperties
  indicator?: CSSProperties
  description?: CSSProperties
  container?: CSSProperties
}

export interface SpinProps {
  /** Whether Spin is spinning */
  spinning?: boolean
  size?: SizeType
  /** Text below the indicator */
  description?: VueNode
  /** @deprecated Please use `description` instead */
  tip?: VueNode
  /** Delay in milliseconds before the spinner shows up (prevents flashing) */
  delay?: number
  /** Custom spinning indicator */
  indicator?: VueNode
  /** Cover the whole viewport with a mask */
  fullscreen?: boolean
  /** Progress (0 - 100) shown by the default indicator */
  percent?: number
  rootClass?: string
  classes?: SpinSemanticClassNames
  styles?: SpinSemanticStyles
}

export interface SpinSlots {
  default?: () => any
  indicator?: () => any
  description?: () => any
  /** @deprecated Please use `description` instead */
  tip?: () => any
}
