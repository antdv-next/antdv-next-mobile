import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type StepsStatus = 'wait' | 'process' | 'finish' | 'error'
export type StepsOrientation = 'horizontal' | 'vertical'

export interface StepsItem {
  key?: PropertyKey
  title?: VueNode
  subTitle?: VueNode
  content?: VueNode
  /** @deprecated Please use `content` instead */
  description?: VueNode
  icon?: VueNode
  /** Overrides the status derived from `current` */
  status?: StepsStatus
  disabled?: boolean
  class?: string
  style?: CSSProperties
}

/** Same name as antdv-next */
export type StepItem = StepsItem

export interface StepsSemanticClassNames {
  root?: string
  item?: string
  itemIcon?: string
  itemSection?: string
  itemHeader?: string
  itemTitle?: string
  itemSubtitle?: string
  itemContent?: string
  itemRail?: string
}

export interface StepsSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemIcon?: CSSProperties
  itemSection?: CSSProperties
  itemHeader?: CSSProperties
  itemTitle?: CSSProperties
  itemSubtitle?: CSSProperties
  itemContent?: CSSProperties
  itemRail?: CSSProperties
}

export interface StepsProps {
  items?: StepsItem[]
  /** Current step, counted from `initial` */
  current?: number
  /** Number of the first step */
  initial?: number
  /** Status of the current step */
  status?: StepsStatus
  orientation?: StepsOrientation
  /** @deprecated Please use `orientation` instead */
  direction?: StepsOrientation
  size?: 'default' | 'small' | 'middle' | 'large'
  type?: 'default' | 'dot'
  /** @deprecated Please use `type="dot"` instead */
  progressDot?: boolean
  /** Where the title sits relative to the icon. Defaults to `vertical` for horizontal steps. */
  titlePlacement?: StepsOrientation
  /** @deprecated Please use `titlePlacement` instead */
  labelPlacement?: StepsOrientation
  rootClass?: string
  classes?: StepsSemanticClassNames
  styles?: StepsSemanticStyles
}

export interface StepsEmits {
  'update:current': [current: number]
  'change': [current: number]
}

export interface StepsIconRenderContext {
  item: StepsItem
  index: number
  status: StepsStatus
  active: boolean
}

export interface StepsSlots {
  iconRender?: (ctx: StepsIconRenderContext) => any
}
