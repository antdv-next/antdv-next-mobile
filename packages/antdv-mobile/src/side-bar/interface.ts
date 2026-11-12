import type { CSSProperties } from 'vue'
import type { Key, VueNode } from '../_util/type'

export interface SideBarItem {
  key: Key
  title?: VueNode
  /** Number / text badge, `true` renders a dot */
  badge?: number | string | boolean
  disabled?: boolean
  class?: string
  style?: CSSProperties
}

export interface SideBarSemanticClassNames {
  root?: string
  item?: string
  title?: string
  badge?: string
}

export interface SideBarSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  title?: CSSProperties
  badge?: CSSProperties
}

export interface SideBarProps {
  items?: SideBarItem[]
  activeKey?: Key
  /** Defaults to the key of the first item */
  defaultActiveKey?: Key
  rootClass?: string
  classes?: SideBarSemanticClassNames
  styles?: SideBarSemanticStyles
}

export interface SideBarEmits {
  'update:activeKey': [key: Key]
  'change': [key: Key]
}

export interface SideBarItemSlotContext {
  item: SideBarItem
  index: number
  active: boolean
}

export interface SideBarSlots {
  title?: (ctx: SideBarItemSlotContext) => any
}
