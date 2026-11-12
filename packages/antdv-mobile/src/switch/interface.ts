import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type SwitchSize = 'small' | 'middle' | 'default'
export type SwitchCheckedValue = boolean | string | number | object

export interface SwitchSemanticClassNames {
  root?: string
  content?: string
  indicator?: string
}

export interface SwitchSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  indicator?: CSSProperties
}

export interface SwitchProps {
  /** Whether the switch is on (`v-model:checked`) */
  checked?: SwitchCheckedValue
  defaultChecked?: SwitchCheckedValue
  /** Alias of `checked` (`v-model:value`) */
  value?: SwitchCheckedValue
  /** Alias of `defaultChecked` */
  defaultValue?: SwitchCheckedValue
  /** Value of `checked` when on, default `true` */
  checkedValue?: SwitchCheckedValue
  /** Value of `checked` when off, default `false` */
  unCheckedValue?: SwitchCheckedValue
  checkedChildren?: VueNode
  unCheckedChildren?: VueNode
  disabled?: boolean
  loading?: boolean
  size?: SwitchSize
  autoFocus?: boolean
  title?: string
  tabIndex?: number
  id?: string
  /**
   * Mobile: async guard called with the next value before it is applied. Returning `false`
   * (or a promise that resolves to `false` / rejects) cancels the change; the switch shows
   * its loading state while the promise is pending.
   */
  beforeChange?: (checked: SwitchCheckedValue) => boolean | void | Promise<boolean | void>
  rootClass?: string
  classes?: SwitchSemanticClassNames
  styles?: SwitchSemanticStyles
}

export interface SwitchEmits {
  'change': [checked: any, event: MouseEvent | KeyboardEvent]
  'click': [checked: any, event: MouseEvent | KeyboardEvent]
  'update:checked': [checked: any]
  'update:value': [checked: any]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

export interface SwitchSlots {
  checkedChildren?: () => any
  unCheckedChildren?: () => any
}

export interface SwitchExpose {
  focus: () => void
  blur: () => void
  nativeElement: HTMLButtonElement | null
}
