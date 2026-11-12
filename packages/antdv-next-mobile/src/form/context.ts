import type { ComputedRef, InjectionKey } from 'vue'
import type { ValidateStatus } from '../_util/type'
import { computed, inject } from 'vue'
import { compactItemContextKey } from '../_base/compact'

/**
 * Contract between FormItem and any data-entry component rendered inside it.
 * Data-entry components call `onFieldChange()` after their value changed and
 * `onFieldBlur()` on blur so FormItem can run the matching validation trigger.
 */
export interface FormItemInputContext {
  /** validate status of the wrapping FormItem (`''` when none) */
  status: ComputedRef<ValidateStatus>
  /** id for the native control, generated from the field name */
  id: ComputedRef<string | undefined>
  onFieldChange: () => void
  onFieldBlur: () => void
  /** true when rendered inside a FormItem */
  isFormItemInput: boolean
}

export const formItemInputContextKey: InjectionKey<FormItemInputContext> = Symbol('AmFormItemInputContext')

const defaultContext: FormItemInputContext = {
  status: computed(() => '' as ValidateStatus),
  id: computed(() => undefined),
  onFieldChange: () => {},
  onFieldBlur: () => {},
  isFormItemInput: false,
}

export function useFormItemInputContext(): FormItemInputContext {
  return inject(formItemInputContextKey, defaultContext)
}

/** `props.status` > FormItem validate status. Returns `'error' | 'warning' | ...`. */
export function useMergedStatus(status: () => ValidateStatus | undefined) {
  const ctx = useFormItemInputContext()
  return computed<ValidateStatus>(() => status() ?? ctx.status.value)
}

export type Variant = 'outlined' | 'filled' | 'borderless' | 'underlined'

/**
 * Provided by Form (`variant` prop). Fields inside a Form default to `borderless`
 * because FormItem already draws the cell; standalone fields default to `outlined`.
 */
export const variantContextKey: InjectionKey<ComputedRef<Variant | undefined>> = Symbol('AmVariantContext')

/**
 * `props.variant` > `'outlined'` inside a Space.Compact (a seamless group needs borders,
 * even in a Form whose default is borderless) > Form `variant` > `'outlined'`.
 */
export function useVariant(variant: () => Variant | undefined) {
  const formVariant = inject(variantContextKey, undefined)
  const compact = inject(compactItemContextKey, null)
  return computed<Variant>(() => variant() ?? (compact ? 'outlined' : formVariant?.value) ?? 'outlined')
}
