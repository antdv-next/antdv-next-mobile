import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type CardSize = 'default' | 'middle' | 'small'
export type CardVariant = 'outlined' | 'borderless'
export type CardType = 'inner'

export interface CardSemanticClassNames {
  root?: string
  header?: string
  title?: string
  extra?: string
  cover?: string
  body?: string
  footer?: string
  actions?: string
}

export interface CardSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  extra?: CSSProperties
  cover?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
  actions?: CSSProperties
}

export interface CardProps {
  title?: VueNode
  /** Content at the end of the header */
  extra?: VueNode
  /** Card cover, usually an image */
  cover?: VueNode
  /** Action list at the bottom of the card */
  actions?: VueNode[]
  /** Mobile only: free-form footer below the body */
  footer?: VueNode
  /** Show a skeleton instead of the body */
  loading?: boolean
  variant?: CardVariant
  /** Alias of `variant` (`false` equals `borderless`) */
  bordered?: boolean
  size?: CardSize
  /** `inner`: a card nested in another card */
  type?: CardType
  /** Mobile only: press feedback for the whole card */
  clickable?: boolean
  rootClass?: string
  classes?: CardSemanticClassNames
  styles?: CardSemanticStyles
}

export interface CardSlots {
  default?: () => any
  title?: () => any
  extra?: () => any
  cover?: () => any
  actions?: () => any
  footer?: () => any
}

export interface CardMetaSemanticClassNames {
  root?: string
  avatar?: string
  section?: string
  title?: string
  description?: string
}

export interface CardMetaSemanticStyles {
  root?: CSSProperties
  avatar?: CSSProperties
  section?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
}

export interface CardMetaProps {
  avatar?: VueNode
  title?: VueNode
  description?: VueNode
  rootClass?: string
  classes?: CardMetaSemanticClassNames
  styles?: CardMetaSemanticStyles
}

export interface CardMetaSlots {
  avatar?: () => any
  title?: () => any
  description?: () => any
}
