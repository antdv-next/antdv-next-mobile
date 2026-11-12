import type { CSSProperties, VNodeChild } from 'vue'
import type { VueNode } from '../_util/type'

export type TypographyBaseType = 'secondary' | 'success' | 'warning' | 'danger'
export type TypographyTitleLevel = 1 | 2 | 3 | 4 | 5

export interface TypographyCopyConfig {
  /** Text to copy, the rendered text by default */
  text?: string | (() => string | Promise<string>)
  /** Custom icons: `[copyIcon, copiedIcon]` or a single node */
  icon?: VueNode | VueNode[]
}

export interface TypographyEllipsisConfig {
  /** Max number of rows, `1` by default */
  rows?: number
  /** `true`: can be expanded once; `'collapsible'`: can be expanded and collapsed again */
  expandable?: boolean | 'collapsible'
  /** Custom expand / collapse text */
  symbol?: VNodeChild | ((expanded: boolean) => VNodeChild)
  defaultExpanded?: boolean
  /** Controlled expanded state */
  expanded?: boolean
}

export interface TypographySemanticClassNames {
  root?: string
  /** The expand / collapse and copy buttons */
  action?: string
}

export interface TypographySemanticStyles {
  root?: CSSProperties
  action?: CSSProperties
}

export interface TypographyProps {
  /** Root element, `article` by default */
  component?: string
  rootClass?: string
}

export interface TypographyBaseProps {
  type?: TypographyBaseType
  disabled?: boolean
  mark?: boolean
  code?: boolean
  keyboard?: boolean
  underline?: boolean
  delete?: boolean
  strong?: boolean
  italic?: boolean
  /** Truncate overflowing text, optionally with an expand / collapse button */
  ellipsis?: boolean | TypographyEllipsisConfig
  copyable?: boolean | TypographyCopyConfig
  rootClass?: string
  classes?: TypographySemanticClassNames
  styles?: TypographySemanticStyles
}

export interface TypographyTextProps extends TypographyBaseProps {}

export interface TypographyParagraphProps extends TypographyBaseProps {}

export interface TypographyTitleProps extends TypographyBaseProps {
  level?: TypographyTitleLevel
}

export interface TypographyBaseEmits {
  'expand': [expanded: boolean, event: MouseEvent]
  'update:expanded': [expanded: boolean]
  'copy': [event: MouseEvent]
}

export interface TypographySlots {
  default?: () => any
}

export interface TypographyBaseSlots {
  default?: () => any
  /** Custom expand / collapse text, wins over `ellipsis.symbol` */
  ellipsisSymbol?: (ctx: { expanded: boolean }) => any
  /** Custom copy icon, wins over `copyable.icon` */
  copyIcon?: (ctx: { copied: boolean }) => any
}
