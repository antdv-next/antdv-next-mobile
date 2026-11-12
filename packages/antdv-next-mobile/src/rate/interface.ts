import type { CSSProperties } from 'vue'
import type { RenderNodeFn, SizeType } from '../_util/type'

export interface RateCharacterContext {
  /** Zero-based index of the star */
  index: number
  /** Current value of the Rate */
  value: number
}

export interface RateSemanticClassNames {
  root?: string
  star?: string
}

export interface RateSemanticStyles {
  root?: CSSProperties
  star?: CSSProperties
}

export interface RateProps {
  /** Current value, supports `v-model:value` */
  value?: number
  defaultValue?: number
  /** Number of stars */
  count?: number
  allowHalf?: boolean
  /** Tap the current value again (or drag out of the first star) to reset to 0 */
  allowClear?: boolean
  /** Read only, no interaction */
  disabled?: boolean
  /** Custom character, the same-named slot wins */
  character?: RenderNodeFn<RateCharacterContext>
  size?: SizeType
  /** Arrow keys support */
  keyboard?: boolean
  id?: string
  rootClass?: string
  classes?: RateSemanticClassNames
  styles?: RateSemanticStyles
}

export interface RateEmits {
  'update:value': [value: number]
  'change': [value: number]
  'focus': []
  'blur': []
  'keydown': [event: KeyboardEvent]
}

export interface RateSlots {
  character?: (ctx: RateCharacterContext) => any
}

export interface RateExpose {
  focus: () => void
  blur: () => void
}
