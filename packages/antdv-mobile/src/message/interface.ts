import type { AppContext, Component, CSSProperties } from 'vue'
import type { Key, Numeric, VueNode } from '../_util/type'

export type MessageNoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading'

export interface MessageConfigOptions {
  /** Distance from the top of the viewport (the safe area is added automatically) */
  top?: Numeric
  /** Default duration in seconds */
  duration?: number
  /** Max messages shown at once; the earliest one is closed when exceeded */
  maxCount?: number
  getContainer?: () => HTMLElement
  /** App context for globally registered components / provides inside the content (static usage) */
  appContext?: AppContext
}

export interface MessageArgsProps {
  content: VueNode
  /** Seconds before the message closes itself, `0` keeps it open */
  duration?: number
  type?: MessageNoticeType
  icon?: VueNode
  /** Messages with the same key are updated in place */
  key?: Key
  class?: string
  style?: CSSProperties
  onClose?: () => void
  onClick?: (event: MouseEvent) => void
}

export type MessageJointContent = VueNode | MessageArgsProps

/** Close handle: call it to close the message, `then` it to wait until it is closed. */
export interface MessageType extends PromiseLike<boolean> {
  (): void
}

export type MessageTypeOpen = (
  content: MessageJointContent,
  /** Seconds, or the `onClose` callback */
  duration?: number | (() => void),
  onClose?: () => void,
) => MessageType

export interface MessageInstance {
  info: MessageTypeOpen
  success: MessageTypeOpen
  error: MessageTypeOpen
  warning: MessageTypeOpen
  loading: MessageTypeOpen
  open: (args: MessageArgsProps) => MessageType
  /** Close one message by key, or all of them */
  destroy: (key?: Key) => void
}

export interface MessageApi extends MessageInstance {
  /** Global config of the static methods */
  config: (options: MessageConfigOptions) => void
  /** `const [messageApi, ContextHolder] = message.useMessage()` */
  useMessage: (config?: MessageConfigOptions) => [MessageInstance, Component]
}

/** One rendered message (internal contract between the api and the holder component) */
export interface MessageNotice {
  id: number
  key: Key
  content: VueNode
  type?: MessageNoticeType
  icon?: VueNode
  class?: string
  style?: CSSProperties
  onClick?: (event: MouseEvent) => void
}

export interface MessageHolderProps {
  notices?: MessageNotice[]
  top?: Numeric
  zIndex?: number
  getContainer?: () => HTMLElement
}
