import type { CSSProperties } from 'vue'
import type { SizeType, VueNode } from '../_util/type'

export type SegmentedValue = string | number

export interface SegmentedLabeledOption {
  label?: VueNode
  value: SegmentedValue
  icon?: VueNode
  disabled?: boolean
  /** Class of the item (same name as antdv-next) */
  className?: string
}

export type SegmentedRawOption = SegmentedValue
export type SegmentedOption = SegmentedRawOption | SegmentedLabeledOption
export type SegmentedOptions = SegmentedOption[]

export interface SegmentedSemanticClassNames {
  root?: string
  item?: string
  icon?: string
  label?: string
}

export interface SegmentedSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  icon?: CSSProperties
  label?: CSSProperties
}

export interface SegmentedProps {
  options?: SegmentedOption[]
  value?: SegmentedValue
  /** Defaults to the value of the first option */
  defaultValue?: SegmentedValue
  /** Fit the width of the parent, items share the width equally */
  block?: boolean
  size?: SizeType
  disabled?: boolean
  shape?: 'default' | 'round'
  vertical?: boolean
  orientation?: 'horizontal' | 'vertical'
  rootClass?: string
  classes?: SegmentedSemanticClassNames
  styles?: SegmentedSemanticStyles
}

export interface SegmentedEmits {
  'update:value': [value: SegmentedValue]
  'change': [value: SegmentedValue]
}

export interface SegmentedSlots {
  iconRender?: (option: SegmentedLabeledOption) => any
  labelRender?: (option: SegmentedLabeledOption) => any
}
