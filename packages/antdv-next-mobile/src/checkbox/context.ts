import type { ComputedRef, InjectionKey, Slot } from 'vue'
import type { CheckboxGroupSemanticClassNames, CheckboxGroupSemanticStyles, CheckboxShape } from './interface'
import { inject } from 'vue'

export interface CheckboxGroupContext {
  value: ComputedRef<any[]>
  disabled: ComputedRef<boolean>
  name: ComputedRef<string | undefined>
  block: ComputedRef<boolean | undefined>
  shape: ComputedRef<CheckboxShape | undefined>
  /** true when `max` is reached, unchecked items are disabled */
  isFull: ComputedRef<boolean>
  classes: ComputedRef<CheckboxGroupSemanticClassNames | undefined>
  styles: ComputedRef<CheckboxGroupSemanticStyles | undefined>
  iconSlot: () => Slot | undefined
  toggle: (value: any) => void
  register: (value: any) => void
  unregister: (value: any) => void
}

export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> = Symbol('AmCheckboxGroupContext')

export function useCheckboxGroupContext() {
  return inject(checkboxGroupContextKey, undefined)
}
