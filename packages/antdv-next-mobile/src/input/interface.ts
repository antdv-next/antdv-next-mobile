import type { CSSProperties } from 'vue'
import type { SizeType, ValidateStatus, VueNode } from '../_util/type'
import type { Variant } from '../form/context'

export type InputStatus = ValidateStatus
export type InputAlign = 'start' | 'center' | 'end'
export type InputClearTrigger = 'focus' | 'always'

export interface InputAllowClearConfig {
  clearIcon?: VueNode
}

export interface InputCountInfo {
  value: string
  count: number
  maxLength?: number
}

export interface InputShowCountConfig {
  formatter: (info: InputCountInfo) => any
}

export interface InputFocusOptions {
  preventScroll?: boolean
  /** Where to put the caret after focusing */
  cursor?: 'start' | 'end' | 'all'
}

export interface InputSemanticClassNames {
  root?: string
  input?: string
  prefix?: string
  suffix?: string
  clear?: string
  count?: string
}

export interface InputSemanticStyles {
  root?: CSSProperties
  input?: CSSProperties
  prefix?: CSSProperties
  suffix?: CSSProperties
  clear?: CSSProperties
  count?: CSSProperties
}

export interface InputProps {
  /** Supports `v-model:value` */
  value?: string | number | null
  defaultValue?: string | number
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  /** Alias of `readOnly` (native attribute spelling) */
  readonly?: boolean
  maxlength?: number
  showCount?: boolean | InputShowCountConfig
  allowClear?: boolean | InputAllowClearConfig
  /** When the clear icon is visible. Mobile default: only while focused. */
  clearTrigger?: InputClearTrigger
  prefix?: VueNode
  suffix?: VueNode
  size?: SizeType
  status?: InputStatus
  variant?: Variant
  /** Native input type */
  type?: string
  /** Virtual keyboard hint: `text` / `numeric` / `decimal` / `tel` / `search` / `email` / `url` */
  inputmode?: string
  /** Label of the enter key of the virtual keyboard */
  enterkeyhint?: string
  autofocus?: boolean
  autocomplete?: string
  name?: string
  /** id of the native input. Defaults to the id of the wrapping FormItem. */
  id?: string
  /** Text alignment */
  align?: InputAlign
  rootClass?: string
  classes?: InputSemanticClassNames
  styles?: InputSemanticStyles
}

export interface InputEmits {
  'update:value': [value: string]
  /** Fired on every value change (same as PC) */
  'change': [event: Event]
  'input': [event: Event]
  'pressEnter': [event: KeyboardEvent]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
  'keydown': [event: KeyboardEvent]
  'keyup': [event: KeyboardEvent]
  'compositionstart': [event: CompositionEvent]
  'compositionend': [event: CompositionEvent]
}

export interface InputSlots {
  prefix?: () => any
  suffix?: () => any
  clearIcon?: () => any
}

export interface InputInstance {
  focus: (options?: InputFocusOptions) => void
  blur: () => void
  select: () => void
  /** The native `<input>` */
  input: HTMLInputElement | undefined
  nativeElement: HTMLElement | undefined
}

// ---------- TextArea ----------
export interface TextAreaAutoSize {
  minRows?: number
  maxRows?: number
}

export interface TextAreaSemanticClassNames {
  root?: string
  textarea?: string
  clear?: string
  count?: string
}

export interface TextAreaSemanticStyles {
  root?: CSSProperties
  textarea?: CSSProperties
  clear?: CSSProperties
  count?: CSSProperties
}

export interface TextAreaProps {
  /** Supports `v-model:value` */
  value?: string | number | null
  defaultValue?: string | number
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  readonly?: boolean
  maxlength?: number
  rows?: number
  /** Fit the height to the content */
  autoSize?: boolean | TextAreaAutoSize
  showCount?: boolean | InputShowCountConfig
  allowClear?: boolean | InputAllowClearConfig
  clearTrigger?: InputClearTrigger
  size?: SizeType
  status?: InputStatus
  variant?: Variant
  inputmode?: string
  enterkeyhint?: string
  autofocus?: boolean
  autocomplete?: string
  name?: string
  id?: string
  align?: InputAlign
  rootClass?: string
  classes?: TextAreaSemanticClassNames
  styles?: TextAreaSemanticStyles
}

export interface TextAreaEmits {
  'update:value': [value: string]
  'change': [event: Event]
  'input': [event: Event]
  'pressEnter': [event: KeyboardEvent]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
  'keydown': [event: KeyboardEvent]
  'keyup': [event: KeyboardEvent]
  'compositionstart': [event: CompositionEvent]
  'compositionend': [event: CompositionEvent]
  /** Fired when `autoSize` changed the height */
  'resize': [size: { height: number }]
}

export interface TextAreaSlots {
  clearIcon?: () => any
}

export interface TextAreaInstance {
  focus: (options?: InputFocusOptions) => void
  blur: () => void
  select: () => void
  /** The native `<textarea>` */
  textArea: HTMLTextAreaElement | undefined
  nativeElement: HTMLElement | undefined
}

