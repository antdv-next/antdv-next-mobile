import type { CSSProperties } from 'vue'
import type { Key, VueNode } from '../_util/type'

export type PopoverPlacement
  = | 'top'
    | 'topLeft'
    | 'topRight'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'left'
    | 'leftTop'
    | 'leftBottom'
    | 'right'
    | 'rightTop'
    | 'rightBottom'

export type PopoverTrigger = 'click' | 'manual'
export type PopoverMode = 'light' | 'dark'

export interface PopoverAction {
  key: Key
  text: VueNode
  icon?: VueNode
  disabled?: boolean
  danger?: boolean
  onClick?: (action: PopoverAction, index: number) => void
}

export interface PopoverSemanticClassNames {
  root?: string
  container?: string
  arrow?: string
  title?: string
  content?: string
}

export interface PopoverSemanticStyles {
  root?: CSSProperties
  container?: CSSProperties
  arrow?: CSSProperties
  title?: CSSProperties
  content?: CSSProperties
}

export interface PopoverProps {
  /** Whether the popover is visible. Supports `v-model:open`. */
  open?: boolean
  defaultOpen?: boolean
  title?: VueNode
  content?: VueNode
  placement?: PopoverPlacement
  /** `'click'` toggles on tap, `'manual'` is driven by `open` / the exposed methods only */
  trigger?: PopoverTrigger
  arrow?: boolean
  /** Custom background color */
  color?: string
  mode?: PopoverMode
  /** Flip / shift automatically to stay inside the viewport */
  autoAdjustOverflow?: boolean
  /** Close when touching outside of the popover */
  closeOnClickAway?: boolean
  destroyOnHidden?: boolean
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  zIndex?: number
  /** Menu mode: render a list of actions instead of `content` */
  actions?: PopoverAction[]
  /** Close after an action was clicked */
  closeOnAction?: boolean
  rootClass?: string
  classes?: PopoverSemanticClassNames
  styles?: PopoverSemanticStyles
}

export interface PopoverEmits {
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  'action': [action: PopoverAction, index: number]
}

export interface PopoverSlots {
  /** The trigger element */
  default?: () => any
  title?: () => any
  content?: () => any
}

export interface PopoverExpose {
  show: () => void
  hide: () => void
  /** Re-compute the position (e.g. after the trigger moved) */
  updatePosition: () => void
}
