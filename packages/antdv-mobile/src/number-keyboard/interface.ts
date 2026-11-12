import type { CSSProperties } from 'vue'
import type { GetContainer, VueNode } from '../_util/type'

export type NumberKeyboardTheme = 'default' | 'custom'

export type NumberKeyboardKeyType = 'digit' | 'extra' | 'delete' | 'confirm' | 'blank'

export interface NumberKeyboardSemanticClassNames {
  root?: string
  header?: string
  body?: string
  key?: string
}

export interface NumberKeyboardSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  key?: CSSProperties
}

export interface NumberKeyboardProps {
  /** Whether the keyboard is shown. Supports `v-model:open`. */
  open?: boolean
  defaultOpen?: boolean
  /** The typed string. Supports `v-model:value`. */
  value?: string
  defaultValue?: string
  /** Max length of `value`, further keys are ignored */
  maxlength?: number
  /** Title of the header, the `title` slot wins */
  title?: VueNode
  /** `custom`: adds a right column with the delete key and a big confirm button */
  theme?: NumberKeyboardTheme
  /** Extra key(s) such as `.` or `X`: one in the default theme, up to two in the custom theme */
  extraKey?: string | string[]
  /** Shuffle the digits every time the keyboard opens */
  randomKeyOrder?: boolean
  showDeleteKey?: boolean
  /** Text of the close button in the header (default theme) */
  closeButtonText?: string
  /** Text of the confirm button (custom theme) */
  confirmText?: string
  /** Hide when the user taps outside of the keyboard */
  hideOnClickOutside?: boolean
  /** Reserve the bottom safe area (home indicator) */
  safeArea?: boolean
  /** `true`: fixed to the bottom of the screen; `false`: rendered inline in the page */
  poppable?: boolean
  /** Teleport target when poppable. Default `document.body`; `false` renders in place. */
  getContainer?: GetContainer
  zIndex?: number
  rootClass?: string
  classes?: NumberKeyboardSemanticClassNames
  styles?: NumberKeyboardSemanticStyles
}

export interface NumberKeyboardEmits {
  'update:open': [open: boolean]
  'openChange': [open: boolean]
  'update:value': [value: string]
  /** A digit or extra key was pressed */
  'input': [key: string]
  'delete': []
  /** The confirm button was pressed (custom theme) */
  'confirm': []
  /** The close / confirm button was pressed */
  'close': []
  /** The user tapped outside of the keyboard */
  'blur': []
}

export interface NumberKeyboardSlots {
  title?: () => any
  /** Content of the delete key */
  delete?: () => any
  /** Content of the bottom-left key of the default theme */
  extraKey?: () => any
}
