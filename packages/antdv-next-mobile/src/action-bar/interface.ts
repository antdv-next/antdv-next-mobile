import type { CSSProperties } from 'vue'
import type { RenderNodeFn, VueNode } from '../_util/type'
import type {
  ButtonColorType,
  ButtonHTMLType,
  ButtonSemanticClassNames,
  ButtonSemanticStyles,
  ButtonType,
  ButtonVariantType,
} from '../button/interface'

// ---------- ActionBar ----------
export interface ActionBarSemanticClassNames {
  root?: string
  content?: string
  prefix?: string
}

export interface ActionBarSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  prefix?: CSSProperties
}

export interface ActionBarProps {
  /** Fix to the bottom of the viewport */
  fixed?: boolean
  /** Reserve the height of the bar in the document flow when `fixed` */
  placeholder?: boolean
  /** Add the bottom safe-area inset (home indicator) */
  safeArea?: boolean
  /** Show the top hairline */
  bordered?: boolean
  zIndex?: number
  /** Free content before the actions that takes the remaining width (price, summary ...) */
  prefix?: VueNode
  rootClass?: string
  classes?: ActionBarSemanticClassNames
  styles?: ActionBarSemanticStyles
}

export interface ActionBarSlots {
  default?: () => any
  prefix?: () => any
}

// ---------- ActionBarIcon ----------
export interface ActionBarIconSemanticClassNames {
  root?: string
  icon?: string
  text?: string
  badge?: string
}

export interface ActionBarIconSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  text?: CSSProperties
  badge?: CSSProperties
}

export interface ActionBarIconProps {
  icon?: VueNode
  text?: VueNode
  /** Number / text badge, `true` renders a dot */
  badge?: number | string | boolean
  disabled?: boolean
  rootClass?: string
  classes?: ActionBarIconSemanticClassNames
  styles?: ActionBarIconSemanticStyles
}

export interface ActionBarIconEmits {
  click: [event: MouseEvent]
}

export interface ActionBarIconSlots {
  /** The text (same as the `text` slot) */
  default?: () => any
  icon?: () => any
  text?: () => any
}

// ---------- ActionBarButton ----------
export interface ActionBarButtonProps {
  /** Syntactic sugar of `color` + `variant`, same as Button */
  type?: ButtonType
  color?: ButtonColorType
  variant?: ButtonVariantType
  danger?: boolean
  ghost?: boolean
  icon?: VueNode
  iconPlacement?: 'start' | 'end'
  disabled?: boolean
  loading?: boolean | { delay?: number, icon?: RenderNodeFn }
  href?: string
  target?: string
  htmlType?: ButtonHTMLType
  rootClass?: string
  classes?: ButtonSemanticClassNames
  styles?: ButtonSemanticStyles
}

export interface ActionBarButtonEmits {
  click: [event: MouseEvent]
}

export interface ActionBarButtonSlots {
  default?: () => any
  icon?: () => any
}
