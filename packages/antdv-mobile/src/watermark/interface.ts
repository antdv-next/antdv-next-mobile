export interface WatermarkFont {
  /** Any canvas color; follows the theme (`--am-watermark-color`) by default */
  color?: string
  fontSize?: number | string
  fontWeight?: 'normal' | 'lighter' | 'bold' | 'bolder' | number
  fontStyle?: 'none' | 'normal' | 'italic' | 'oblique'
  fontFamily?: string
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end'
}

export interface WatermarkProps {
  /** z-index of the watermark layer */
  zIndex?: number
  /** Rotation in degrees */
  rotate?: number
  /** Width of one watermark, measured from the content by default */
  width?: number
  /** Height of one watermark, measured from the content by default */
  height?: number
  /** Image source, takes priority over `content` (a 2x / 3x image is recommended) */
  image?: string
  /** Watermark text, an array renders multiple lines */
  content?: string | string[]
  font?: WatermarkFont
  /** Space between watermarks: `[horizontal, vertical]` */
  gap?: [number, number]
  /** Offset from the top left corner, `gap / 2` by default */
  offset?: [number, number]
  /** Mobile only: cover the whole viewport (`position: fixed`) */
  fullPage?: boolean
  rootClass?: string
}

export interface WatermarkEmits {
  /** The watermark layer was removed or modified from outside (it is restored right away) */
  remove: []
}

export interface WatermarkSlots {
  default?: () => any
}
