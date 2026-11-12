import type { CSSProperties } from 'vue'

export interface AffixSemanticClassNames {
  root?: string
  /** the element that gets fixed */
  affix?: string
}

export interface AffixSemanticStyles {
  root?: CSSProperties
  affix?: CSSProperties
}

export interface AffixProps {
  /** Pin when the distance to the top of the target is smaller than this value (default `0`) */
  offsetTop?: number
  /** Pin when the distance to the bottom of the target is smaller than this value */
  offsetBottom?: number
  /** The scrollable element to observe, defaults to `window` */
  target?: () => Window | HTMLElement | null
  /** z-index of the pinned element */
  zIndex?: number
  rootClass?: string
  classes?: AffixSemanticClassNames
  styles?: AffixSemanticStyles
}

export interface AffixEmits {
  change: [affixed: boolean]
}

export interface AffixSlots {
  default?: () => any
}

export interface AffixRef {
  /** re-calculate the position (it is done automatically on scroll / resize) */
  updatePosition: () => void
}
