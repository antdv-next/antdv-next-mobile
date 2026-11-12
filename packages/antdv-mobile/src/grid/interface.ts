import type { CSSProperties } from 'vue'
import type { Key, Numeric, VueNode } from '../_util/type'

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

export type GridGap = number | string
export type GridOrientation = 'horizontal' | 'vertical'

export interface GridItemType {
  key?: Key
  icon?: VueNode
  title?: VueNode
  /** Number / text badge, `true` renders a dot */
  badge?: number | string | boolean
  /** Number of columns the item spans */
  span?: Numeric
  disabled?: boolean
  class?: string
  style?: CSSProperties
}

export interface GridSemanticClassNames {
  root?: string
  item?: string
  icon?: string
  title?: string
  badge?: string
}

export interface GridSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  icon?: CSSProperties
  title?: CSSProperties
  badge?: CSSProperties
}

export interface GridProps {
  /** Data-driven items; `GridItem` children of the default slot are rendered after them */
  items?: GridItemType[]
  /** Number of columns */
  columns?: Numeric
  /** Spacing between items, `[horizontal, vertical]` for both directions. Numbers are px. */
  gap?: GridGap | [GridGap, GridGap]
  /** Show the hairlines between items */
  bordered?: boolean
  /** Keep every item square */
  square?: boolean
  /** `vertical`: icon above the title; `horizontal`: icon beside the title */
  orientation?: GridOrientation
  /** Press feedback and button semantics on the items */
  clickable?: boolean
  /** Size of the icons. Numbers are px. */
  iconSize?: Numeric
  rootClass?: string
  classes?: GridSemanticClassNames
  styles?: GridSemanticStyles
}

export interface GridEmits {
  /** An item of `items` was tapped (disabled items do not fire) */
  itemClick: [item: GridItemType, index: number, event: MouseEvent]
}

export interface GridItemSlotContext {
  item: GridItemType
  index: number
}

export interface GridSlots {
  /** `GridItem`s */
  default?: () => any
  /** Icon of the `items` entries */
  icon?: (ctx: GridItemSlotContext) => any
  /** Title of the `items` entries */
  title?: (ctx: GridItemSlotContext) => any
}

export interface GridItemSemanticClassNames {
  root?: string
  icon?: string
  title?: string
  badge?: string
}

export interface GridItemSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  title?: CSSProperties
  badge?: CSSProperties
}

export interface GridItemProps {
  icon?: VueNode
  title?: VueNode
  /** Number / text badge, `true` renders a dot */
  badge?: number | string | boolean
  /** Number of columns the item spans */
  span?: Numeric
  disabled?: boolean
  rootClass?: string
  classes?: GridItemSemanticClassNames
  styles?: GridItemSemanticStyles
}

export interface GridItemEmits {
  click: [event: MouseEvent]
}

export interface GridItemSlots {
  /** Replaces the whole content of the item */
  default?: () => any
  icon?: () => any
  title?: () => any
}
