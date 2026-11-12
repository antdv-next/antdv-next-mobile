import type { CSSProperties } from 'vue'
import type { Key, Numeric, SizeType, VueNode } from '../_util/type'

export type TabsType = 'line' | 'card' | 'capsule'
export type TabsPlacement = 'top' | 'bottom'

export interface TabsItem {
  key: Key
  label?: VueNode
  /** Content of the tab pane (same name as antdv-next) */
  content?: VueNode
  /** Alias of `content` */
  children?: VueNode
  icon?: VueNode
  disabled?: boolean
  /** Render the pane even before it has been activated */
  forceRender?: boolean
  /** Unmount the pane when it is hidden, overrides `Tabs.destroyOnHidden` */
  destroyOnHidden?: boolean
  class?: string
  style?: CSSProperties
}

/** Same name as antdv-next */
export type TabItem = TabsItem

export interface TabsAnimated {
  inkBar?: boolean
  tabPane?: boolean
}

export interface TabsSemanticClassNames {
  root?: string
  header?: string
  item?: string
  indicator?: string
  body?: string
  content?: string
}

export interface TabsSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  item?: CSSProperties
  indicator?: CSSProperties
  body?: CSSProperties
  content?: CSSProperties
}

export interface TabsProps {
  items?: TabsItem[]
  activeKey?: Key
  /** Defaults to the key of the first enabled item */
  defaultActiveKey?: Key
  type?: TabsType
  size?: SizeType
  /** Center the tabs */
  centered?: boolean
  tabPlacement?: TabsPlacement
  /** @deprecated Please use `tabPlacement` instead */
  tabPosition?: TabsPlacement
  /** `true` animates both the ink bar and the panes. Default: `{ inkBar: true, tabPane: false }` */
  animated?: boolean | TabsAnimated
  destroyOnHidden?: boolean
  /** Swipe the content horizontally to switch tabs */
  swipeable?: boolean
  /** Stick the tab bar to the top of the scroll container */
  sticky?: boolean
  /** Offset from the top when `sticky` */
  offsetTop?: Numeric
  /** Tabs share the width equally. Defaults to `true` when there are at most 4 tabs. */
  stretch?: boolean
  rootClass?: string
  classes?: TabsSemanticClassNames
  styles?: TabsSemanticStyles
}

export interface TabsEmits {
  'update:activeKey': [activeKey: Key]
  'change': [activeKey: Key]
  'tabClick': [key: Key, event: MouseEvent]
}

export interface TabsItemSlotContext {
  item: TabsItem
  index: number
}

export interface TabsSlots {
  /** Fallback content of every pane that has no `content` */
  default?: (ctx: TabsItemSlotContext) => any
  labelRender?: (ctx: TabsItemSlotContext) => any
  contentRender?: (ctx: TabsItemSlotContext) => any
  leftExtra?: () => any
  rightExtra?: () => any
}
