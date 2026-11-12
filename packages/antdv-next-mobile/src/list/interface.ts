import type { CSSProperties, VNodeChild } from 'vue'
import type { Key, SizeType, VueNode } from '../_util/type'
import type { VirtualListScrollToConfig } from '../virtual-list/interface'

export type ListMode = 'default' | 'card'

export interface ListLocale {
  emptyText?: VueNode
}

export interface ListSemanticClassNames {
  root?: string
  header?: string
  body?: string
  footer?: string
}

export interface ListSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
}

export interface ListProps {
  header?: VueNode
  footer?: VueNode
  /** `card` renders an inset, rounded group */
  mode?: ListMode
  /** Hairlines above and below the list (default mode only) */
  bordered?: boolean
  size?: SizeType
  /** Data mode: render every entry with the `renderItem` slot / prop */
  dataSource?: any[]
  renderItem?: (item: any, index: number) => VNodeChild
  /** Key of an entry: a field name or a function */
  rowKey?: string | ((item: any, index: number) => Key)
  /**
   * Data mode: only mount the rows around the visible window (through `VirtualList`).
   * The list then scrolls by itself and needs a `height`. Default `false` (a list normally scrolls with the page).
   */
  virtual?: boolean
  /** Height of the scroll area in virtual mode */
  height?: number | string
  /** Virtual mode: estimated row height in px, used before a row is measured. Default: the min height of an item (40 / 48 / 56). */
  itemHeight?: number
  loading?: boolean
  locale?: ListLocale
  rootClass?: string
  classes?: ListSemanticClassNames
  styles?: ListSemanticStyles
}

export interface ListEmits {
  /** Virtual mode: scrolled close to the end of the list, the hook for loading more */
  reachEnd: []
}

export interface ListExpose {
  /** Virtual mode: scroll to an offset (px), or to a row by `index` / `key` (`rowKey`) */
  scrollTo: (target: number | VirtualListScrollToConfig) => void
}

export interface ListSlots {
  default?: () => any
  header?: () => any
  footer?: () => any
  renderItem?: (ctx: { item: any, index: number }) => any
  emptyText?: () => any
}

export interface ListItemSemanticClassNames {
  root?: string
  prefix?: string
  content?: string
  title?: string
  description?: string
  extra?: string
  arrow?: string
}

export interface ListItemSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  content?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
  extra?: CSSProperties
  arrow?: CSSProperties
}

export interface ListItemProps {
  /** Main content, same as the default slot */
  title?: VueNode
  /** Secondary text below the title */
  description?: VueNode
  /** Left area: icon / avatar */
  prefix?: VueNode
  /** Right area: value / status text */
  extra?: VueNode
  /** Right arrow. Defaults to `true` when the item is clickable. */
  arrow?: VueNode
  /** Press feedback. Defaults to `true` when a `click` listener or `href` is set. */
  clickable?: boolean
  disabled?: boolean
  /** Renders the item as `<a>` */
  href?: string
  target?: string
  /** Vertical alignment of prefix / extra / arrow */
  align?: 'center' | 'start'
  rootClass?: string
  classes?: ListItemSemanticClassNames
  styles?: ListItemSemanticStyles
}

export interface ListItemEmits {
  click: [event: MouseEvent]
}

export interface ListItemSlots {
  default?: () => any
  title?: () => any
  description?: () => any
  prefix?: () => any
  extra?: () => any
  arrow?: () => any
}
