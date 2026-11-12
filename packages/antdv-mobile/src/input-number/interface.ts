import type { CSSProperties } from 'vue'
import type { SizeType, ValidateStatus, VueNode } from '../_util/type'
import type { Variant } from '../form/context'

export type InputNumberValueType = number | string
export type InputNumberMode = 'input' | 'spinner'

export interface InputNumberStepContext {
  offset: InputNumberValueType
  type: 'up' | 'down'
  emitter: 'handler' | 'keyboard'
}

export interface InputNumberFormatterInfo {
  userTyping: boolean
  input: string
}

export interface InputNumberControlsConfig {
  upIcon?: VueNode
  downIcon?: VueNode
}

export interface InputNumberSemanticClassNames {
  root?: string
  input?: string
  prefix?: string
  suffix?: string
  action?: string
}

export interface InputNumberSemanticStyles {
  root?: CSSProperties
  input?: CSSProperties
  prefix?: CSSProperties
  suffix?: CSSProperties
  action?: CSSProperties
}

export interface InputNumberProps {
  /** Supports `v-model:value`. `null` means empty. */
  value?: InputNumberValueType | null
  defaultValue?: InputNumberValueType | null
  min?: InputNumberValueType
  max?: InputNumberValueType
  step?: InputNumberValueType
  /** Number of decimals */
  precision?: number
  disabled?: boolean
  readOnly?: boolean
  /** Alias of `readOnly` (native attribute spelling) */
  readonly?: boolean
  /** Show the − / + buttons, or customize their icons */
  controls?: boolean | InputNumberControlsConfig
  /** `spinner`: − / + buttons on both sides (mobile default). `input`: a plain numeric field. */
  mode?: InputNumberMode
  formatter?: (value: InputNumberValueType, info: InputNumberFormatterInfo) => string
  parser?: (displayValue: string) => InputNumberValueType
  /** Emit the value as a string (keeps trailing zeros and long decimals) */
  stringMode?: boolean
  /** Commit (clamp + format) the typed text on blur. Default `true`. */
  changeOnBlur?: boolean
  /** Step with the arrow keys. Default `true`. */
  keyboard?: boolean
  /** Keep stepping while a button is pressed. Default `true`. */
  longPress?: boolean
  prefix?: VueNode
  suffix?: VueNode
  status?: ValidateStatus
  size?: SizeType
  variant?: Variant
  placeholder?: string
  /** Virtual keyboard hint. Default `'decimal'`. */
  inputmode?: string
  autofocus?: boolean
  name?: string
  /** id of the native input. Defaults to the id of the wrapping FormItem. */
  id?: string
  rootClass?: string
  classes?: InputNumberSemanticClassNames
  styles?: InputNumberSemanticStyles
}

export interface InputNumberEmits {
  'update:value': [value: InputNumberValueType | null]
  'change': [value: InputNumberValueType | null]
  /** The raw text while typing */
  'input': [text: string]
  'step': [value: InputNumberValueType, info: InputNumberStepContext]
  'pressEnter': [event: KeyboardEvent]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

export interface InputNumberSlots {
  prefix?: () => any
  suffix?: () => any
  upIcon?: () => any
  downIcon?: () => any
}

export interface InputNumberInstance {
  focus: (options?: FocusOptions) => void
  blur: () => void
  /** The native `<input>` */
  input: HTMLInputElement | undefined
  nativeElement: HTMLElement | undefined
}
