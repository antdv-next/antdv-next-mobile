import type { CSSProperties } from 'vue'
import type { GetContainer, Numeric, VueNode } from '../_util/type'

export type PopupPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center'

export interface PopupSemanticClassNames {
  root?: string
  mask?: string
  body?: string
}

export interface PopupSemanticStyles {
  root?: CSSProperties
  mask?: CSSProperties
  body?: CSSProperties
}

export interface PopupProps {
  /** Whether the popup is visible. Supports `v-model:open`. */
  open?: boolean
  placement?: PopupPlacement
  /** Show the mask layer */
  mask?: boolean
  /** Close when the mask is clicked */
  maskClosable?: boolean
  /** Show a close icon in the corner */
  closable?: boolean
  closeIcon?: VueNode
  /** Rounded corners on the side facing the page */
  round?: boolean
  /** Reserve the bottom safe area (home indicator) */
  safeArea?: boolean
  /** Lock page scroll while open */
  lockScroll?: boolean
  /** Unmount the content when closed */
  destroyOnHidden?: boolean
  /** Render the content before the first open */
  forceRender?: boolean
  /** Close on ESC */
  keyboard?: boolean
  /** Teleport target. Default `document.body`; `false` renders in place. */
  getContainer?: GetContainer
  zIndex?: number
  width?: Numeric
  height?: Numeric
  rootClass?: string
  classes?: PopupSemanticClassNames
  styles?: PopupSemanticStyles
}

export interface PopupEmits {
  'update:open': [open: boolean]
  /** Fired when the user asks to close (mask click, close icon, ESC) */
  'close': [event?: Event]
  'maskClick': [event: MouseEvent]
  /** After the enter / leave animation finished */
  'afterOpenChange': [open: boolean]
}

export interface PopupSlots {
  default?: () => any
  closeIcon?: () => any
}
