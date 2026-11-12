import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export interface EmptySemanticClassNames {
  root?: string
  image?: string
  description?: string
  footer?: string
}

export interface EmptySemanticStyles {
  root?: CSSProperties
  image?: CSSProperties
  description?: CSSProperties
  footer?: CSSProperties
}

export interface EmptyProps {
  /** Image url or a custom node, defaults to `Empty.PRESENTED_IMAGE_DEFAULT` */
  image?: VueNode
  /** Description text, `false` / `null` hides it */
  description?: VueNode
  rootClass?: string
  classes?: EmptySemanticClassNames
  styles?: EmptySemanticStyles
}

export interface EmptySlots {
  /** Footer, usually an action button */
  default?: () => any
  image?: () => any
  description?: () => any
}
