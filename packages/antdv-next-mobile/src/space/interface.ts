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
