import type { CSSProperties } from 'vue'
import type { SizeType, VueNode } from '../_util/type'

export type SpaceSize = SizeType | number | string
export type SpaceOrientation = 'horizontal' | 'vertical'
export type SpaceAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch'

export interface SpaceSemanticClassNames {
  root?: string
  item?: string
  separator?: string
}

export interface SpaceSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  separator?: CSSProperties
}

export interface SpaceProps {
  /** `small` (8px) / `middle` (16px) / `large` (24px), a number (px), a CSS length or `[horizontal, vertical]` */
  size?: SpaceSize | [SpaceSize, SpaceSize]
  orientation?: SpaceOrientation
  /** Alias of `orientation` (kept for antdv-next compatibility) */
  direction?: SpaceOrientation
  /** Shortcut of `orientation="vertical"` */
  vertical?: boolean
  align?: SpaceAlign
  /** Auto wrap line, only for horizontal */
  wrap?: boolean
  /** Node rendered between items */
  separator?: VueNode
  /** Mobile only: take the full width of the parent */
  block?: boolean
  rootClass?: string
  classes?: SpaceSemanticClassNames
  styles?: SpaceSemanticStyles
}

export interface SpaceSlots {
  default?: () => any
  separator?: () => any
}

export interface SpaceCompactProps {
  /** Size of every item in the group. Items without their own `size` follow it. */
  size?: SizeType
  orientation?: SpaceOrientation
  /** Alias of `orientation` (kept for antdv-next compatibility) */
  direction?: SpaceOrientation
  /** Shortcut of `orientation="vertical"` */
  vertical?: boolean
  /** Take the full width of the parent; inputs and picker fields share the remaining space */
  block?: boolean
  rootClass?: string
}

export interface SpaceCompactSlots {
  default?: () => any
}

export interface SpaceAddonProps {
  /** `outlined` (default, bordered with a tinted background), `filled` or `borderless` */
  variant?: 'outlined' | 'filled' | 'borderless'
  size?: SizeType
  disabled?: boolean
  rootClass?: string
}

export interface SpaceAddonSlots {
  default?: () => any
}
