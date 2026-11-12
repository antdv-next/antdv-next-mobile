import type { CSSProperties, VNodeChild } from 'vue'
import type { Key, VueNode } from '../_util/type'

export type TimelineItemPlacement = 'start' | 'end'
export type TimelineItemPosition = 'left' | 'right' | 'start' | 'end'
export type TimelineMode = 'left' | 'alternate' | 'right' | 'start' | 'end'
export type TimelineVariant = 'filled' | 'outlined'

export interface TimelineItemType {
  // Style
  /** `blue` | `red` | `green` | `gray` or any css color */
  color?: string
  className?: string
  class?: string
  style?: CSSProperties

  // Design
  placement?: TimelineItemPlacement
  /** @deprecated Please use `placement` instead */
  position?: TimelineItemPosition
  loading?: boolean

  // Data
  key?: Key
  /** Shown on the opposite side of the content (e.g. a time) */
  title?: VueNode
  content?: VueNode
  /** @deprecated Please use `title` instead */
  label?: VueNode
  /** @deprecated Please use `content` instead */
  children?: VueNode

  // Icon
  icon?: VueNode
  /** @deprecated Please use `icon` instead */
  dot?: VueNode
}

export interface TimelineRenderParams {
  item: TimelineItemType
  index: number
}

export interface TimelineSemanticClassNames {
  root?: string
  item?: string
  itemTitle?: string
  itemRail?: string
  itemIcon?: string
  itemContent?: string
}

export interface TimelineSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemTitle?: CSSProperties
  itemRail?: CSSProperties
  itemIcon?: CSSProperties
  itemContent?: CSSProperties
}

export interface TimelineProps {
  items?: TimelineItemType[]
  /** `start` by default; `left` / `right` are deprecated aliases of `start` / `end` */
  mode?: TimelineMode
  reverse?: boolean
  /** Adds a ghost node at the end, `true` shows the loading dot only */
  pending?: VueNode
  pendingDot?: VueNode
  variant?: TimelineVariant
  /** Width of the title column: a number of 24 grid columns, or any css width */
  titleSpan?: string | number
  dotRender?: (params: TimelineRenderParams) => VNodeChild
  labelRender?: (params: TimelineRenderParams) => VNodeChild
  contentRender?: (params: TimelineRenderParams) => VNodeChild
  rootClass?: string
  classes?: TimelineSemanticClassNames
  styles?: TimelineSemanticStyles
}

export interface TimelineSlots {
  pending?: () => any
  pendingDot?: () => any
  dotRender?: (params: TimelineRenderParams) => any
  labelRender?: (params: TimelineRenderParams) => any
  contentRender?: (params: TimelineRenderParams) => any
}
