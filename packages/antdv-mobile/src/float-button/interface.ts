import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type FloatButtonType = 'default' | 'primary'
export type FloatButtonShape = 'circle' | 'square'
export type FloatButtonHTMLType = 'submit' | 'button' | 'reset'
export type FloatButtonAxis = 'x' | 'y' | 'xy'
export type FloatButtonMagnetic = 'x' | 'y'
export type FloatButtonGroupTrigger = 'click'
export type FloatButtonGroupPlacement = 'top' | 'left' | 'right' | 'bottom'

export interface FloatButtonOffset {
  x: number
  y: number
}

export interface FloatButtonBadgeProps {
  count?: number | string
  /** Show a red dot instead of the count */
  dot?: boolean
  /** Show `${overflowCount}+` when the count is larger */
  overflowCount?: number
  showZero?: boolean
  color?: string
}

export interface FloatButtonSemanticClassNames {
  root?: string
  icon?: string
  content?: string
  badge?: string
}

export interface FloatButtonSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  content?: CSSProperties
  badge?: CSSProperties
}

export interface FloatButtonProps {
  icon?: VueNode
  /** Text below the icon */
  content?: VueNode
  /** @deprecated use `content` */
  description?: VueNode
  type?: FloatButtonType
  shape?: FloatButtonShape
  href?: string
  target?: string
  htmlType?: FloatButtonHTMLType
  badge?: FloatButtonBadgeProps
  ariaLabel?: string
  /** Let the user drag the button around */
  draggable?: boolean
  /** Axis the button can be dragged along */
  axis?: FloatButtonAxis
  /** Snap to the nearest edge of that axis when released */
  magnetic?: FloatButtonMagnetic
  /** Top-left position in px (relative to the viewport, or the offset parent when positioned absolutely). Supports `v-model:offset`. */
  offset?: FloatButtonOffset
  /** Minimal distance to the edges while dragging */
  gap?: number
  rootClass?: string
  classes?: FloatButtonSemanticClassNames
  styles?: FloatButtonSemanticStyles
}

export interface FloatButtonEmits {
  'click': [event: MouseEvent]
  'update:offset': [offset: FloatButtonOffset]
  /** The button was dropped at a new position */
  'offsetChange': [offset: FloatButtonOffset]
}

export interface FloatButtonSlots {
  /** Content below the icon */
  default?: () => any
  icon?: () => any
}

export interface FloatButtonGroupSemanticClassNames {
  root?: string
  list?: string
  trigger?: string
}

export interface FloatButtonGroupSemanticStyles {
  root?: CSSProperties
  list?: CSSProperties
  trigger?: CSSProperties
}

export interface FloatButtonGroupProps {
  /** Shape of every button inside */
  shape?: FloatButtonShape
  /** Menu mode: the buttons are revealed by a trigger button */
  trigger?: FloatButtonGroupTrigger
  /** Whether the menu is expanded. Supports `v-model:open`. */
  open?: boolean
  defaultOpen?: boolean
  /** Where the menu pops out */
  placement?: FloatButtonGroupPlacement
  /** Icon of the trigger while expanded */
  closeIcon?: VueNode
  /** Icon of the trigger */
  icon?: VueNode
  content?: VueNode
  type?: FloatButtonType
  badge?: FloatButtonBadgeProps
  rootClass?: string
  classes?: FloatButtonGroupSemanticClassNames
  styles?: FloatButtonGroupSemanticStyles
}

export interface FloatButtonGroupEmits {
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  /** The trigger button was clicked (menu mode) */
  'click': [event: MouseEvent]
}

export interface FloatButtonGroupSlots {
  default?: () => any
  icon?: () => any
  closeIcon?: () => any
}

export interface BackTopProps {
  /** The button shows up once the scroll offset reaches this value */
  visibilityHeight?: number
  /** The scrolling element to listen on, default `window` */
  target?: () => HTMLElement | Window
  /** Duration of the scroll animation in ms */
  duration?: number
  icon?: VueNode
  content?: VueNode
  type?: FloatButtonType
  shape?: FloatButtonShape
  badge?: FloatButtonBadgeProps
  ariaLabel?: string
  rootClass?: string
  classes?: FloatButtonSemanticClassNames
  styles?: FloatButtonSemanticStyles
}

export interface BackTopEmits {
  click: [event: MouseEvent]
}

export interface BackTopSlots {
  default?: () => any
  icon?: () => any
}
