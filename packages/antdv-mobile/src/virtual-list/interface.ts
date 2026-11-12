import type { CSSProperties } from 'vue'
import type { Key, Numeric } from '../_util/type'

export type VirtualListItemKey = string | ((item: any, index: number) => Key)

export interface VirtualListScrollToConfig {
  /** scroll to the item at this index */
  index?: number
  /** scroll to the item with this key */
  key?: Key
  /** where the item lands in the viewport. Default `'start'`. */
  align?: 'start' | 'center' | 'end' | 'auto'
  /** extra distance kept before the item */
  offset?: number
  behavior?: ScrollBehavior
}

export interface VirtualListProps {
  /** the full data source */
  data?: any[]
  /** height of the scroll container. Without it the list grows with its content (set a height / max-height by css). */
  height?: Numeric
  /** item height in px. Exact when `fixed`, otherwise the estimate used before an item is measured. */
  itemHeight?: number
  /** field name (or getter) of the unique key of an item. Default: the index. */
  itemKey?: VirtualListItemKey
  /** `false` renders every item (keeps the same DOM structure and API) */
  virtual?: boolean
  /** every item is exactly `itemHeight` tall: skips measuring, cheapest mode */
  fixed?: boolean
  /** extra items rendered before / after the viewport */
  overscan?: number
  /** tag of the inner list element */
  component?: string
  rootClass?: string
  classes?: { root?: string, holder?: string, list?: string, item?: string }
  styles?: { root?: CSSProperties, holder?: CSSProperties, list?: CSSProperties, item?: CSSProperties }
}

export interface VirtualListEmits {
  scroll: [event: Event]
  /** rendered window changed: `[start, end)` */
  visibleChange: [start: number, end: number]
  /** scrolled within `threshold` of the end, handy for loading more */
  reachEnd: []
}

export interface VirtualListSlots {
  default?: (ctx: { item: any, index: number }) => any
  /** rendered inside the scroll container before the items (scrolls with them) */
  header?: () => any
  /** rendered inside the scroll container after the items */
  footer?: () => any
}

export interface VirtualListExpose {
  scrollTo: (target: number | VirtualListScrollToConfig) => void
  /** the scroll container */
  nativeElement: HTMLElement | undefined
  getScrollTop: () => number
}
