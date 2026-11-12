import type { ComputedRef, InjectionKey, Slot } from 'vue'
import type { SizeType } from '../_util/type'
import type {
  RadioChangeEvent,
  RadioGroupButtonStyle,
  RadioGroupOptionType,
  RadioGroupSemanticClassNames,
  RadioGroupSemanticStyles,
} from './interface'
import { inject } from 'vue'

export interface RadioGroupContext {
  value: ComputedRef<any>
  disabled: ComputedRef<boolean>
  name: ComputedRef<string | undefined>
  optionType: ComputedRef<RadioGroupOptionType | undefined>
  buttonStyle: ComputedRef<RadioGroupButtonStyle>
  size: ComputedRef<SizeType>
  block: ComputedRef<boolean | undefined>
  classes: ComputedRef<RadioGroupSemanticClassNames | undefined>
  styles: ComputedRef<RadioGroupSemanticStyles | undefined>
  iconSlot: () => Slot | undefined
  select: (event: RadioChangeEvent) => void
}

export const radioGroupContextKey: InjectionKey<RadioGroupContext> = Symbol('AmRadioGroupContext')

export function useRadioGroupContext() {
  return inject(radioGroupContextKey, undefined)
}
