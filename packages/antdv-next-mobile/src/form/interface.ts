import type { CSSProperties } from 'vue'
import type { Numeric, SizeType, ValidateStatus, VueNode } from '../_util/type'
import type { ValidateMessages } from '../locale/interface'
import type { Variant } from './context'

export type FormNamePath = string | number | (string | number)[]
export type FormInternalNamePath = (string | number)[]

export type FormLayout = 'horizontal' | 'vertical'
export type FormItemLayout = FormLayout
/** `left` / `right` are kept for PC compatibility, prefer `start` / `end`. */
export type FormLabelAlign = 'start' | 'end' | 'left' | 'right'
export type FormContentAlign = 'start' | 'end'
export type FormMode = 'default' | 'card'
export type FormRequiredMark = boolean | 'optional'
export type FormTriggerType = 'change' | 'blur'
export type FormValidateTrigger = FormTriggerType | FormTriggerType[] | false
export type FormValidateMessages = ValidateMessages

export type FormRuleType
  = | 'string'
    | 'number'
    | 'boolean'
    | 'method'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'object'
    | 'array'
    | 'enum'
    | 'date'
    | 'url'
    | 'hex'
    | 'email'
    | 'tel'

export type FormRuleValidator = (
  rule: FormRuleObject,
  value: any,
  callback: (error?: string) => void,
) => Promise<void | any> | void

export interface FormRuleObject {
  type?: FormRuleType
  required?: boolean
  message?: string
  enum?: any[]
  len?: number
  min?: number
  max?: number
  pattern?: RegExp
  whitespace?: boolean
  /** Does not block submit, shown as a warning. */
  warningOnly?: boolean
  transform?: (value: any) => any
  validator?: FormRuleValidator
  /** Rule level trigger, falls back to the `validateTrigger` of FormItem / Form. */
  trigger?: FormTriggerType | FormTriggerType[]
  /** Alias of `trigger` (PC name). */
  validateTrigger?: FormTriggerType | FormTriggerType[]
  /** Rule of every element, for `type: 'array'`. */
  defaultField?: FormRuleObject
}

export type FormRule = FormRuleObject

/**
 * Form level rules keyed by field name. Mirrors the data structure, so nested paths work:
 * `{ user: { email: [...] } }` matches `<FormItem :name="['user', 'email']">`.
 */
export interface FormRulesMap {
  [key: string | number]: FormRule[] | FormRulesMap
}

export interface FormFieldError {
  name: FormInternalNamePath
  errors: string[]
  warnings: string[]
}

export interface FormValidateErrorEntity<Values = any> {
  message: string
  values: Values
  errorFields: FormFieldError[]
  outOfDate: boolean
}

export interface FormValidateOptions {
  /** Validate without updating the UI. */
  validateOnly?: boolean
  /** Only validate fields that were touched or validated before. */
  dirty?: boolean
}

export interface FormScrollOptions {
  behavior?: 'auto' | 'smooth' | 'instant'
  block?: 'start' | 'center' | 'end' | 'nearest'
  /** Focus the control after scrolling. Default `true`. */
  focus?: boolean
}

export interface FormFieldData {
  name: FormNamePath
  value?: any
  errors?: string[]
  warnings?: string[]
  touched?: boolean
  validating?: boolean
}

export interface FormSemanticClassNames {
  root?: string
  header?: string
  body?: string
  footer?: string
  item?: string
  label?: string
  content?: string
  help?: string
  extra?: string
}

export interface FormSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  footer?: CSSProperties
  item?: CSSProperties
  label?: CSSProperties
  content?: CSSProperties
  help?: CSSProperties
  extra?: CSSProperties
}

export interface FormProps {
  /** Form data (a reactive object). Required for validation, reset and `finish`. */
  model?: Record<string, any>
  /** Form level rules, merged with the `rules` of every FormItem. */
  rules?: FormRulesMap
  /** Prefix of the generated control ids */
  name?: string
  layout?: FormLayout
  labelAlign?: FormLabelAlign
  /** Width of the label column in horizontal layout */
  labelWidth?: Numeric
  /** Wrap long labels instead of truncating */
  labelWrap?: boolean
  colon?: boolean
  disabled?: boolean
  size?: SizeType
  /** Variant of the fields inside. Mobile default `'borderless'`. */
  variant?: Variant
  requiredMark?: FormRequiredMark
  validateTrigger?: FormValidateTrigger
  validateMessages?: FormValidateMessages
  /** Scroll to the first failed field after a failed submit */
  scrollToFirstError?: boolean | FormScrollOptions
  /** `card`: inset group with rounded corners */
  mode?: FormMode
  /** Alignment of the controls in horizontal layout */
  contentAlign?: FormContentAlign
  /** Title above the items */
  header?: VueNode
  /** Area below the items, usually the submit button */
  footer?: VueNode
  autocomplete?: string
  rootClass?: string
  classes?: FormSemanticClassNames
  styles?: FormSemanticStyles
}

