import type { CSSProperties } from 'vue'
import type { SizeType } from '../_util/type'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerTitlePlacement = 'start' | 'center' | 'end' | 'left' | 'right'
export type DividerVariant = 'solid' | 'dashed' | 'dotted'

export interface DividerSemanticClassNames {
  root?: string
  rail?: string
  content?: string
}

export interface DividerSemanticStyles {
  root?: CSSProperties
  rail?: CSSProperties
  content?: CSSProperties
}

export interface DividerProps {
  /** Direction of the line */
  orientation?: DividerOrientation
  /** Alias of `orientation` (kept for antdv-next compatibility) */
  type?: DividerOrientation
  /** Shortcut of `orientation="vertical"` */
  vertical?: boolean
  /** Position of the title inside a horizontal divider */
  titlePlacement?: DividerTitlePlacement
  /** Shortcut of `variant="dashed"` */
  dashed?: boolean
  variant?: DividerVariant
  /** Vertical spacing of a horizontal divider */
  size?: SizeType
  /** Show the title as plain (secondary, normal weight) text */
  plain?: boolean
  rootClass?: string
  classes?: DividerSemanticClassNames
  styles?: DividerSemanticStyles
}

export interface DividerSlots {
  default?: () => any
}
