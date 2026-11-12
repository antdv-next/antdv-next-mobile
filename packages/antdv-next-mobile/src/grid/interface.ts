import type { Numeric } from '../_util/type'

export type RowAlign = 'top' | 'middle' | 'bottom' | 'stretch'
export type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
export type RowGutter = number | string

export interface RowProps {
  /** Spacing between columns, `[horizontal, vertical]` for both directions. Numbers are px. */
  gutter?: RowGutter | [RowGutter, RowGutter]
  align?: RowAlign
  justify?: RowJustify
  /** Auto wrap line */
  wrap?: boolean
  rootClass?: string
}

export interface RowSlots {
  default?: () => any
}

export type ColSpanType = number | string
export type ColFlexType = number | 'none' | 'auto' | string

export interface ColProps {
  /** Number of cells to occupy (24 columns), `0` hides the column */
  span?: ColSpanType
  /** Number of cells to offset from the start */
  offset?: ColSpanType
  /** Raster order */
  order?: Numeric
  /** Number of cells that the column is moved to the end */
  push?: ColSpanType
  /** Number of cells that the column is moved to the start */
  pull?: ColSpanType
  /** `flex` layout style, e.g. `1`, `'100px'`, `'auto'`, `'1 1 200px'` */
  flex?: ColFlexType
  rootClass?: string
}

export interface ColSlots {
  default?: () => any
}