export interface FormEmits {
  finish: [values: Record<string, any>]
  finishFailed: [errorInfo: FormValidateErrorEntity]
  submit: [event: Event]
  reset: [event: Event]
  validate: [name: FormInternalNamePath, status: boolean, errors: string[] | null]
  valuesChange: [changedValues: Record<string, any>, values: Record<string, any>]
}

export interface FormSlots {
  default?: () => any
  header?: () => any
  footer?: () => any
}

export interface FormInstance {
  getFieldValue: (name: FormNamePath) => any
  getFieldsValue: (nameList?: FormNamePath[] | true) => Record<string, any>
  getFieldError: (name: FormNamePath) => string[]
  getFieldsError: (nameList?: FormNamePath[]) => FormFieldError[]
  getFieldWarning: (name: FormNamePath) => string[]
  isFieldTouched: (name: FormNamePath) => boolean
  isFieldsTouched: (nameList?: FormNamePath[] | boolean, allFieldsTouched?: boolean) => boolean
  isFieldValidating: (name: FormNamePath) => boolean
  isFieldsValidating: (nameList?: FormNamePath[]) => boolean
  resetFields: (nameList?: FormNamePath[]) => void
  clearValidate: (nameList?: FormNamePath[]) => void
  setFields: (fields: FormFieldData[]) => void
  setFieldValue: (name: FormNamePath, value: any) => void
  setFieldsValue: (values: Record<string, any>) => void
  validateFields: (nameList?: FormNamePath[] | FormValidateOptions, options?: FormValidateOptions) => Promise<Record<string, any>>
  /** Alias of `validateFields` */
  validate: (nameList?: FormNamePath[] | FormValidateOptions, options?: FormValidateOptions) => Promise<Record<string, any>>
  submit: () => void
  scrollToField: (name: FormNamePath, options?: FormScrollOptions | boolean) => void
  focusField: (name: FormNamePath) => void
  nativeElement: HTMLFormElement | undefined
}

export interface FormItemSemanticClassNames {
  root?: string
  label?: string
  content?: string
  help?: string
  extra?: string
}

export interface FormItemSemanticStyles {
  root?: CSSProperties
  label?: CSSProperties
  content?: CSSProperties
  help?: CSSProperties
  extra?: CSSProperties
}

export interface FormItemProps {
  /** Field path in `model`: `'name'` or `['user', 'name']` */
  name?: FormNamePath
  label?: VueNode
  rules?: FormRule[]
  /** Show the required mark. Derived from `rules` when not set. */
  required?: boolean
  /** Custom message under the control. Replaces the validation messages. */
  help?: VueNode
  /** Extra hint under the control */
  extra?: VueNode
  validateStatus?: ValidateStatus
  /** Show a status icon at the end of the control */
  hasFeedback?: boolean
  validateTrigger?: FormValidateTrigger
  /** Stop at the first failed rule */
  validateFirst?: boolean | 'parallel'
  /** Delay (ms) of the validation triggered by change / blur */
  validateDebounce?: number
  /** Variables of the validation message templates, e.g. `{ label: '...' }` */
  messageVariables?: Record<string, string>
  /** Render the control only (no cell), still validates. */
  noStyle?: boolean
  hidden?: boolean
  layout?: FormItemLayout
  labelAlign?: FormLabelAlign
  labelWidth?: Numeric
  colon?: boolean
  /** id of the control (`for` of the label). Generated from `name` by default. */
  id?: string
  /** Press feedback + `click` event, for cells that open a picker */
  clickable?: boolean
  /** Arrow at the end of the cell. Defaults to `clickable`. */
  arrow?: VueNode
  contentAlign?: FormContentAlign
  rootClass?: string
  classes?: FormItemSemanticClassNames
  styles?: FormItemSemanticStyles
}

export interface FormItemEmits {
  click: [event: MouseEvent]
}

export interface FormItemSlots {
  default?: () => any
  label?: () => any
  help?: () => any
  extra?: () => any
  arrow?: () => any
}

export interface FormItemInstance {
  validate: (options?: FormValidateOptions) => Promise<void>
  clearValidate: () => void
  resetField: () => void
  nativeElement: HTMLElement | undefined
}

export type { Variant as FormVariant }
