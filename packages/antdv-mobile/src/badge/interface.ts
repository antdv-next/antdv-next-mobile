import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type BadgeStatus = 'success' | 'processing' | 'default' | 'error' | 'warning'
export type BadgePresetColor
  = | 'pink'
    | 'red'
    | 'yellow'
    | 'orange'
    | 'cyan'
    | 'green'
    | 'blue'
    | 'purple'
    | 'geekblue'
    | 'magenta'
    | 'volcano'
    | 'gold'
    | 'lime'
export type BadgeSize = 'default' | 'middle' | 'small'
export type BadgeOffset = [number | string, number | string]

export interface BadgeSemanticClassNames {
  root?: string
  indicator?: string
}

export interface BadgeSemanticStyles {
  root?: CSSProperties
  indicator?: CSSProperties
}

export interface BadgeProps {
  /** Number (or text / node) to show */
  count?: VueNode
  /** Show a red dot instead of the count */
  dot?: boolean
  /** Max count to show, larger counts render as `${overflowCount}+` */
  overflowCount?: number
  /** Show the badge when `count` is 0 */
  showZero?: boolean
  /** `[right, top]` offset of the indicator */
  offset?: BadgeOffset
  /** Preset or custom color of the indicator */
  color?: BadgePresetColor | (string & {})
  /** Render as a status dot */
  status?: BadgeStatus
  /** Text next to the status dot */
  text?: VueNode
  size?: BadgeSize
  /** Native `title` of the indicator, `null` / `false` removes it */
  title?: string | null | false
  rootClass?: string
  classes?: BadgeSemanticClassNames
  styles?: BadgeSemanticStyles
}

export interface BadgeSlots {
  default?: () => any
  count?: () => any
  text?: () => any
}

export type BadgeRibbonPlacement = 'start' | 'end'

export interface BadgeRibbonSemanticClassNames {
  root?: string
  indicator?: string
  content?: string
}

export interface BadgeRibbonSemanticStyles {
  root?: CSSProperties
  indicator?: CSSProperties
  content?: CSSProperties
}

export interface BadgeRibbonProps {
  text?: VueNode
  color?: BadgePresetColor | (string & {})
  placement?: BadgeRibbonPlacement
  rootClass?: string
  classes?: BadgeRibbonSemanticClassNames
  styles?: BadgeRibbonSemanticStyles
}

export interface BadgeRibbonSlots {
  default?: () => any
  text?: () => any
}
