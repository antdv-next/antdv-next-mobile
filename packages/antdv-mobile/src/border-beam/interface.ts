import type { CSSProperties } from 'vue'

export interface BorderBeamGradientItem {
  color: string
  /** Position of the stop, `0 ~ 100` */
  percent: number
}

export type BorderBeamGradient = BorderBeamGradientItem[]

export type BorderBeamColor = string | BorderBeamGradient

export interface BorderBeamItem {
  color?: BorderBeamColor
  lineWidth?: number | string
  outset?: number | string
  size?: number | string
}

export interface BorderBeamSemanticClassNames {
  root?: string
}

export interface BorderBeamSemanticStyles {
  root?: CSSProperties
}

export interface BorderBeamProps {
  /** Beam color: a solid color or gradient stops (`percent` in `0 ~ 100`) */
  color?: BorderBeamColor
  /** Number of evenly distributed beams, a positive integer. Default `1`. */
  count?: number
  /** Seconds one beam needs for a full loop. Default `6`. */
  duration?: number
  /** Per-beam config. Its length is the number of beams and wins over `count`. */
  items?: BorderBeamItem[]
  /** Width of the beam line, numbers are px. Default `1px`. */
  lineWidth?: number | string
  /** How far the beam layer sits outside the padding box of the host. Default: the border width of the host. */
  outset?: number | string
  /** Size of the visible beam segment, numbers are px. Default `100`. */
  size?: number | string
  rootClass?: string
  classes?: BorderBeamSemanticClassNames
  styles?: BorderBeamSemanticStyles
}

export interface BorderBeamSlots {
  /** The decorated container: a single element, or a component with a single root element */
  default?: () => any
}
