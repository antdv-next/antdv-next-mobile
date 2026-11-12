import type { ComputedRef, InjectionKey, VNodeChild } from 'vue'
import type { Key } from '../_util/type'
import type {
  CollapseCollapsibleType,
  CollapseExpandIconPlacement,
  CollapsePanelInfo,
  CollapseSemanticClassNames,
  CollapseSemanticStyles,
} from './interface'

export interface CollapseContext {
  isActive: (key: Key) => boolean
  toggle: (key: Key) => void
  collapsible: ComputedRef<CollapseCollapsibleType | undefined>
  destroyOnHidden: ComputedRef<boolean>
  expandIconPlacement: ComputedRef<CollapseExpandIconPlacement>
  expandIcon: ComputedRef<((panelProps: CollapsePanelInfo) => VNodeChild) | undefined>
  classes: ComputedRef<CollapseSemanticClassNames | undefined>
  styles: ComputedRef<CollapseSemanticStyles | undefined>
}

export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('AmCollapseContext')
