import type { ComputedRef, InjectionKey } from 'vue'
import type { Key } from '../_util/type'
import type { TreeEventDataNode, TreeProps, TreeSlots } from './interface'
import type { TreeResolvedFieldNames } from './util'
import { inject } from 'vue'

export interface TreeSlotFlags {
  title: boolean
  titleRender: boolean
  icon: boolean
  switcherIcon: boolean
  switcherLoadingIcon: boolean
}

/** Tree -> TreeNode: the rows read their state from here instead of receiving a dozen props each. */
export interface TreeContext {
  props: TreeProps
  /** the live slots of Tree: always call through it, never keep a slot function */
  slots: TreeSlots
  /** which slots are present (reactive, so the rows follow a slot that is added / removed later) */
  hasSlot: TreeSlotFlags
  disabled: ComputedRef<boolean>
  fieldNames: ComputedRef<TreeResolvedFieldNames>
  expandedKeys: ComputedRef<Set<Key>>
  selectedKeys: ComputedRef<Set<Key>>
  checkedKeys: ComputedRef<Set<Key>>
  halfCheckedKeys: ComputedRef<Set<Key>>
  loadedKeys: ComputedRef<Set<Key>>
  loadingKeys: ComputedRef<Set<Key>>
  getEventNode: (key: Key) => TreeEventDataNode
  onNodeClick: (event: MouseEvent, node: TreeEventDataNode) => void
  onNodeExpand: (event: Event, node: TreeEventDataNode) => void
  onNodeSelect: (event: Event, node: TreeEventDataNode) => void
  onNodeCheck: (event: Event, node: TreeEventDataNode, checked: boolean) => void
}

export const treeContextKey: InjectionKey<TreeContext> = Symbol('AmTreeContext')

export function useTreeContext(): TreeContext {
  const context = inject(treeContextKey, null)
  if (!context)
    throw new Error('[@antdv-next/mobile] TreeNode must be rendered by Tree')
  return context
}
