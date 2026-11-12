import type { AppContext, Component, CSSProperties } from 'vue'
import type { GetContainer, Key, Numeric, VueNode } from '../_util/type'
import type { ButtonProps } from '../button/interface'

export type ModalOkType = 'default' | 'primary' | 'danger' | 'dashed' | 'link' | 'text'

export interface ModalAction {
  key: Key
  text: VueNode
  danger?: boolean
  /** Emphasize the action (primary color, bold) */
  bold?: boolean
  disabled?: boolean
  /** Returning a Promise puts the action into the loading state until it settles */
  onClick?: (action: ModalAction) => any
}

export interface ModalSemanticClassNames {
  root?: string
  mask?: string
  container?: string
  header?: string
  title?: string
  body?: string
  footer?: string
  close?: string
}

export interface ModalSemanticStyles {
  root?: CSSProperties
  mask?: CSSProperties
  container?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
  close?: CSSProperties
}

export interface ModalProps {
  /** Whether the dialog is visible. Supports `v-model:open`. */
  open?: boolean
  title?: VueNode
  /** Content, the default slot wins */
  content?: VueNode
  /** Custom footer, `null` / `false` hides it */
  footer?: VueNode
  okText?: VueNode
  cancelText?: VueNode
  okType?: ModalOkType
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  confirmLoading?: boolean
  /** Show the cancel button. `false` renders a single button dialog whose default text is `justOkText`. */
  okCancel?: boolean
  /** Show the close icon in the corner. Mobile default is `false`. */
  closable?: boolean
  closeIcon?: VueNode
  mask?: boolean
  maskClosable?: boolean
  /** Kept for PC parity: a mobile dialog is always centered */
  centered?: boolean
  keyboard?: boolean
  destroyOnHidden?: boolean
  forceRender?: boolean
  getContainer?: GetContainer
  zIndex?: number
  width?: Numeric
  /** Lock page scroll while open */
  scrollLock?: boolean
  /** Image on top of the dialog */
  image?: string
  /** Replace the ok / cancel buttons with a list of actions (stacked vertically when more than two) */
  actions?: ModalAction[]
  /** Close (emit `update:open` false) after an action was clicked */
  closeOnAction?: boolean
  rootClass?: string
  rootStyle?: CSSProperties
  classes?: ModalSemanticClassNames
  styles?: ModalSemanticStyles
}

export interface ModalEmits {
  'update:open': [open: boolean]
  'ok': [event: MouseEvent]
  /** Cancel button, mask, close icon or ESC */
  'cancel': [event?: Event]
  'action': [action: ModalAction, index: number]
  'afterClose': []
  'afterOpenChange': [open: boolean]
}

export interface ModalFooterSlotParams {
  ok: (event: MouseEvent) => void
  cancel: (event?: Event) => void
  confirmLoading: boolean
}

export interface ModalSlots {
  default?: () => any
  title?: () => any
  /** Area above the title: an illustration, an icon ... */
  header?: () => any
  footer?: (params: ModalFooterSlotParams) => any
  okText?: () => any
  cancelText?: () => any
  closeIcon?: () => any
}

export type ModalFuncType = 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm'

/** Config of the static methods (`Modal.confirm` ...) */
export interface ModalFuncProps {
  type?: ModalFuncType
  title?: VueNode
  content?: VueNode
  /** Icon above the title. `info / success / error / warning` have a default one. */
  icon?: VueNode
  image?: string
  okText?: VueNode
  cancelText?: VueNode
  okType?: ModalOkType
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  /** Show the cancel button. Default `true` for `confirm`, `false` otherwise. */
  okCancel?: boolean
  actions?: ModalAction[]
  closeOnAction?: boolean
  footer?: VueNode
  closable?: boolean
  closeIcon?: VueNode
  mask?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  centered?: boolean
  getContainer?: GetContainer
  zIndex?: number
  width?: Numeric
  class?: string
  style?: CSSProperties
  rootClass?: string
  classes?: ModalSemanticClassNames
  styles?: ModalSemanticStyles
  afterClose?: () => void
  /**
   * Declaring a `close` parameter hands over the control: the dialog stays open until `close()` is called.
   * Otherwise a returned Promise keeps the button loading and closes the dialog once it resolves.
   */
  onOk?: (close: () => void) => any
  onCancel?: (close: () => void) => any
  /** App context for globally registered components / provides inside the content */
  appContext?: AppContext
}

export interface ModalFuncReturn {
  destroy: () => void
  update: (config: ModalFuncProps | ((prev: ModalFuncProps) => ModalFuncProps)) => void
}

export type ModalFunc = (config: ModalFuncProps) => ModalFuncReturn

export interface ModalHookApi {
  info: ModalFunc
  success: ModalFunc
  error: ModalFunc
  warning: ModalFunc
  confirm: ModalFunc
  show: ModalFunc
  /** Single button dialog, resolves when it is closed */
  alert: (config: ModalFuncProps) => Promise<void>
  /** Resolves `true` on ok, `false` on cancel */
  confirmAsync: (config: ModalFuncProps) => Promise<boolean>
}

export interface ModalStaticFunctions extends ModalHookApi {
  warn: ModalFunc
  destroyAll: () => void
  useModal: () => [ModalHookApi, Component]
}
