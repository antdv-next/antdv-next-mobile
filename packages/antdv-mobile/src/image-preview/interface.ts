import type { CSSProperties } from 'vue'
import type { GetContainer, VueNode } from '../_util/type'

export interface ImagePreviewImage {
  src: string
  alt?: string
}

export type ImagePreviewImageType = string | ImagePreviewImage

export interface ImagePreviewIndexInfo {
  /** index of the current image */
  current: number
  total: number
}

export interface ImagePreviewImageInfo {
  src: string
  alt?: string
  index: number
}

export interface ImagePreviewSemanticClassNames {
  root?: string
  image?: string
  index?: string
  footer?: string
}

export interface ImagePreviewSemanticStyles {
  root?: CSSProperties
  image?: CSSProperties
  index?: CSSProperties
  footer?: CSSProperties
}

export interface ImagePreviewProps {
  /** Whether the viewer is visible. Supports `v-model:open`. */
  open?: boolean
  defaultOpen?: boolean
  images?: ImagePreviewImageType[]
  /** Index of the displayed image. Supports `v-model:current`. */
  current?: number
  defaultCurrent?: number
  /** Swipe from the last image to the first one */
  loop?: boolean
  /** Show the `2 / 5` indicator */
  showIndex?: boolean
  /** Show a close icon */
  closable?: boolean
  closeIcon?: VueNode
  /** Close on a single tap */
  closeOnClick?: boolean
  /** Drag an un-zoomed image down to close */
  swipeToClose?: boolean
  maxZoom?: number
  minZoom?: number
  /** Zoom on double tap. A number is the scale to zoom to (default `2`). */
  doubleTapZoom?: boolean | number
  /** Teleport target. Default `document.body`; `false` renders in place. */
  getContainer?: GetContainer
  zIndex?: number
  rootClass?: string
  classes?: ImagePreviewSemanticClassNames
  styles?: ImagePreviewSemanticStyles
}

export interface ImagePreviewEmits {
  'update:open': [open: boolean]
  'update:current': [current: number]
  /** The displayed image changed */
  'change': [current: number]
  /** The user asked to close (tap, close icon, swipe down) */
  'close': []
  'openChange': [open: boolean]
  /** After the enter / leave animation finished */
  'afterOpenChange': [open: boolean]
}

export interface ImagePreviewSlots {
  index?: (info: ImagePreviewIndexInfo) => any
  footer?: (info: ImagePreviewIndexInfo) => any
  /** replaces the `<img>` of every page */
  image?: (info: ImagePreviewImageInfo) => any
  closeIcon?: () => any
}

export interface ImagePreviewShowOptions {
  images: ImagePreviewImageType[]
  /** index of the first displayed image */
  current?: number
  loop?: boolean
  showIndex?: boolean
  closable?: boolean
  closeIcon?: VueNode
  closeOnClick?: boolean
  swipeToClose?: boolean
  maxZoom?: number
  minZoom?: number
  doubleTapZoom?: boolean | number
  getContainer?: GetContainer
  zIndex?: number
  rootClass?: string
  /** custom index indicator */
  index?: (info: ImagePreviewIndexInfo) => any
  /** content fixed at the bottom */
  footer?: (info: ImagePreviewIndexInfo) => any
  onChange?: (current: number) => void
  onClose?: () => void
  afterClose?: () => void
}

export interface ImagePreviewShowHandler {
  close: () => void
}
