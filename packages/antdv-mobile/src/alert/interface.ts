import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type AlertType = 'success' | 'info' | 'warning' | 'error'
export type AlertVariant = 'filled' | 'outlined'

export interface AlertClosableConfig {
  closeIcon?: VueNode
  disabled?: boolean
  'aria-label'?: string
}

export type AlertClosableType = boolean | AlertClosableConfig

export interface AlertSemanticClassNames {
  root?: string
  icon?: string
  section?: string
  title?: string
  description?: string
  actions?: string
  close?: string
}

export interface AlertSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  section?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
  actions?: CSSProperties
  close?: CSSProperties
}

export interface AlertProps {
  /** Type of Alert styles, `info` by default (`warning` in banner mode) */
  type?: AlertType
  /** `filled` keeps the tinted background, `outlined` only draws the colored border */
  variant?: AlertVariant
  /** Content of Alert */
  title?: VueNode
  /** @deprecated Please use `title` instead */
  message?: VueNode
  /** Additional content of Alert */
  description?: VueNode
  /** Whether to show icon, `true` by default in banner mode */
  showIcon?: boolean
  icon?: VueNode
  closable?: AlertClosableType
  closeIcon?: VueNode
  /** Action area, e.g. a small button */
  action?: VueNode
  /** Edge-to-edge banner: no border, no radius */
  banner?: boolean
  role?: string
  rootClass?: string
  classes?: AlertSemanticClassNames
  styles?: AlertSemanticStyles
}

export interface AlertEmits {
  close: [event: MouseEvent]
  afterClose: []
}

export interface AlertSlots {
  default?: () => any
  title?: () => any
  /** @deprecated Please use `title` instead */
  message?: () => any
  description?: () => any
  icon?: () => any
  closeIcon?: () => any
  action?: () => any
}
