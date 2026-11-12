import type { CSSProperties, VNodeChild } from 'vue'
import type { Key, VueNode } from '../_util/type'

export type MasonryGutter = number | string

export interface MasonryItemType<T = any> {
  key: Key
  /** Pin the item to a column (0-based); out-of-range values are clamped */
  column?: number
  /** Known height in px: the item is placed before it is measured; the measured height wins afterwards */
  height?: number
  /** Content of the item, wins over `itemRender` */
  children?: VueNode
  /** Custom data, handed to `itemRender` */
  data: T
  class?: string
  style?: CSSProperties
}

export interface MasonryItemRenderInfo<T = any> extends MasonryItemType<T> {
  index: number
  /** Column the item currently sits in (`0` until it is placed) */
  column: number
}

export interface MasonryLayoutInfo<T = any> extends MasonryItemType<T> {
  column: number
}

export interface MasonrySemanticClassNames {
  root?: string
  item?: string
}

export interface MasonrySemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
}

export interface MasonryProps {
  items?: MasonryItemType[]
  /** Number of columns */
  columns?: number
  /**
   * Spacing between items, `[horizontal, vertical]` for both directions (vertical falls back to horizontal).
   * Numbers are px, strings are CSS lengths. Defaults to the `--am-masonry-gutter` token.
   */
  gutter?: MasonryGutter | [MasonryGutter, MasonryGutter]
  /** Custom item render; the same-named slot wins */
  itemRender?: (itemInfo: MasonryItemRenderInfo) => VNodeChild
  /** Keep observing the size of every item and re-layout when one changes */
  fresh?: boolean
  rootClass?: string
  classes?: MasonrySemanticClassNames
  styles?: MasonrySemanticStyles
}

export interface MasonryEmits {
  /** The column of an item changed (fired once every item is placed) */
  layoutChange: [sortInfo: MasonryLayoutInfo[]]
}

export interface MasonrySlots {
  itemRender?: (itemInfo: MasonryItemRenderInfo) => any
}

export interface MasonryRef {
  nativeElement: HTMLDivElement | undefined
  /** Measure the items again and re-layout (e.g. after a font or theme change) */
  layout: () => void
}
