import type { CSSProperties } from 'vue'

export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanned'
export type QRCodeType = 'canvas' | 'svg'
export type QRCodeErrorLevelType = 'L' | 'M' | 'Q' | 'H'

export interface QRCodeLocale {
  expired: string
  refresh: string
  scanned: string
}

export interface QRCodeStatusRenderInfo {
  status: Exclude<QRCodeStatus, 'active'>
  locale: QRCodeLocale
  /** Only present when a `refresh` listener is bound */
  onRefresh?: () => void
}

export interface QRCodeIconSize {
  width: number
  height: number
}

export interface QRCodeSemanticClassNames {
  root?: string
  cover?: string
}

export interface QRCodeSemanticStyles {
  root?: CSSProperties
  cover?: CSSProperties
}

export interface QRCodeProps {
  /** Scanned text. An array is encoded as several segments */
  value?: string | string[]
  /** Render type */
  type?: QRCodeType
  /** Url of the image in the center of the QR code */
  icon?: string
  /** Size of the icon in px */
  iconSize?: number | QRCodeIconSize
  /** Size of the whole QR code box: a number (px) or any CSS length such as `100%` / `60vw` */
  size?: number | string
  /** Color of the modules, follows the theme text color by default */
  color?: string
  /** Background color of the QR code */
  bgColor?: string
  /** Quiet zone in modules */
  marginSize?: number
  bordered?: boolean
  /** Error correction level */
  errorLevel?: QRCodeErrorLevelType
  /** Use a higher error correction level when it does not make the QR code bigger */
  boostLevel?: boolean
  status?: QRCodeStatus
  /** Custom status renderer, the same-named slot wins */
  statusRender?: (info: QRCodeStatusRenderInfo) => any
  /** Accessible title of the QR code */
  title?: string
  rootClass?: string
  classes?: QRCodeSemanticClassNames
  styles?: QRCodeSemanticStyles
}

export interface QRCodeEmits {
  refresh: []
}

export interface QRCodeSlots {
  statusRender?: (info: QRCodeStatusRenderInfo) => any
}

export interface QRCodeRef {
  /** The root element */
  nativeElement: HTMLDivElement | undefined
  /**
   * Image of the QR code as a data URL. `canvas`: `canvas.toDataURL(type, quality)` (png by default);
   * `svg`: an `image/svg+xml` data URL.
   */
  toDataURL: (type?: string, quality?: number) => string | undefined
}
