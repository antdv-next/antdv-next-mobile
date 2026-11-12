import type { AppContext, CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type ToastPosition = 'top' | 'center' | 'bottom'
export type ToastIconType = 'success' | 'fail' | 'loading'

export interface ToastConfigOptions {
  /** Default duration in milliseconds, `0` keeps the toast open */
  duration?: number
  position?: ToastPosition
  /** `false` blocks every interaction with the page while the toast is visible */
  maskClickable?: boolean
  getContainer?: () => HTMLElement
  /** App context for globally registered components / provides inside the content */
  appContext?: AppContext
}

export interface ToastShowConfig {
  content?: VueNode
  /** A preset (`'success' | 'fail' | 'loading'`) or a custom node */
  icon?: ToastIconType | VueNode
  /** Milliseconds before the toast closes itself, `0` keeps it open */
  duration?: number
  position?: ToastPosition
  maskClickable?: boolean
  class?: string
  style?: CSSProperties
  afterClose?: () => void
}

export interface ToastHandler {
  close: () => void
}

export interface ToastApi {
  show: (config: ToastShowConfig | string) => ToastHandler
  success: (config: ToastShowConfig | string) => ToastHandler
  fail: (config: ToastShowConfig | string) => ToastHandler
  /** Persistent by default (`duration: 0`) and blocks the page (`maskClickable: false`) */
  loading: (config?: ToastShowConfig | string) => ToastHandler
  /** Close the current toast */
  clear: () => void
  config: (options: ToastConfigOptions) => void
}

/** Props of the internal toast component */
export interface ToastProps {
  open?: boolean
  content?: VueNode
  icon?: ToastIconType | VueNode
  position?: ToastPosition
  maskClickable?: boolean
  zIndex?: number
  getContainer?: () => HTMLElement
  rootClass?: string
  rootStyle?: CSSProperties
}

export interface ToastEmits {
  afterClose: []
}
