import type { CSSProperties } from 'vue'
import type { RenderNodeFn, SizeType, VueNode } from '../_util/type'

export type RadioGroupButtonStyle = 'outline' | 'solid'
export type RadioGroupOptionType = 'default' | 'button'
export type RadioGroupOrientation = 'horizontal' | 'vertical'

export interface RadioSemanticClassNames {
  root?: string
  icon?: string
  label?: string
}

export interface RadioSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  label?: CSSProperties
}

export interface RadioIconContext {
  checked: boolean
  disabled: boolean
}

export interface RadioProps {
  /** Whether the radio is checked (`v-model:checked`) */
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  /** Value used by `Radio.Group` */
  value?: any
  name?: string
  id?: string
  title?: string
  tabIndex?: number
  autoFocus?: boolean
  required?: boolean
  /** Render as a button, `Radio.Button` is a shortcut of `optionType="button"` */
  optionType?: RadioGroupOptionType
  /** Mobile: full-width row, label at the start and the radio at the end */
  block?: boolean
  /** Mobile: custom icon, the same-named slot wins */
  icon?: RenderNodeFn<RadioIconContext>
  rootClass?: string
  classes?: RadioSemanticClassNames
  styles?: RadioSemanticStyles
}

export interface RadioButtonProps {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  value?: any
  name?: string
  id?: string
  title?: string
  tabIndex?: number
  autoFocus?: boolean
  required?: boolean
  rootClass?: string
  classes?: RadioSemanticClassNames
  styles?: RadioSemanticStyles
}

export interface RadioChangeEventTarget extends RadioProps {
  checked: boolean
}

export interface RadioChangeEvent {
  target: RadioChangeEventTarget
  stopPropagation: () => void
  preventDefault: () => void
  nativeEvent: Event
}

export interface RadioEmits {
  'change': [event: RadioChangeEvent]
  'update:checked': [checked: boolean]
  'click': [event: MouseEvent]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

export interface RadioSlots {
  default?: () => any
  icon?: (ctx: RadioIconContext) => any
}

export interface RadioButtonSlots {
  default?: () => any
}

export interface RadioExpose {
  focus: () => void
  blur: () => void
  input: HTMLInputElement | null
  nativeElement: HTMLElement | null
}

export interface RadioOptionType {
  label: VueNode
  value: any
  disabled?: boolean
  title?: string
  id?: string
  required?: boolean
  class?: string
  style?: CSSProperties
}

export interface RadioGroupSemanticClassNames {
  root?: string
  item?: string
  itemIcon?: string
  itemLabel?: string
}

export interface RadioGroupSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemIcon?: CSSProperties
  itemLabel?: CSSProperties
}

export interface RadioGroupLabelRenderParams {
  item: RadioOptionType
  index: number
}

export interface RadioGroupProps {
  /** Selected value (`v-model:value`) */
  value?: any
  defaultValue?: any
  options?: (RadioOptionType | string | number)[]
  optionType?: RadioGroupOptionType
  buttonStyle?: RadioGroupButtonStyle
  /** Size of button style radios */
  size?: SizeType
  disabled?: boolean
  name?: string
  id?: string
  /** Fit the width of the parent; for `optionType="default"` every radio becomes a list row */
  block?: boolean
  vertical?: boolean
  orientation?: RadioGroupOrientation
  labelRender?: (params: RadioGroupLabelRenderParams) => any
  rootClass?: string
  classes?: RadioGroupSemanticClassNames
  styles?: RadioGroupSemanticStyles
}

export interface RadioGroupEmits {
  'change': [event: RadioChangeEvent]
  'update:value': [value: any]
}

export interface RadioGroupSlots {
  default?: () => any
  labelRender?: (params: RadioGroupLabelRenderParams) => any
  icon?: (ctx: RadioIconContext) => any
}
