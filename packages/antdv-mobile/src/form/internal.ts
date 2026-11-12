import type { ComputedRef, InjectionKey } from 'vue'
import type { ValidateMessages } from '../locale/interface'
import type { FormInternalNamePath, FormProps, FormRuleObject, FormScrollOptions, FormValidateOptions } from './interface'
import type { FormRuleError } from './utils'

export interface FormFieldMeta {
  touched: boolean
  validating: boolean
  validated: boolean
  errors: string[]
  warnings: string[]
}

/** What a FormItem registers on its Form. */
export interface FormFieldEntity {
  namePath: () => FormInternalNamePath
  rules: () => FormRuleObject[]
  /** Resolves when valid, rejects with the failed rules. */
  validateRules: (options?: FormValidateOptions) => Promise<FormRuleError[]>
  clearValidate: () => void
  resetField: () => void
  getMeta: () => FormFieldMeta
  setFieldState: (state: Partial<FormFieldMeta>) => void
  getElement: () => HTMLElement | undefined
  getId: () => string | undefined
}

export interface FormInternalContext {
  /** The reactive props of the Form */
  props: FormProps
  validateMessages: ComputedRef<ValidateMessages>
  addField: (field: FormFieldEntity) => void
  removeField: (field: FormFieldEntity) => void
  onValidate: (name: FormInternalNamePath, status: boolean, errors: string[] | null) => void
  triggerValuesChange: (namePath: FormInternalNamePath, value: any) => void
}

export const formInternalContextKey: InjectionKey<FormInternalContext> = Symbol('AmFormInternalContext')

export interface FormItemChildState {
  errors: string[]
  warnings: string[]
  validating: boolean
}

/** Lets `noStyle` items show their messages on the closest styled FormItem. */
export interface FormItemParentContext {
  report: (key: symbol, state: FormItemChildState) => void
  remove: (key: symbol) => void
}

export const formItemParentContextKey: InjectionKey<FormItemParentContext> = Symbol('AmFormItemParentContext')

export const defaultScrollOptions: FormScrollOptions = { behavior: 'smooth', block: 'center', focus: false }
