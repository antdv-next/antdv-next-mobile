import type { CSSProperties } from 'vue'
import type { GetContainer, Key, VueNode } from '../_util/type'

export type DropdownItemValue = string | number

export interface DropdownOption {
  label: VueNode
  value: DropdownItemValue
  disabled?: boolean
}

export interface DropdownSemanticClassNames {
  root?: string
  nav?: string
  item?: string
  title?: string
  arrow?: string
}

export interface DropdownSemanticStyles {
  root?: CSSProperties
  nav?: CSSProperties
  item?: CSSProperties
  title?: CSSProperties
  arrow?: CSSProperties
}

export interface DropdownProps {
  /** Key of the expanded item, `null` when collapsed. Supports `v-model:activeKey`. */
  activeKey?: Key | null
  defaultActiveKey?: Key | null
  /** Close when the mask is clicked */
  closeOnMaskClick?: boolean
  /** Close when touching outside of the bar and the panel */
  closeOnClickAway?: boolean
  /** Custom arrow icon of the bar items */
  arrowIcon?: VueNode
  /** Mount node of the panels. Default `document.body`; `false` renders in place. */
  getContainer?: GetContainer
  zIndex?: number
  rootClass?: string
  classes?: DropdownSemanticClassNames
  styles?: DropdownSemanticStyles
}

export interface DropdownEmits {
  'update:activeKey': [key: Key | null]
  'change': [key: Key | null]
}

export interface DropdownSlots {
  /** `DropdownItem`s */
  default?: () => any
  arrowIcon?: () => any
}

export interface DropdownExpose {
  /** Collapse the expanded panel */
  close: () => void
}

export interface DropdownItemSemanticClassNames {
  root?: string
  mask?: string
  panel?: string
  body?: string
  option?: string
  footer?: string
}

export interface DropdownItemSemanticStyles {
  root?: CSSProperties
  mask?: CSSProperties
  panel?: CSSProperties
  body?: CSSProperties
  option?: CSSProperties
  footer?: CSSProperties
}

export interface DropdownItemProps {
  /** Title in the bar. Falls back to the label of the selected option. */
  title?: VueNode
  /** Single-select list rendered when no default slot is given */
  options?: DropdownOption[]
  /** Selected option. Supports `v-model:value`. */
  value?: DropdownItemValue
  defaultValue?: DropdownItemValue
  /** Highlight the title in the bar (e.g. a filter is applied) */
  highlight?: boolean
  disabled?: boolean
  /** Close the panel after an option was selected */
  closeOnSelect?: boolean
  /** Show the reset / confirm footer (for custom panels) */
  showFooter?: boolean
  confirmText?: VueNode
  resetText?: VueNode
  /** Custom arrow icon, wins over the one of `Dropdown` */
  arrowIcon?: VueNode
  forceRender?: boolean
  destroyOnHidden?: boolean
  rootClass?: string
  classes?: DropdownItemSemanticClassNames
  styles?: DropdownItemSemanticStyles
}

export interface DropdownItemEmits {
  'update:value': [value: DropdownItemValue]
  'change': [value: DropdownItemValue, option: DropdownOption]
  'confirm': []
  'reset': []
  /** After the panel was expanded / collapsed (animation finished) */
  'afterOpenChange': [open: boolean]
}

export interface DropdownItemSlots {
  /** Custom panel content */
  default?: (params: { close: () => void }) => any
  title?: () => any
  arrowIcon?: () => any
}
