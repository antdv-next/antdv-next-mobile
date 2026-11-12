import type { CSSProperties, Ref, StyleValue, VNode, VNodeChild } from 'vue'
import type { VueNode } from '../_util/type'

export type TourPlacement
  = | 'center'
    | 'top'
    | 'topLeft'
    | 'topRight'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'left'
    | 'leftTop'
    | 'leftBottom'
    | 'right'
    | 'rightTop'
    | 'rightBottom'

export type TourType = 'default' | 'primary'

export interface TourMaskConfig {
  style?: CSSProperties
  /** Fill color of the mask */
  color?: string
}

export interface TourArrowConfig {
  pointAtCenter: boolean
}

export interface TourGap {
  /** Space between the target and the edge of the highlighted area, `[horizontal, vertical]` */
  offset?: number | [number, number]
  /** Corner radius of the highlighted area */
  radius?: number
}

export interface TourScrollIntoViewOptions {
  behavior?: 'auto' | 'instant' | 'smooth'
  block?: 'start' | 'center' | 'end' | 'nearest'
  inline?: 'start' | 'center' | 'end' | 'nearest'
}

export interface TourClosableConfig {
  closeIcon?: VueNode
}

/** An element, or a component instance (its root element is used) */
export type TourTargetElement = HTMLElement | { $el: any } | null | undefined
export type TourTarget = TourTargetElement | Ref<TourTargetElement> | (() => TourTargetElement)

export interface TourButtonProps {
  /** Button text */
  children?: VueNode
  onClick?: (event: MouseEvent) => void
  class?: string
  style?: StyleValue
}

export interface TourSemanticClassNames {
  root?: string
  cover?: string
  mask?: string
  section?: string
  footer?: string
  actions?: string
  indicator?: string
  indicators?: string
  header?: string
  title?: string
  description?: string
  close?: string
}

export interface TourSemanticStyles {
  root?: CSSProperties
  cover?: CSSProperties
  mask?: CSSProperties
  section?: CSSProperties
  footer?: CSSProperties
  actions?: CSSProperties
  indicator?: CSSProperties
  indicators?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  description?: CSSProperties
  close?: CSSProperties
}

export interface TourStepProps {
  /** Element the panel points at. Empty: the panel is centered on the screen. */
  target?: TourTarget
  title?: VueNode
  description?: VueNode
  /** Picture or video above the title */
  cover?: VueNode
  placement?: TourPlacement
  arrow?: boolean | TourArrowConfig
  mask?: boolean | TourMaskConfig
  type?: TourType
  nextButtonProps?: TourButtonProps
  prevButtonProps?: TourButtonProps
  scrollIntoViewOptions?: boolean | TourScrollIntoViewOptions
  closable?: boolean | TourClosableConfig
  closeIcon?: VueNode
  /** Class of the panel of this step */
  class?: string
  /** Style of the panel of this step */
  style?: CSSProperties
  classes?: TourSemanticClassNames
  styles?: TourSemanticStyles
}

/** Same name as antdv-next */
export type TourStepItem = TourStepProps

export interface TourStepInfo {
  step: TourStepProps
  index: number
}

export interface TourActionsInfo {
  current: number
  total: number
}

export interface TourButtonInfo {
  current: number
  isFirst: boolean
  isLast: boolean
}

export interface TourProps {
  /** Whether the tour is visible. Supports `v-model:open`. */
  open?: boolean
  defaultOpen?: boolean
  /** Index of the current step. Supports `v-model:current`. */
  current?: number
  defaultCurrent?: number
  steps?: TourStepProps[]
  /** Affects the background and the text color of the panel */
  type?: TourType
  /** Show the mask, or configure its style / fill color */
  mask?: boolean | TourMaskConfig
  arrow?: boolean | TourArrowConfig
  /** Position of the panel relative to the target. Default `bottom` (`center` without a target). */
  placement?: TourPlacement
  /** Space and corner radius of the highlighted area */
  gap?: TourGap
  /** Block taps on the highlighted target */
  disabledInteraction?: boolean
  /** Scroll the target into view first; pass `false` to disable or the options of `scrollIntoView` */
  scrollIntoViewOptions?: boolean | TourScrollIntoViewOptions
  indicatorsRender?: (current: number, total: number) => VNodeChild
  /** `originNode` is the default prev / next buttons */
  actionsRender?: (originNode: VNode, info: TourActionsInfo) => VNodeChild
  closable?: boolean | TourClosableConfig
  closeIcon?: VueNode
  /** Close on ESC, switch steps with the left / right arrow keys (external keyboards) */
  keyboard?: boolean
  /** Lock page scroll while the mask is shown */
  lockScroll?: boolean
  zIndex?: number
  /** Mount node of the tour layer. Default `document.body`; `false` renders in place. */
  getPopupContainer?: ((node: HTMLElement) => HTMLElement) | false
  rootClass?: string
  classes?: TourSemanticClassNames
  styles?: TourSemanticStyles
}

export interface TourEmits {
  'update:open': [open: boolean]
  'update:current': [current: number]
  /** The step changed */
  'change': [current: number]
  /** The tour was closed (close icon, ESC or finish) */
  'close': [current: number]
  /** The last step was confirmed */
  'finish': []
}

export interface TourSlots {
  indicatorsRender?: (props: TourActionsInfo) => any
  actionsRender?: (props: { originNode: VNode, current: number, total: number }) => any
  nextButton?: (props: TourButtonInfo) => any
  prevButton?: (props: TourButtonInfo) => any
  coverRender?: (props: TourStepInfo) => any
  titleRender?: (props: TourStepInfo) => any
  descriptionRender?: (props: TourStepInfo) => any
  closeIcon?: (props: TourStepInfo) => any
}

export interface TourExpose {
  /** Re-measure the target and re-position the panel (e.g. after the layout changed) */
  updatePosition: () => void
}
