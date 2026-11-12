import type { CSSProperties } from 'vue'
import type { Key, RenderNodeFn, VueNode } from '../_util/type'

export type TreeKey = Key

export interface TreeFieldNames {
  title?: string
  key?: string
  children?: string
}

/** State of a rendered node, passed to the `icon` / `switcherIcon` render props and slots. */
export interface TreeNodeAttribute {
  eventKey: Key
  expanded: boolean
  selected: boolean
  checked: boolean
  halfChecked: boolean
  loaded: boolean
  loading: boolean
  isLeaf: boolean
  disabled: boolean
  disableCheckbox: boolean
  checkable: boolean
  selectable: boolean
  /** position in the tree, e.g. `0-1-2` */
  pos: string
  /** depth, `0` for root nodes */
  level: number
  /** the node of `treeData` */
  data: TreeDataNode
}

export interface TreeDataNode {
  /** unique in the whole tree. Default: the position of the node (`0-0-1`). */
  key?: Key
  title?: RenderNodeFn<TreeDataNode>
  children?: TreeDataNode[]
  disabled?: boolean
  disableCheckbox?: boolean
  selectable?: boolean
  /** `false` hides the checkbox of this node */
  checkable?: boolean
  /** With `loadData`: `true` never loads, `false` forces a parent node */
  isLeaf?: boolean
  icon?: RenderNodeFn<TreeNodeAttribute>
  switcherIcon?: RenderNodeFn<TreeNodeAttribute>
  class?: string
  /** alias of `class` (PC name) */
  className?: string
  style?: CSSProperties
  [key: string]: any
}

/** A node of `treeData` together with its current state, the `node` of every event. */
export interface TreeEventDataNode extends TreeDataNode {
  key: Key
  expanded: boolean
  selected: boolean
  checked: boolean
  halfChecked: boolean
  loaded: boolean
  loading: boolean
  pos: string
}

export interface TreeCheckedKeysObject {
  checked: Key[]
  halfChecked: Key[]
}

export type TreeCheckedKeys = Key[] | TreeCheckedKeysObject

export interface TreeExpandInfo {
  node: TreeEventDataNode
  expanded: boolean
  nativeEvent: Event
}

export interface TreeSelectInfo {
  event: 'select'
  selected: boolean
  node: TreeEventDataNode
  selectedNodes: TreeDataNode[]
  nativeEvent: Event
}

export interface TreeCheckedNodePosition {
  node: TreeDataNode
  pos: string
}

export interface TreeCheckInfo {
  event: 'check'
  node: TreeEventDataNode
  checked: boolean
  nativeEvent: Event
  checkedNodes: TreeDataNode[]
  /** only without `checkStrictly` */
  checkedNodesPositions?: TreeCheckedNodePosition[]
  /** only without `checkStrictly` */
  halfCheckedKeys?: Key[]
}

export interface TreeLoadInfo {
  event: 'load'
  node: TreeEventDataNode
}

export interface TreeShowLineConfig {
  /** `true`: a file icon in front of leaves, or a custom icon */
  showLeafIcon: RenderNodeFn<TreeNodeAttribute>
}

export type TreeExpandAction = false | 'click'

export interface TreeScrollToConfig {
  key: Key
  /** `top` / `bottom` as on PC, `center` and `auto` (only when out of view) in addition. Default `top`. */
  align?: 'top' | 'bottom' | 'center' | 'auto'
  offset?: number
  /** expand the target node first (uncontrolled `expandedKeys` only), same as PC */
  autoExpand?: boolean
}

export interface TreeSemanticClassNames {
  root?: string
  item?: string
  itemIcon?: string
  itemTitle?: string
  itemSwitcher?: string
}

export interface TreeSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemIcon?: CSSProperties
  itemTitle?: CSSProperties
  itemSwitcher?: CSSProperties
}

