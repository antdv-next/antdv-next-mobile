import type { AppContext, CSSProperties } from 'vue'
import type { GetContainer, Key, VueNode } from '../_util/type'

export interface ActionSheetAction {
  key: Key
  text: VueNode
  /** Secondary text below `text` */
  description?: VueNode
  icon?: VueNode
  danger?: boolean
  bold?: boolean
  disabled?: boolean
  onClick?: (action: ActionSheetAction, index: number) => void
}

export interface ActionSheetSemanticClassNames {
  root?: string
  mask?: string
  body?: string
  header?: string
  title?: string
  extra?: string
  list?: string
  item?: string
  cancel?: string
}

export interface ActionSheetSemanticStyles {
  root?: CSSProperties
  mask?: CSSProperties
  body?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  extra?: CSSProperties
  list?: CSSProperties
  item?: CSSProperties
  cancel?: CSSProperties
}

export interface ActionSheetProps {
  /** Whether the sheet is visible. Supports `v-model:open`. */
  open?: boolean
  actions?: ActionSheetAction[]
  title?: VueNode
  /** Description below the title */
  extra?: VueNode
  /** Text of the cancel button. Default comes from the locale; `null` hides the button. */
  cancelText?: VueNode
  /** Show the cancel button */
  showCancel?: boolean
  /** Close after an action was clicked */
  closeOnAction?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  round?: boolean
  safeArea?: boolean
  destroyOnHidden?: boolean
  forceRender?: boolean
  getContainer?: GetContainer
  zIndex?: number
  rootClass?: string
  classes?: ActionSheetSemanticClassNames
  styles?: ActionSheetSemanticStyles
}

export interface ActionSheetEmits {
  'update:open': [open: boolean]
  'action': [action: ActionSheetAction, index: number]
  /** The cancel button was clicked */
  'cancel': [event: MouseEvent]
  /** The sheet asks to close: action, cancel, mask or ESC */
  'close': []
  'afterOpenChange': [open: boolean]
}

export interface ActionSheetSlots {
  /** Custom content between the header and the actions */
  default?: () => any
  title?: () => any
  extra?: () => any
  cancelText?: () => any
  /** Custom content of one action */
  action?: (params: { action: ActionSheetAction, index: number }) => any
}

/** Config of `ActionSheet.show()` */
export interface ActionSheetShowConfig {
  actions?: ActionSheetAction[]
  title?: VueNode
  extra?: VueNode
  cancelText?: VueNode
  showCancel?: boolean
  closeOnAction?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  round?: boolean
  safeArea?: boolean
  getContainer?: GetContainer
  zIndex?: number
  class?: string
  style?: CSSProperties
  rootClass?: string
  classes?: ActionSheetSemanticClassNames
  styles?: ActionSheetSemanticStyles
  onAction?: (action: ActionSheetAction, index: number) => void
  onCancel?: () => void
  onClose?: () => void
  afterClose?: () => void
  appContext?: AppContext
}

export interface ActionSheetShowHandler {
  close: () => void
}
