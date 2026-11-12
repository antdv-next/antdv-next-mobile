import type { CSSProperties } from 'vue'
import type { GetContainer, Numeric, VueNode } from '../_util/type'

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left'
export type DrawerSize = 'default' | 'large' | number | string

export interface DrawerClosableConfig {
  closeIcon?: VueNode
  disabled?: boolean
  /** Side of the header the close button sits on */
  placement?: 'start' | 'end'
}

export interface DrawerSemanticClassNames {
  root?: string
  mask?: string
  section?: string
  header?: string
  title?: string
  extra?: string
  body?: string
  footer?: string
  close?: string
  handle?: string
}

export interface DrawerSemanticStyles {
  root?: CSSProperties
  mask?: CSSProperties
  section?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  extra?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
  close?: CSSProperties
  handle?: CSSProperties
}

export interface DrawerProps {
  /** Whether the drawer is visible. Supports `v-model:open`. */
  open?: boolean
  title?: VueNode
  /** Extra actions at the end of the header */
  extra?: VueNode
  footer?: VueNode
  /** Mobile default is `'bottom'` (PC: `'right'`) */
  placement?: DrawerPlacement
  closable?: boolean | DrawerClosableConfig
  closeIcon?: VueNode
  mask?: boolean
  maskClosable?: boolean
  /** Close on ESC */
  keyboard?: boolean
  /** `'default'` fits the content (top / bottom) or 80% (left / right); `'large'` is 90% / 100%; or a custom size */
  size?: DrawerSize
  /** Width of a left / right drawer, wins over `size` */
  width?: Numeric
  /** Height of a top / bottom drawer, wins over `size` */
  height?: Numeric
  destroyOnHidden?: boolean
  forceRender?: boolean
  getContainer?: GetContainer
  zIndex?: number
  /** Show a loading indicator instead of the content */
  loading?: boolean
  /** Rounded corners on the side facing the page */
  round?: boolean
  /** Reserve the bottom safe area */
  safeArea?: boolean
  /** Lock page scroll while open */
  lockScroll?: boolean
  /** Show a drag handle and close by swiping down (bottom placement only) */
  swipeToClose?: boolean
  rootClass?: string
  rootStyle?: CSSProperties
  classes?: DrawerSemanticClassNames
  styles?: DrawerSemanticStyles
}

export interface DrawerEmits {
  'update:open': [open: boolean]
  /** The user asks to close: close icon, mask, ESC or swipe */
  'close': [event?: Event]
  'afterOpenChange': [open: boolean]
}

export interface DrawerSlots {
  default?: () => any
  title?: () => any
  extra?: () => any
  footer?: () => any
  closeIcon?: () => any
}
