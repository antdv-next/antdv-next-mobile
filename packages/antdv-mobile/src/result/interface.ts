import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type ResultExceptionStatus = 403 | 404 | 500 | '403' | '404' | '500'
export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | ResultExceptionStatus

export interface ResultSemanticClassNames {
  root?: string
  icon?: string
  title?: string
  subTitle?: string
  extra?: string
  body?: string
}

export interface ResultSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  title?: CSSProperties
  subTitle?: CSSProperties
  extra?: CSSProperties
  body?: CSSProperties
}

export interface ResultProps {
  /** Decides the icon and its color */
  status?: ResultStatus
  /** Custom icon, the same-named slot wins */
  icon?: VueNode
  title?: VueNode
  subTitle?: VueNode
  /** Operating area */
  extra?: VueNode
  rootClass?: string
  classes?: ResultSemanticClassNames
  styles?: ResultSemanticStyles
}

export interface ResultSlots {
  /** Extra content, e.g. a detailed explanation */
  default?: () => any
  icon?: () => any
  title?: () => any
  subTitle?: () => any
  extra?: () => any
}
