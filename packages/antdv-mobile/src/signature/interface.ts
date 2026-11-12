import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'

export type SignatureType = 'png' | 'jpg'

export interface SignatureSemanticClassNames {
  root?: string
  content?: string
  canvas?: string
  placeholder?: string
  footer?: string
}

export interface SignatureSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  canvas?: CSSProperties
  placeholder?: CSSProperties
  footer?: CSSProperties
}

export interface SignatureConfirmResult {
  /** Data URL of the signature, an empty string when nothing was drawn */
  image: string
  canvas: HTMLCanvasElement | undefined
}

export interface SignatureFooterContext {
  clear: () => void
  confirm: () => void
  /** Whether nothing has been drawn yet */
  empty: boolean
  disabled: boolean
}

export interface SignatureProps {
  /** Color of the stroke, defaults to the resolved `--am-signature-pen-color` (text color of the theme) */
  penColor?: string
  /** Width of the stroke in px */
  lineWidth?: number
  /** Background of the exported image, transparent for `png` and white for `jpg` by default */
  backgroundColor?: string
  /** Format of the exported image */
  type?: SignatureType
  /** Quality of the exported `jpg`, between 0 and 1 */
  quality?: number
  disabled?: boolean
  /** Hint shown while the canvas is empty, the same-named slot wins */
  placeholder?: VueNode
  /** Text shown when the browser does not support canvas, the same-named slot wins */
  tips?: VueNode
  /** Text of the clear button, the same-named slot wins */
  clearText?: VueNode
  /** Text of the confirm button, the same-named slot wins */
  confirmText?: VueNode
  /** Custom footer, `false` / `null` hides the built-in buttons; the same-named slot wins */
  footer?: VueNode
  rootClass?: string
  classes?: SignatureSemanticClassNames
  styles?: SignatureSemanticStyles
}

export interface SignatureEmits {
  start: [event: TouchEvent | MouseEvent]
  signing: [event: TouchEvent | MouseEvent]
  end: [event: TouchEvent | MouseEvent]
  confirm: [result: SignatureConfirmResult]
  clear: []
}

export interface SignatureSlots {
  placeholder?: () => any
  tips?: () => any
  clearText?: () => any
  confirmText?: () => any
  footer?: (ctx: SignatureFooterContext) => any
}

export interface SignatureExpose {
  /** Remove every stroke and emit `clear` */
  clear: () => void
  /** Emit `confirm` with the exported image and return the payload */
  confirm: () => SignatureConfirmResult
  /** Export the signature as a data URL, `''` when empty */
  toDataURL: () => string
  isEmpty: () => boolean
  /** Fit the canvas to its current size (keeps the strokes), call it after the container became visible / resized */
  resize: () => void
}
