import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'
import { getCurrentScope, onScopeDispose, toValue } from 'vue'

export type MaybeElement = Element | ComponentPublicInstance | null | undefined
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>

/** Resolves a template ref (element or component instance) to its DOM element. */
export function unrefElement<T extends Element = HTMLElement>(target: MaybeElementRef): T | undefined {
  const value = toValue(target) as any
  return (value?.$el ?? value) || undefined
}

/** `onScopeDispose` that is a no-op outside an effect scope (plain function calls, tests). */
export function tryOnScopeDispose(fn: () => void) {
  if (getCurrentScope()) {
    onScopeDispose(fn)
    return true
  }
  return false
}
