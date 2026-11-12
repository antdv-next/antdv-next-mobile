import type { AppContext } from 'vue'

export type LoadingBarStatus = 'loading' | 'error'

export interface LoadingBarConfigOptions {
  /** Bar color, the primary color by default */
  color?: string
  /** Bar color after `error()`, the error color by default */
  errorColor?: string
  /** Bar thickness, numbers are px */
  height?: number | string
  /** Distance to the top of the viewport, numbers are px (e.g. below a fixed NavBar) */
  top?: number | string
  zIndex?: number
  getContainer?: () => HTMLElement
  /** App context of the host app */
  appContext?: AppContext
}

export interface LoadingBarApi {
  /** Show the bar and let it creep forward */
  start: () => void
  /** Fill the bar and fade it out */
  finish: () => void
  /** Fill the bar in the error color and fade it out */
  error: () => void
  config: (options: LoadingBarConfigOptions) => void
}

/** Props of the internal bar component */
export interface LoadingBarProps {
  open?: boolean
  /** 0 - 100 */
  percent?: number
  status?: LoadingBarStatus
  /** `false` jumps to `percent` without a transition */
  animated?: boolean
  /** Fading out after `finish()` / `error()` */
  leaving?: boolean
  color?: string
  errorColor?: string
  height?: number | string
  top?: number | string
  zIndex?: number
  getContainer?: () => HTMLElement
}
