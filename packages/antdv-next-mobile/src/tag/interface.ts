import type { CSSProperties } from 'vue'
import type { SizeType, VueNode } from '../_util/type'

export type TagPresetColor
  = | 'pink'
    | 'red'
    | 'yellow'
    | 'orange'
    | 'cyan'
    | 'green'
    | 'blue'
    | 'purple'
    | 'geekblue'
    | 'magenta'
    | 'volcano'
    | 'gold'
    | 'lime'
export type TagStatusColor = 'success' | 'processing' | 'error' | 'default' | 'warning'
export type TagVariant = 'filled' | 'solid' | 'outlined'

export interface TagClosableConfig {
  closeIcon?: VueNode
  /** `aria-label` of the close button */
  ariaLabel?: string
}

export interface TagSemanticClassNames {
  root?: string
  icon?: string
  content?: string
  close?: string
}

export interface TagSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  content?: CSSProperties
  close?: CSSProperties
}

export interface TagProps {
  /** Preset color, status color or any CSS color */
  color?: TagPresetColor | TagStatusColor | (string & {})
  variant?: TagVariant
  /** `false` removes the border */
  bordered?: boolean
  /** Show the close button */
  closable?: boolean | TagClosableConfig
  /** Custom close icon, the same-named slot wins */
  closeIcon?: VueNode
  icon?: VueNode
  /** Render as `<a>` */
  href?: string
  target?: string
  disabled?: boolean
  /** Mobile only: tag size */
  size?: SizeType
  /** Mobile only: fully rounded corners */
  round?: boolean
  rootClass?: string
  classes?: TagSemanticClassNames
  styles?: TagSemanticStyles
}

export interface TagEmits {
  /** Click on the close button. Call `event.preventDefault()` to keep the tag visible. */
  close: [event: MouseEvent]
}

export interface TagSlots {
  default?: () => any
  icon?: () => any
  closeIcon?: () => any
}

export interface CheckableTagProps {
  checked?: boolean
  /** Initial state in uncontrolled mode */
  defaultChecked?: boolean
  icon?: VueNode
  disabled?: boolean
  /** Mobile only: tag size */
  size?: SizeType
  /** Mobile only: fully rounded corners */
  round?: boolean
  rootClass?: string
}

export interface CheckableTagEmits {
  'update:checked': [checked: boolean]
  'change': [checked: boolean]
  'click': [event: MouseEvent]
}

export interface CheckableTagSlots {
  default?: () => any
  icon?: () => any
}
