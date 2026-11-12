import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { Key } from '../_util/type'

export interface IndexBarAnchorRecord {
  index: () => Key
  /** zero-height element marking the natural (non-stuck) position of the anchor */
  el: () => HTMLElement | undefined
}

export interface IndexBarContext {
  register: (anchor: IndexBarAnchorRecord) => void
  unregister: (anchor: IndexBarAnchorRecord) => void
  activeIndex: Ref<Key | undefined>
  sticky: ComputedRef<boolean>
}

export const indexBarContextKey: InjectionKey<IndexBarContext> = Symbol('AmIndexBarContext')
