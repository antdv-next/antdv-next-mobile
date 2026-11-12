import type { CSSProperties, VNodeChild } from 'vue'
import type { Key, SizeType, VueNode } from '../_util/type'

export interface DescriptionsCellSemanticClassNames {
  label?: string
  content?: string
}

export interface DescriptionsCellSemanticStyles {
  label?: CSSProperties
  content?: CSSProperties
}

export interface DescriptionsItemType {
  key?: Key
  label?: VueNode
  content?: VueNode
  /** @deprecated Please use `content` instead */
  children?: VueNode
  /** Number of columns to take, `'filled'` takes the rest of the row */
  span?: number | 'filled'
  class?: string
  style?: CSSProperties
  classes?: DescriptionsCellSemanticClassNames
  styles?: DescriptionsCellSemanticStyles
}

export interface DescriptionsRenderParams {
  item: DescriptionsItemType
  index: number
  /** The item's `label` (labelRender) or `content` (contentRender) */
  value: any
}

export type DescriptionsRenderItem = (params: DescriptionsRenderParams) => VNodeChild

export interface DescriptionsSemanticClassNames {
  root?: string
  header?: string
  title?: string
  extra?: string
  label?: string
  content?: string
}

export interface DescriptionsSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  extra?: CSSProperties
  label?: CSSProperties
  content?: CSSProperties
}

export interface DescriptionsProps {
  title?: VueNode
  /** Action area at the end of the header */
  extra?: VueNode
  items?: DescriptionsItemType[]
  /** Items per row, `1` by default on mobile */
  column?: number
  layout?: 'horizontal' | 'vertical'
  bordered?: boolean
  size?: SizeType
  /** Show a colon after the label (ignored when `bordered`) */
  colon?: boolean
  /** Mobile only: push the content to the end of the row, like a list cell (horizontal layout) */
  contentAlign?: 'start' | 'end'
  labelRender?: DescriptionsRenderItem
  contentRender?: DescriptionsRenderItem
  rootClass?: string
  classes?: DescriptionsSemanticClassNames
  styles?: DescriptionsSemanticStyles
}

export interface DescriptionsSlots {
  title?: () => any
  extra?: () => any
  labelRender?: (params: DescriptionsRenderParams) => any
  contentRender?: (params: DescriptionsRenderParams) => any
}
