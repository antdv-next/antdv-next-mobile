import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { GetContainer, Key } from '../_util/type'

/** What a `DropdownItem` hands to its `Dropdown` so the bar can render it. */
export interface DropdownItemRegistration {
  key: Key
  /** in-place anchor, used to keep the bar in DOM order */
  el?: HTMLElement | null
  /** teleported panel layer (touches inside are not "click away") */
  layerEl?: () => HTMLElement | null | undefined
  renderTitle: () => any
  renderArrow?: () => any
  highlight: () => boolean
  disabled: () => boolean
}

export interface DropdownContext {
  activeKey: Ref<Key | null>
  /** position of the layer below the bar (viewport coordinates) */
  rect: Ref<{ top: number, left: number, width: number }>
  zIndex: Ref<number | undefined>
  getContainer: ComputedRef<GetContainer | undefined>
  closeOnMaskClick: ComputedRef<boolean>
  register: (item: DropdownItemRegistration) => () => void
  /** re-order the bar after an item was mounted */
  sort: () => void
  close: () => void
}

export const dropdownContextKey: InjectionKey<DropdownContext> = Symbol('AmDropdownContext')