// ---------- Search ----------
export interface InputSearchSemanticClassNames {
  root?: string
  input?: string
  button?: string
  cancel?: string
}

export interface InputSearchSemanticStyles {
  root?: CSSProperties
  input?: CSSProperties
  button?: CSSProperties
  cancel?: CSSProperties
}

export interface InputSearchInfo {
  source?: 'input' | 'clear'
}

export interface InputSearchProps {
  value?: string | number | null
  defaultValue?: string | number
  /** Defaults to the locale text */
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  readonly?: boolean
  maxlength?: number
  allowClear?: boolean | InputAllowClearConfig
  clearTrigger?: InputClearTrigger
  /** Replaces the search icon */
  prefix?: VueNode
  suffix?: VueNode
  size?: SizeType
  status?: InputStatus
  /** Mobile default `'filled'` */
  variant?: Variant
  inputmode?: string
  enterkeyhint?: string
  autofocus?: boolean
  autocomplete?: string
  name?: string
  id?: string
  /** Search button after the input: `true` for an icon button, or custom content */
  enterButton?: VueNode
  searchIcon?: VueNode
  loading?: boolean
  /** Show a text button that cancels the search (visible while focused or filled) */
  showCancel?: boolean
  /** Defaults to the locale text */
  cancelText?: VueNode
  /** Pill shaped bar. Default `true`. */
  round?: boolean
  rootClass?: string
  classes?: InputSearchSemanticClassNames
  styles?: InputSearchSemanticStyles
}

export interface InputSearchEmits {
  'update:value': [value: string]
  'change': [event: Event]
  'input': [event: Event]
  'pressEnter': [event: KeyboardEvent]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
  'search': [value: string, event?: Event, info?: InputSearchInfo]
  'cancel': []
}

export interface InputSearchSlots {
  prefix?: () => any
  suffix?: () => any
  clearIcon?: () => any
  searchIcon?: () => any
  enterButton?: () => any
  cancelText?: () => any
}

// ---------- Password ----------
export interface InputPasswordProps {
  value?: string | number | null
  defaultValue?: string | number
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  readonly?: boolean
  maxlength?: number
  showCount?: boolean | InputShowCountConfig
  allowClear?: boolean | InputAllowClearConfig
  clearTrigger?: InputClearTrigger
  prefix?: VueNode
  suffix?: VueNode
  size?: SizeType
  status?: InputStatus
  variant?: Variant
  inputmode?: string
  enterkeyhint?: string
  autofocus?: boolean
  autocomplete?: string
  name?: string
  id?: string
  align?: InputAlign
  /** Show the visibility toggle. Default `true`. */
  visibilityToggle?: boolean
  /** Whether the password is shown as plain text. Supports `v-model:icon-visible`. */
  iconVisible?: boolean
  iconRender?: (params: { visible: boolean }) => any
  rootClass?: string
  classes?: InputSemanticClassNames
  styles?: InputSemanticStyles
}

export interface InputPasswordEmits {
  'update:value': [value: string]
  'update:iconVisible': [visible: boolean]
  'change': [event: Event]
  'input': [event: Event]
  'pressEnter': [event: KeyboardEvent]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
}

export interface InputPasswordSlots {
  prefix?: () => any
  suffix?: () => any
  clearIcon?: () => any
  iconRender?: (params: { visible: boolean }) => any
}

// ---------- OTP ----------
export interface InputOTPSemanticClassNames {
  root?: string
  cell?: string
  separator?: string
}

export interface InputOTPSemanticStyles {
  root?: CSSProperties
  cell?: CSSProperties
  separator?: CSSProperties
}

export interface InputOTPProps {
  /** Number of cells */
  length?: number
  /** Supports `v-model:value` */
  value?: string
  defaultValue?: string
  /** Formats the whole value, e.g. `v => v.replace(/\D/g, '')` */
  formatter?: (value: string) => string
  /** `true` shows dots, a string is used as the mask character. The value is untouched. */
  mask?: boolean | string
  /** Rendered between the cells */
  separator?: VueNode | ((index: number) => any)
  disabled?: boolean
  status?: InputStatus
  size?: SizeType
  variant?: Variant
  /** Virtual keyboard hint. Mobile default `'numeric'`. */
  inputMode?: string
  autoFocus?: boolean
  name?: string
  id?: string
  rootClass?: string
  classes?: InputOTPSemanticClassNames
  styles?: InputOTPSemanticStyles
}

export interface InputOTPEmits {
  /** Fired on every edit (mobile keeps `v-model:value` in sync while typing) */
  'update:value': [value: string]
  /** Fired when every cell is filled */
  'change': [value: string]
  'input': [cells: string[]]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

export interface InputOTPSlots {
  separator?: (ctx: { index: number }) => any
}

export interface InputOTPInstance {
  focus: () => void
  blur: () => void
  nativeElement: HTMLElement | undefined
}
