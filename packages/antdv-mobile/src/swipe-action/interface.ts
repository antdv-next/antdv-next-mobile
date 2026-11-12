import type { CSSProperties } from 'vue'
import type { Key, VueNode } from '../_util/type'

export type SwipeActionSide = 'left' | 'right'
export type SwipeActionColor = 'primary' | 'danger' | 'warning' | 'success' | 'default'

export interface SwipeActionItem {
  key: Key
  text?: VueNode
  /** A preset color or any css color used as the background */
  color?: SwipeActionColor | (string & {})
  /** Called when the button is tapped (besides the `action` event) */
  onClick?: (event: MouseEvent) => void
}

export interface SwipeActionSemanticClassNames {
  root?: string
  content?: string
  actions?: string
  action?: string
}

export interface SwipeActionSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  actions?: CSSProperties
  action?: CSSProperties
}

export interface SwipeActionProps {
  /** Buttons revealed by swiping to the right */
  leftActions?: SwipeActionItem[]
  /** Buttons revealed by swiping to the left */
  rightActions?: SwipeActionItem[]
  /** Close after an action button is tapped */
  closeOnAction?: boolean
  /** Close when the page is touched outside the component */
  closeOnTouchOutside?: boolean
  disabled?: boolean
  /** Stop the propagation of handled touch events (e.g. inside a carousel / tabs) */
  stopPropagation?: boolean
  rootClass?: string
  classes?: SwipeActionSemanticClassNames
  styles?: SwipeActionSemanticStyles
}

export interface SwipeActionEmits {
  action: [action: SwipeActionItem, event: MouseEvent]
  /** The buttons of one side were revealed */
  actionsReveal: [side: SwipeActionSide]
  close: []
}

export interface SwipeActionSlots {
  default?: () => any
  /** custom content of the left side, replaces `leftActions` */
  left?: () => any
  /** custom content of the right side, replaces `rightActions` */
  right?: () => any
}

export interface SwipeActionRef {
  show: (side?: SwipeActionSide) => void
  close: () => void
}
