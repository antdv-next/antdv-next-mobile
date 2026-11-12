import type { CSSProperties, ImgHTMLAttributes } from 'vue'
import type { GetContainer, Numeric, VueNode } from '../_util/type'
import type { ImagePreviewImageType } from '../image-preview/interface'

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'

export interface ImagePreviewConfig {
  /** Controlled visibility of the preview */
  open?: boolean
  /** Image shown in the preview (e.g. the original of a thumbnail). Defaults to `src`. */
  src?: string
  closable?: boolean
  closeIcon?: VueNode
  /** Close on a single tap */
  closeOnClick?: boolean
  /** Drag down to close */
  swipeToClose?: boolean
  maxScale?: number
  minScale?: number
  /** Zoom on double tap, a number is the target scale */
  doubleTapZoom?: boolean | number
  getContainer?: GetContainer
  zIndex?: number
  rootClass?: string
}

export interface ImagePreviewGroupConfig extends ImagePreviewConfig {
  /** Controlled index of the displayed image */
  current?: number
  /** Swipe from the last image to the first one */
  loop?: boolean
  /** Show the `2 / 5` indicator */
  showIndex?: boolean
}

export interface ImageSemanticClassNames {
  root?: string
  image?: string
  placeholder?: string
}

export interface ImageSemanticStyles {
  root?: CSSProperties
  image?: CSSProperties
  placeholder?: CSSProperties
}

export interface ImageProps {
  src?: string
  alt?: string
  width?: Numeric
  height?: Numeric
  /** Image shown when `src` fails to load */
  fallback?: string
  /** Loading placeholder. `true` (default) shows the built-in one, `false` hides it. The same-named slot wins. */
  placeholder?: boolean | VueNode
  /**
   * Tap to open the full-screen preview. Defaults to `false`, or `true` inside an `ImagePreviewGroup`.
   */
  preview?: boolean | ImagePreviewConfig
  /** `object-fit` of the image */
  fit?: ImageFit
  /** `object-position` of the image */
  position?: string
  /** Load the image when it enters the viewport */
  lazy?: boolean
  /** Border radius */
  radius?: Numeric
  /** Round shape */
  round?: boolean
  crossorigin?: 'anonymous' | 'use-credentials' | ''
  referrerpolicy?: ImgHTMLAttributes['referrerpolicy']
  rootClass?: string
  classes?: ImageSemanticClassNames
  styles?: ImageSemanticStyles
}

export interface ImageEmits {
  load: [event: Event]
  error: [event: Event]
  click: [event: MouseEvent]
  /** The preview was opened / closed */
  openChange: [open: boolean]
}

export interface ImageSlots {
  /** content shown while loading */
  placeholder?: () => any
  /** content shown when loading failed */
  fallback?: () => any
}

export interface ImagePreviewGroupProps {
  /** Images of the preview. Defaults to the `Image` children of the group. */
  items?: ImagePreviewImageType[]
  preview?: boolean | ImagePreviewGroupConfig
  /** Default `fallback` of the images inside the group */
  fallback?: string
}

export interface ImagePreviewGroupEmits {
  openChange: [open: boolean, info: { current: number }]
  change: [current: number, prevCurrent: number]
}

export interface ImagePreviewGroupSlots {
  default?: () => any
}
