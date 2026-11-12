import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export interface NavBarSemanticClassNames {
  root?: string
  content?: string
  left?: string
  back?: string
  title?: string
  subTitle?: string
  right?: string
}

export interface NavBarSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  left?: CSSProperties
  back?: CSSProperties
  title?: CSSProperties
  subTitle?: CSSProperties
  right?: CSSProperties
}

export interface NavBarProps {
  /** Title, same as the default slot */
  title?: VueNode
  subTitle?: VueNode
  /** Text next to the back arrow. `null` / `false` hides the whole back area. */
  back?: VueNode
  /** Custom back arrow. `null` / `false` hides the arrow only. */
  backIcon?: VueNode
  /** Extra content on the left, after the back area */
  left?: VueNode
  /** Content on the right */
  right?: VueNode
  /** Fix to the top of the viewport */
  fixed?: boolean
  /** Reserve the height of the bar in the document flow when `fixed` */
  placeholder?: boolean
  /** Add the top safe-area inset (status bar / notch) */
  safeArea?: boolean
  /** Show the bottom hairline */
  bordered?: boolean
  zIndex?: number
  rootClass?: string
  classes?: NavBarSemanticClassNames
  styles?: NavBarSemanticStyles
}

export interface NavBarEmits {
  back: [event: MouseEvent]
}

export interface NavBarSlots {
  default?: () => any
  title?: () => any
  subTitle?: () => any
  back?: () => any
  backIcon?: () => any
  left?: () => any
  right?: () => any
}
