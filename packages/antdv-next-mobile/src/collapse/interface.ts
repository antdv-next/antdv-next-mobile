import type { CSSProperties, VNodeChild } from 'vue'
import type { Key, SizeType, VueNode } from '../_util/type'

export type CollapseCollapsibleType = 'header' | 'icon' | 'disabled'
export type CollapseExpandIconPlacement = 'start' | 'end'

export interface CollapseSemanticClassNames {
  root?: string
  header?: string
  title?: string
  body?: string
  icon?: string
}

export interface CollapseSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  title?: CSSProperties
  body?: CSSProperties
  icon?: CSSProperties
}

export interface CollapseItemType {
  key?: Key
  label?: VueNode
  /** Content of the panel (same name as antdv-next) */
  content?: VueNode
  /** Alias of `content` */
  children?: VueNode
  extra?: VueNode
  showArrow?: boolean
  collapsible?: CollapseCollapsibleType
  forceRender?: boolean
  class?: string
  style?: CSSProperties
  classes?: CollapseSemanticClassNames
  styles?: CollapseSemanticStyles
}

/** What `expandIcon` receives */
export interface CollapsePanelInfo {
  panelKey: Key
  isActive: boolean
  header?: VueNode
  extra?: VueNode
  showArrow?: boolean
  forceRender?: boolean
  collapsible?: CollapseCollapsibleType
}

export interface CollapseProps {
  items?: CollapseItemType[]
  activeKey?: Key | Key[]
  defaultActiveKey?: Key | Key[]
  /** Only one panel can be expanded at a time */
  accordion?: boolean
  /** Hairlines around and between the panels */
  bordered?: boolean
  /** Transparent background, no hairlines */
  ghost?: boolean
  size?: SizeType
  expandIcon?: (panelProps: CollapsePanelInfo) => VNodeChild
  expandIconPlacement?: CollapseExpandIconPlacement
  /** @deprecated Please use `expandIconPlacement` instead */
  expandIconPosition?: CollapseExpandIconPlacement
  collapsible?: CollapseCollapsibleType
  /** Unmount the content of a panel when it is collapsed */
  destroyOnHidden?: boolean
  rootClass?: string
  classes?: CollapseSemanticClassNames
  styles?: CollapseSemanticStyles
}

export interface CollapseEmits {
  'update:activeKey': [key: Key[]]
  'change': [key: Key[]]
}

export interface CollapseItemSlotContext {
  item: CollapseItemType
  index: number
}

export interface CollapseSlots {
  /** Declarative `<am-collapse-panel>` children, rendered after `items` */
  default?: () => any
  expandIcon?: (panelProps: CollapsePanelInfo) => any
  labelRender?: (ctx: CollapseItemSlotContext) => any
  contentRender?: (ctx: CollapseItemSlotContext) => any
}

export interface CollapsePanelProps {
  header?: VueNode
  extra?: VueNode
  showArrow?: boolean
  collapsible?: CollapseCollapsibleType
  forceRender?: boolean
  classes?: CollapseSemanticClassNames
  styles?: CollapseSemanticStyles
}

export interface CollapsePanelSlots {
  default?: () => any
  header?: () => any
  extra?: () => any
}
