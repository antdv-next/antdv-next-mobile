import type { ComputedRef, InjectionKey } from 'vue'
import type { FloatButtonShape } from './interface'

export interface FloatButtonGroupContext {
  shape: ComputedRef<FloatButtonShape | undefined>
}

export const floatButtonGroupContextKey: InjectionKey<FloatButtonGroupContext> = Symbol('AmFloatButtonGroupContext')
