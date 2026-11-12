import type { CSSProperties } from 'vue'
import type { RenderNodeFn, VueNode } from '../_util/type'

export type CheckboxCheckedValue = boolean | string | number | object
export type CheckboxShape = 'square' | 'round'

export interface CheckboxSemanticClassNames {
  root?: string
  icon?: string
  label?: string
}

export interface CheckboxSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  label?: CSSProperties
}

export interface CheckboxIconContext {
  checked: boolean
  indeterminate: boolean
  disabled: boolean
}

export interface CheckboxProps {
  /** Whether the checkbox is checked (`v-model:checked`) */
  checked?: CheckboxCheckedValue
  defaultChecked?: CheckboxCheckedValue
  /** Value of `checked` when checked, default `true` */
  checkedValue?: CheckboxCheckedValue
  /** Value of `checked` when unchecked, default `false` */
  unCheckedValue?: CheckboxCheckedValue
  indeterminate?: boolean
  disabled?: boolean
  /** Value used by `Checkbox.Group` */
  value?: any
  name?: string
  id?: string
  title?: string
  tabIndex?: number
  autoFocus?: boolean
  required?: boolean
  /** Ignore the surrounding `Checkbox.Group` */
  skipGroup?: boolean
  /** Mobile: full-width row, label at the start and the box at the end */
  block?: boolean
  /** Mobile: shape of the box */
  shape?: CheckboxShape
  /** Mobile: custom icon, the same-named slot wins */
  icon?: RenderNodeFn<CheckboxIconContext>
  rootClass?: string
  classes?: CheckboxSemanticClassNames
  styles?: CheckboxSemanticStyles
}

export interface CheckboxChangeEventTarget extends CheckboxProps {
  checked: boolean
}

export interface CheckboxChangeEvent {
  target: CheckboxChangeEventTarget
  stopPropagation: () => void
  preventDefault: () => void
  nativeEvent: Event
}

export interface CheckboxEmits {
  'change': [event: CheckboxChangeEvent]
  'update:checked': [checked: any]
  'click': [event: MouseEvent]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

export interface CheckboxSlots {
  default?: () => any
  icon?: (ctx: CheckboxIconContext) => any
}

export interface CheckboxExpose {
  focus: () => void
  blur: () => void
  input: HTMLInputElement | null
  nativeElement: HTMLElement | null
}

export interface CheckboxOptionType {
  label: VueNode
  value: any
  disabled?: boolean
  title?: string
  id?: string
  required?: boolean
  class?: string
  style?: CSSProperties
}

export interface CheckboxGroupSemanticClassNames {
  root?: string
  item?: string
  itemIcon?: string
  itemLabel?: string
}

export interface CheckboxGroupSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemIcon?: CSSProperties
  itemLabel?: CSSProperties
}

export interface CheckboxGroupLabelRenderParams {
  item: CheckboxOptionType
  index: number
}

export interface CheckboxGroupProps {
  /** Checked values (`v-model:value`) */
  value?: any[]
  defaultValue?: any[]
  options?: (CheckboxOptionType | string | number)[]
  disabled?: boolean
  name?: string
  role?: string
  labelRender?: (params: CheckboxGroupLabelRenderParams) => any
  /** Mobile: maximum number of checked items, the rest gets disabled */
  max?: number
  /** Mobile: list style, every item is a full-width row */
  block?: boolean
  /** Mobile: shape of every box */
  shape?: CheckboxShape
  rootClass?: string
  classes?: CheckboxGroupSemanticClassNames
  styles?: CheckboxGroupSemanticStyles
}

export interface CheckboxGroupEmits {
  'change': [checkedValue: any[]]
  'update:value': [checkedValue: any[]]
}

export interface CheckboxGroupSlots {
  default?: () => any
  labelRender?: (params: CheckboxGroupLabelRenderParams) => any
  icon?: (ctx: CheckboxIconContext) => any
}