export interface TreeProps {
  /** Tree nodes: `{ key, title, children, disabled, disableCheckbox, selectable, checkable, isLeaf, icon, switcherIcon, class, style }` */
  treeData?: TreeDataNode[]
  /** Custom field names of `title` / `key` / `children` */
  fieldNames?: TreeFieldNames
  /** (Controlled) expanded nodes, `v-model:expandedKeys` */
  expandedKeys?: Key[]
  defaultExpandedKeys?: Key[]
  defaultExpandAll?: boolean
  /** Controlled `expandedKeys`: also expand the parents of the given keys */
  autoExpandParent?: boolean
  /** Expand the parents of the initially expanded keys. Default `true`. */
  defaultExpandParent?: boolean
  /** (Controlled) selected nodes, `v-model:selectedKeys` */
  selectedKeys?: Key[]
  defaultSelectedKeys?: Key[]
  /** (Controlled) checked nodes, `v-model:checkedKeys`. `{ checked, halfChecked }` with `checkStrictly`. */
  checkedKeys?: TreeCheckedKeys
  defaultCheckedKeys?: Key[]
  /** Show a checkbox in front of every node */
  checkable?: boolean
  /** Parent and children are checked independently */
  checkStrictly?: boolean
  /** Default `true` */
  selectable?: boolean
  /** Allow more than one selected node */
  multiple?: boolean
  disabled?: boolean
  /** The node content fills the row, so the whole row is the touch target. Default `true` (mobile). */
  blockNode?: boolean
  /** Render `icon` in front of the title */
  showIcon?: boolean
  /** Guide lines. `{ showLeafIcon }` adds an icon in front of leaves. */
  showLine?: boolean | TreeShowLineConfig
  /** Icon in front of the title (needs `showIcon`), the `icon` slot wins */
  icon?: RenderNodeFn<TreeNodeAttribute>
  /** Expand / collapse icon, the `switcherIcon` slot wins */
  switcherIcon?: RenderNodeFn<TreeNodeAttribute>
  /** Icon of a node that is loading its children, the `switcherLoadingIcon` slot wins */
  switcherLoadingIcon?: VueNode
  /** Custom title, the `titleRender` / `title` slots win */
  titleRender?: (node: TreeDataNode) => any
  /** Load the children of a node when it is expanded */
  loadData?: (node: TreeEventDataNode) => Promise<any> | void
  /** (Controlled) nodes whose children were loaded */
  loadedKeys?: Key[]
  /** Highlight the nodes for which it returns `true` */
  filterTreeNode?: (node: TreeEventDataNode) => boolean
  /** Mobile: a tap on the node content also expands / collapses it */
  expandAction?: TreeExpandAction
  /** Only mount the rows around the visible window (needs `height`). `false` renders every row. Default `true`. */
  virtual?: boolean
  /** Height of the scroll container. Without it the tree grows with its content. */
  height?: number | string
  /** Min height of a row in px and the estimate used before a row is measured. Default `44`. */
  itemHeight?: number
  /** Alias of `height`, the name used by Select / Cascader */
  listHeight?: number | string
  /** Alias of `itemHeight`, the name used by Select / Cascader */
  listItemHeight?: number
  rootClass?: string
  classes?: TreeSemanticClassNames
  styles?: TreeSemanticStyles
}

export interface TreeEmits {
  'update:expandedKeys': [expandedKeys: Key[]]
  'update:selectedKeys': [selectedKeys: Key[]]
  /** always the list of checked keys, also with `checkStrictly` (same as PC) */
  'update:checkedKeys': [checkedKeys: Key[]]
  'expand': [expandedKeys: Key[], info: TreeExpandInfo]
  'select': [selectedKeys: Key[], info: TreeSelectInfo]
  'check': [checkedKeys: TreeCheckedKeys, info: TreeCheckInfo]
  'load': [loadedKeys: Key[], info: TreeLoadInfo]
  /** the content of a node was tapped */
  'click': [event: MouseEvent, node: TreeEventDataNode]
  'scroll': [event: Event]
}

export interface TreeSlots {
  /** custom title, receives the node of `treeData` (mobile alias of `titleRender`) */
  title?: (node: TreeDataNode) => any
  titleRender?: (node: TreeDataNode) => any
  icon?: (props: TreeNodeAttribute) => any
  switcherIcon?: (props: TreeNodeAttribute) => any
  switcherLoadingIcon?: () => any
}

export interface TreeExpose {
  /** scroll to a node (or to a scroll offset). Needs `height`. */
  scrollTo: (target: number | TreeScrollToConfig) => void
  /** the scroll container */
  nativeElement: HTMLElement | undefined
}
