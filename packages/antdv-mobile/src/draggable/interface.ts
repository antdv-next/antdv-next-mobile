import type { CSSProperties } from 'vue'
import type { DraggableAxis, DraggableGap, DraggableMagnetic, DraggableOffset } from '../_util/hooks'
import type { GetContainer } from '../_util/type'

export type { DraggableAxis, DraggableGap, DraggableMagnetic, DraggableOffset }

export interface DraggableSemanticClassNames {
  root?: string
}

export interface DraggableSemanticStyles {
  root?: CSSProperties
}

export interface DraggableProps {
  /** Axis the element can be dragged along */
  axis?: DraggableAxis
  /** Snap to the nearest edge of that axis when released */
  magnetic?: DraggableMagnetic
  /** Top-left position in px (relative to the viewport, or the offset parent when positioned absolutely). Supports `v-model:offset`. */
  offset?: DraggableOffset
  /** Minimal distance to the edges, one number or one per side */
  gap?: number | DraggableGap
  disabled?: boolean
  zIndex?: number
  /** Mount node. Rendered in place by default. */
  getContainer?: GetContainer
  rootClass?: string
  classes?: DraggableSemanticClassNames
  styles?: DraggableSemanticStyles
}

export interface DraggableEmits {
  /** Not fired for the click that ends a drag */
  'click': [event: MouseEvent]
  'update:offset': [offset: DraggableOffset]
  /** The element was dropped at a new position (after snapping) */
  'offsetChange': [offset: DraggableOffset]
  'dragStart': []
  'dragEnd': [offset: DraggableOffset]
}

export interface DraggableSlots {
  default?: (ctx: { dragging: boolean }) => any
}

export interface DraggableExpose {
  /** Back to the initial position */
  reset: () => void
  /** Clamp the position again after the container was resized (the window is handled automatically) */
  resize: () => void
  nativeElement: HTMLElement | undefined
}
