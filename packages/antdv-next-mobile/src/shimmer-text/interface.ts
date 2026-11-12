import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export interface ShimmerTextSemanticClassNames {
  root?: string
}

export interface ShimmerTextSemanticStyles {
  root?: CSSProperties
}

export interface ShimmerTextProps {
  /** Text content, the default slot wins */
  content?: VueNode
  /** Play the shimmer. `false` renders plain text in the base color. */
  active?: boolean
  /** Time of one sweep, numbers are seconds */
  duration?: number | string
  /** Base text color */
  color?: string
  /** Color of the moving highlight */
  shimmerColor?: string
  /** Root tag */
  tag?: string
  rootClass?: string
  classes?: ShimmerTextSemanticClassNames
  styles?: ShimmerTextSemanticStyles
}

export interface ShimmerTextSlots {
  default?: () => any
}
