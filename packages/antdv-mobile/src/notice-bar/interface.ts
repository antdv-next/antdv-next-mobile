import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type NoticeBarColor = 'default' | 'info' | 'success' | 'warning' | 'error'
export type NoticeBarShape = 'neutral' | 'rounded' | 'rectangular'

export interface NoticeBarSemanticClassNames {
  root?: string
  icon?: string
  content?: string
  extra?: string
  close?: string
}

export interface NoticeBarSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  content?: CSSProperties
  extra?: CSSProperties
  close?: CSSProperties
}

export interface NoticeBarProps {
  /** Notice text, the default slot wins */
  content?: VueNode
  color?: NoticeBarColor
  /** Icon on the start side, pass `null` / `false` to hide it */
  icon?: VueNode
  /** Extra area on the end side (before the close button) */
  extra?: VueNode
  closable?: boolean
  closeIcon?: VueNode
  /** Wrap long text into multiple lines instead of scrolling */
  wrap?: boolean
  /** Force (`true`) or disable (`false`) the marquee; by default it scrolls only when the text overflows */
  scrollable?: boolean
  /** Delay in milliseconds before the marquee starts */
  delay?: number
  /** Scrolling speed in px/s */
  speed?: number
  shape?: NoticeBarShape
  /** `true`: full border, `'block'`: top and bottom borders only, `false`: none */
  bordered?: boolean | 'block'
  rootClass?: string
  classes?: NoticeBarSemanticClassNames
  styles?: NoticeBarSemanticStyles
}

export interface NoticeBarEmits {
  close: [event: MouseEvent]
  click: [event: MouseEvent]
  /** Fired every time the marquee finishes one round */
  replay: []
}

export interface NoticeBarSlots {
  default?: () => any
  icon?: () => any
  extra?: () => any
  closeIcon?: () => any
}

export interface NoticeBarExpose {
  /** Re-measure and restart the marquee */
  reset: () => void
}
