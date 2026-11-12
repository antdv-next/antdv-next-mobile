import type { CSSProperties } from 'vue'
import type { RenderNodeFn, SizeType, VueNode } from '../_util/type'

export type ButtonType = 'default' | 'primary' | 'dashed' | 'link' | 'text'
export type ButtonColorType = 'default' | 'primary' | 'danger' | 'success' | 'warning'
export type ButtonVariantType = 'outlined' | 'dashed' | 'solid' | 'filled' | 'text' | 'link'
export type ButtonShape = 'default' | 'circle' | 'round'
export type ButtonHTMLType = 'submit' | 'button' | 'reset'

export interface ButtonSemanticClassNames {
  root?: string
  icon?: string
  content?: string
}

export interface ButtonSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  content?: CSSProperties
}

export interface ButtonProps {
  /** Syntactic sugar of `color` + `variant` */
  type?: ButtonType
  color?: ButtonColorType
  variant?: ButtonVariantType
  icon?: VueNode
  iconPlacement?: 'start' | 'end'
  shape?: ButtonShape
  size?: SizeType
  disabled?: boolean
  loading?: boolean | { delay?: number, icon?: RenderNodeFn }
  ghost?: boolean
  danger?: boolean
  /** Fit the width of the parent */
  block?: boolean
  href?: string
  target?: string
  htmlType?: ButtonHTMLType
  rootClass?: string
  classes?: ButtonSemanticClassNames
  styles?: ButtonSemanticStyles
}

export interface ButtonEmits {
  click: [event: MouseEvent]
}

export interface ButtonSlots {
  default?: () => any
  icon?: () => any
}
