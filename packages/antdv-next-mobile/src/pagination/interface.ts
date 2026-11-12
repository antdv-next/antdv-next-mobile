import type { CSSProperties, VNodeChild } from 'vue'
import type { SizeType, VueNode } from '../_util/type'

export type PaginationItemType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next'

export interface PaginationSemanticClassNames {
  root?: string
  item?: string
}

export interface PaginationSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
}

export interface PaginationProps {
  current?: number
  defaultCurrent?: number
  /** Total number of data items */
  total?: number
  pageSize?: number
  /** `prev` / `next` buttons with `current / total` in the middle */
  simple?: boolean
  disabled?: boolean
  size?: SizeType
  /** Show fewer page items (no siblings around the current page) */
  showLessItems?: boolean
  hideOnSinglePage?: boolean
  showTotal?: (total: number, range: [number, number]) => VNodeChild
  itemRender?: (page: number, type: PaginationItemType, element: VNodeChild) => VNodeChild
  prevIcon?: VueNode
  nextIcon?: VueNode
  rootClass?: string
  classes?: PaginationSemanticClassNames
  styles?: PaginationSemanticStyles
}

export interface PaginationEmits {
  'update:current': [page: number]
  'change': [page: number, pageSize: number]
}

export interface PaginationSlots {
  itemRender?: (ctx: { page: number, type: PaginationItemType, element: VNodeChild }) => any
  showTotal?: (ctx: { total: number, range: [number, number] }) => any
  prevIcon?: () => any
  nextIcon?: () => any
}
