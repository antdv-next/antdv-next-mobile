import type { CSSProperties } from 'vue'
import type { GetContainer, Key, VueNode } from '../_util/type'

export interface ShareSheetOption {
  /** Unique id, falls back to the index inside the row */
  key?: Key
  /** Name below the icon */
  label: VueNode
  /** Icon node rendered inside the round holder. Wins over `image`. */
  icon?: VueNode
  /** Image url that fills the round holder, used when there is no `icon` */
  image?: string
  /** Secondary text below `label` */
  description?: VueNode
  disabled?: boolean
  class?: string
  style?: CSSProperties
}

export interface ShareSheetSemanticClassNames {
  root?: string
  mask?: string
  body?: string
  header?: string
  title?: string
  description?: string
  row?: string
  option?: string
  icon?: string
  label?: string
  cancel?: string
}

export interface ShareSheetSemanticStyles {
  root?: CSSProperties
  mask?: CSSProperties
  body?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
  row?: CSSProperties
  option?: CSSProperties
  icon?: CSSProperties
  label?: CSSProperties
  cancel?: CSSProperties
}

export interface ShareSheetProps {
  /** Whether the sheet is visible. Supports `v-model:open`. */
  open?: boolean
  /** Initial visibility when `open` is not controlled */
  defaultOpen?: boolean
  /** One row (`ShareSheetOption[]`) or several rows (`ShareSheetOption[][]`) of options */
  options?: ShareSheetOption[] | ShareSheetOption[][]
  title?: VueNode
  /** Description below the title */
  description?: VueNode
  /** Text of the cancel button. Default comes from the locale; `null` hides the button. */
  cancelText?: VueNode
  /** Show the cancel button */
  showCancel?: boolean
  /** Close after an option was selected */
  closeOnSelect?: boolean
  maskClosable?: boolean
  keyboard?: boolean
  round?: boolean
  safeArea?: boolean
  destroyOnHidden?: boolean
  forceRender?: boolean
  getContainer?: GetContainer
  zIndex?: number
  rootClass?: string
  classes?: ShareSheetSemanticClassNames
  styles?: ShareSheetSemanticStyles
}

export interface ShareSheetEmits {
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  /** An enabled option was clicked. `index` is the position inside its row. */
  'select': [option: ShareSheetOption, index: number, rowIndex: number]
  /** The cancel button was clicked */
  'cancel': [event: MouseEvent]
  /** The sheet asks to close: select, cancel, mask or ESC */
  'close': []
  'afterOpenChange': [open: boolean]
}

export interface ShareSheetOptionSlotParams {
  option: ShareSheetOption
  index: number
  rowIndex: number
}

export interface ShareSheetSlots {
  /** Custom content between the header and the options */
  default?: () => any
  title?: () => any
  description?: () => any
  cancelText?: () => any
  /** Content of the round icon holder of one option */
  icon?: (params: ShareSheetOptionSlotParams) => any
  /** Name of one option */
  label?: (params: ShareSheetOptionSlotParams) => any
}
