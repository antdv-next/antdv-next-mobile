import type { CSSProperties } from 'vue'
import type { Key, RenderNodeFn, VueNode } from '../_util/type'

export interface TabBarItem {
  key: Key
  title?: VueNode
  /** A node, or a render function that receives the active state */
  icon?: RenderNodeFn<boolean>
  /** Number / text badge, `true` renders a dot */
  badge?: number | string | boolean
  disabled?: boolean
  class?: string
  style?: CSSProperties
}

export interface TabBarSemanticClassNames {
  root?: string
  content?: string
  item?: string
  icon?: string
  title?: string
  badge?: string
}

export interface TabBarSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  item?: CSSProperties
  icon?: CSSProperties
  title?: CSSProperties
  badge?: CSSProperties
}

export interface TabBarProps {
  items?: TabBarItem[]
  activeKey?: Key
  /** Defaults to the key of the first item */
  defaultActiveKey?: Key
  /** Fix to the bottom of the viewport */
  fixed?: boolean
  /** Reserve the height of the bar in the document flow when `fixed` */
  placeholder?: boolean
  /** Add the bottom safe-area inset (home indicator) */
  safeArea?: boolean
  /** Show the top hairline */
  bordered?: boolean
  zIndex?: number
  rootClass?: string
  classes?: TabBarSemanticClassNames
  styles?: TabBarSemanticStyles
}

export interface TabBarEmits {
  'update:activeKey': [key: Key]
  'change': [key: Key]
}

export interface TabBarItemSlotContext {
  item: TabBarItem
  index: number
  active: boolean
}

export interface TabBarSlots {
  icon?: (ctx: TabBarItemSlotContext) => any
  title?: (ctx: TabBarItemSlotContext) => any
}
