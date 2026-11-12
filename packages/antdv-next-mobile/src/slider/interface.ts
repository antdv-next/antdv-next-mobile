import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type SliderValue = number | number[]

export interface SliderMarkObject {
  style?: CSSProperties
  label?: VueNode
}

export type SliderMarks = Record<number, VueNode | SliderMarkObject>

export interface SliderTooltipConfig {
  /** `true`: always visible, `false`: never visible, `undefined`: visible while dragging */
  open?: boolean
  /** Formats the bubble content, `null` hides the bubble */
  formatter?: ((value: number) => VueNode) | null
}

export interface SliderSemanticClassNames {
  root?: string
  rail?: string
  track?: string
  handle?: string
}

export interface SliderSemanticStyles {
  root?: CSSProperties
  rail?: CSSProperties
  track?: CSSProperties
  handle?: CSSProperties
}

export interface SliderProps {
  /** Current value, `[number, number]` when `range`; supports `v-model:value` */
  value?: number | number[]
  defaultValue?: number | number[]
  min?: number
  max?: number
  /** Step, `null` makes `marks` (plus `min` / `max`) the only selectable values */
  step?: number | null
  /** Dual thumb mode */
  range?: boolean
  disabled?: boolean
  marks?: SliderMarks
  /** Show a dot for every step */
  dots?: boolean
  /** Fill the track between `min` (or the two handles) and the value */
  included?: boolean
  reverse?: boolean
  vertical?: boolean
  /** Takes priority over `vertical` */
  orientation?: 'horizontal' | 'vertical'
  keyboard?: boolean
  /** Value bubble above the handle */
  tooltip?: SliderTooltipConfig
  id?: string
  ariaLabelForHandle?: string | string[]
  rootClass?: string
  classes?: SliderSemanticClassNames
  styles?: SliderSemanticStyles
}

export interface SliderEmits {
  'update:value': [value: any]
  'change': [value: any]
  /** Fired when the finger is lifted (or the key is released) */
  'changeComplete': [value: any]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
}

export interface SliderSlots {
  /** Custom mark content */
  mark?: (ctx: { point: number, label?: any }) => any
  /** Custom handle content */
  handle?: (ctx: { value: number, index: number, dragging: boolean }) => any
}

export interface SliderExpose {
  focus: () => void
  blur: () => void
}
