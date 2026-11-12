import type { CSSProperties, VNodeChild } from 'vue'
import type { Key } from '../_util/type'

/** Key of a row: a field name or a getter */
export type ListyRowKey = string | ((item: any, index: number) => Key)

export type ListyScrollAlign = 'top' | 'bottom' | 'auto'

export interface ListyGroup {
  /** Group key of an item (items with the same key form one group), or one fixed key for every item */
  key: ((item: any) => Key) | Key
  /** Renders the group header; the `groupTitle` slot wins. Default: the group key. */
  title?: (groupKey: Key, items: any[]) => VNodeChild
}

export interface ListyClassNames {
  root?: string
  item?: string
  groupHeader?: string
}

export interface ListyStyles {
  root?: CSSProperties
  item?: CSSProperties
  groupHeader?: CSSProperties
}

export interface ListySemanticType {
  classes?: ListyClassNames
  styles?: ListyStyles
}

export interface ListyKeyScrollToConfig {
  /** `rowKey` of the target item */
  key: Key
  align?: ListyScrollAlign
  offset?: number
}

export interface ListyGroupScrollToConfig {
  groupKey: Key
  align?: ListyScrollAlign
  offset?: number
}

export interface ListyPositionScrollToConfig {
  left?: number
  top?: number
}

export type ListyScrollToConfig
  = | number
    | null
    | ListyKeyScrollToConfig
    | ListyPositionScrollToConfig
    | ListyGroupScrollToConfig

export interface ListyRef {
  scrollTo: (config?: ListyScrollToConfig) => void
}

export interface ListyProps {
  /** Data source */
  items?: any[]
  /** Unique key of an item: a field name or a getter */
  rowKey: ListyRowKey
  /** Renders a row; the same-named slot wins */
  itemRender?: (item: any, index: number) => VNodeChild
  /** Group config: items with the same group key are collected under one header */
  group?: ListyGroup
  /** Keep the header of the current group at the top while scrolling */
  sticky?: boolean
  /** Max height of the scroll container (numbers are px); the list scrolls once the content is taller */
  height?: number | string
  /** Only mount the rows around the visible window. `false` renders every row with the same DOM. */
  virtual?: boolean
  /** Width of the content in px: the list scrolls horizontally when it is wider than the container */
  scrollWidth?: number
  /** Press feedback on rows */
  rowHoverable?: boolean
  /** Estimated row height in px, used before a row is measured */
  itemHeight?: number
  rootClass?: string
  classes?: ListyClassNames
  styles?: ListyStyles
}

export interface ListyEmits {
  /** Native scroll event of the scroll container */
  scroll: [event: Event]
  /** Scrolled close to the end of the list, the hook for loading more */
  reachEnd: []
}

export interface ListySlots {
  /** Renders a row. Called like the prop: the slot props are the item itself (`#itemRender="item"`). */
  itemRender?: (item: any) => any
  /** Renders a group header, wins over `group.title` */
  groupTitle?: (ctx: { groupKey: Key, items: any[] }) => any
}
