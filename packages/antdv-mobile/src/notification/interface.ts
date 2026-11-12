import type { AppContext, Component, CSSProperties } from 'vue'
import type { Key, Numeric, VueNode } from '../_util/type'

/** PC placements are accepted; the corner ones map to `top` / `bottom` on mobile. */
export type NotificationPlacement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight'

/** The edge a banner is attached to */
export type NotificationEdge = 'top' | 'bottom'

export type NotificationIconType = 'success' | 'info' | 'error' | 'warning'

export interface NotificationSemanticClassNames {
  root?: string
  icon?: string
  section?: string
  title?: string
  description?: string
  actions?: string
  close?: string
  progress?: string
}

export interface NotificationSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  section?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
  actions?: CSSProperties
  close?: CSSProperties
  progress?: CSSProperties
}

export interface NotificationClosableType {
  closeIcon?: VueNode
  /** Disable the close button */
  disabled?: boolean
  onClose?: () => void
}

export interface NotificationStackConfig {
  /** Notifications of one edge collapse into a stack once there are more than `threshold` */
  threshold?: number
}

export interface NotificationArgsProps {
  title?: VueNode
  description?: VueNode
  /** Buttons area below the description */
  actions?: VueNode
  /** Notifications with the same key are updated in place */
  key?: Key
  /** Seconds before the notification closes itself, `0` / `false` keeps it open */
  duration?: number | false
  /** Show a progress bar of the remaining time */
  showProgress?: boolean
  /** Pause the timer while the notification is touched (or hovered with a mouse) */
  pauseOnHover?: boolean
  icon?: VueNode
  placement?: NotificationPlacement
  class?: string
  style?: CSSProperties
  classes?: NotificationSemanticClassNames
  styles?: NotificationSemanticStyles
  type?: NotificationIconType
  /** Custom close icon, `null` / `false` hides the close button */
  closeIcon?: VueNode
  closable?: boolean | NotificationClosableType
  /** Extra attributes of the notification element (`data-*`, `aria-*`) */
  props?: Record<string, any>
  role?: 'alert' | 'status'
  onClick?: (event: MouseEvent) => void
  /** Closed by the timer, the close button or a swipe */
  onClose?: () => void
}

/** Config of `notification.useNotification(config)` and of `<am-app :notification>` */
export interface NotificationConfig {
  /** Distance from the top of the viewport (the safe area is added automatically) */
  top?: Numeric
  /** Distance from the bottom of the viewport (the safe area is added automatically) */
  bottom?: Numeric
  getContainer?: () => HTMLElement
  placement?: NotificationPlacement
  /** Max notifications shown at once; the earliest one is closed when exceeded */
  maxCount?: number
  stack?: boolean | NotificationStackConfig
  duration?: number | false
  showProgress?: boolean
  pauseOnHover?: boolean
  closeIcon?: VueNode
  closable?: boolean | NotificationClosableType
  classes?: NotificationSemanticClassNames
  styles?: NotificationSemanticStyles
}

/** Config of `notification.config(options)` */
export interface NotificationGlobalConfig extends NotificationConfig {
  /** App context for globally registered components / provides inside the content (static usage) */
  appContext?: AppContext
}

export type NotificationStaticFn = (args: NotificationArgsProps) => void

export interface NotificationInstance {
  success: NotificationStaticFn
  error: NotificationStaticFn
  info: NotificationStaticFn
  warning: NotificationStaticFn
  open: NotificationStaticFn
  /** Close one notification by key, or all of them */
  destroy: (key?: Key) => void
}

export interface NotificationApi extends NotificationInstance {
  /** Global config of the static methods */
  config: (options: NotificationGlobalConfig) => void
  /** `const [api, ContextHolder] = notification.useNotification()` */
  useNotification: (config?: NotificationConfig) => [NotificationInstance, Component]
}

/** Props of the notification card */
export interface NotificationProps {
  title?: VueNode
  description?: VueNode
  actions?: VueNode
  icon?: VueNode
  type?: NotificationIconType
  /** Seconds, `0` keeps it open */
  duration?: number
  /** Changing it restarts the timer (bumped on every update by key) */
  times?: number
  showProgress?: boolean
  pauseOnHover?: boolean
  closable?: boolean
  closeIcon?: VueNode
  closeDisabled?: boolean
  /** The edge it is attached to: decides the vertical swipe direction that dismisses it */
  placement?: NotificationEdge
  role?: 'alert' | 'status'
  rootClass?: string
  classes?: NotificationSemanticClassNames
  styles?: NotificationSemanticStyles
}

export interface NotificationEmits {
  /** The timer ran out, the close button was tapped or the card was swiped away */
  close: []
  click: [event: MouseEvent]
}

export interface NotificationSlots {
  title?: () => any
  description?: () => any
  actions?: () => any
  icon?: () => any
  closeIcon?: () => any
}

/** One rendered notification (internal contract between the api and the holder component) */
export interface NotificationNotice {
  id: number
  key: Key
  placement: NotificationEdge
  times: number
  duration: number
  title?: VueNode
  description?: VueNode
  actions?: VueNode
  icon?: VueNode
  type?: NotificationIconType
  showProgress?: boolean
  pauseOnHover?: boolean
  closable?: boolean
  closeIcon?: VueNode
  closeDisabled?: boolean
  role?: 'alert' | 'status'
  class?: string
  style?: CSSProperties
  classes?: NotificationSemanticClassNames
  styles?: NotificationSemanticStyles
  props?: Record<string, any>
  onClick?: (event: MouseEvent) => void
}

export interface NotificationHolderProps {
  notices?: NotificationNotice[]
  top?: Numeric
  bottom?: Numeric
  zIndex?: number
  stack?: boolean | NotificationStackConfig
  getContainer?: () => HTMLElement
}

export interface NotificationHolderEmits {
  close: [key: Key]
}
