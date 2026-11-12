import type { ComputedRef, CSSProperties, MaybeRefOrGetter, Ref } from 'vue'
import { computed, getCurrentScope, onScopeDispose, ref, toValue, watch } from 'vue'
import { clamp, preventDefault } from '../index'
import { useTouch } from './useTouch'

export interface DraggableOffset {
  x: number
  y: number
}

export interface DraggableGap {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export type DraggableAxis = 'x' | 'y' | 'xy'
export type DraggableMagnetic = 'x' | 'y'

export interface UseDraggableOptions {
  disabled?: MaybeRefOrGetter<boolean | undefined>
  /** Axis the element can be dragged along. Default `xy`. */
  axis?: MaybeRefOrGetter<DraggableAxis | undefined>
  /** Snap to the nearest edge of that axis when released */
  magnetic?: MaybeRefOrGetter<DraggableMagnetic | undefined>
  /** Minimal distance to the edges, one number or one per side. Default `0`. */
  gap?: MaybeRefOrGetter<number | DraggableGap | undefined>
  /** Controlled top-left position in px */
  offset?: MaybeRefOrGetter<DraggableOffset | undefined>
  onStart?: () => void
  /** The element was dropped at a new position (after snapping) */
  onEnd?: (offset: DraggableOffset) => void
}

export interface UseDraggableReturn {
  /** `undefined` until the element was dragged or an `offset` was given: it then sits where its css puts it */
  position: Ref<DraggableOffset | undefined>
  dragging: Ref<boolean>
  /** Bind to the element: moves it with a transform from the top-left corner */
  style: ComputedRef<CSSProperties | undefined>
  onTouchStart: (event: TouchEvent) => void
  onTouchMove: (event: TouchEvent) => void
  onTouchEnd: () => void
  /** Mouse fallback so dragging also works in desktop browsers */
  onMouseDown: (event: MouseEvent) => void
  /** `true` once for the click that follows a drag: swallow it */
  consumeClick: () => boolean
  /** Back to the initial position */
  reset: () => void
  /** Clamp the position again after the viewport / container was resized */
  resize: () => void
}

interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

/**
 * Lets an element be dragged inside the viewport (`position: fixed`) or its offset parent
 * (`position: absolute`). Shared by `Draggable` and `FloatButton`.
 */
export function useDraggable(target: Ref<HTMLElement | undefined>, options: UseDraggableOptions = {}): UseDraggableReturn {
  const touch = useTouch()
  const initial = toValue(options.offset)
  const position = ref<DraggableOffset | undefined>(initial ? { ...initial } : undefined)
  const dragging = ref(false)
  let startPosition: DraggableOffset = { x: 0, y: 0 }
  let bounds: Bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  let justDragged = false
  let resetTimer: ReturnType<typeof setTimeout> | undefined

  watch(() => toValue(options.offset), (value) => {
    if (value)
      position.value = { x: value.x, y: value.y }
  })

  function measure(el: HTMLElement) {
    const rect = el.getBoundingClientRect()
    // `position: absolute` usage: move inside the offset parent instead of the viewport
    const parent = window.getComputedStyle(el).position === 'absolute' ? el.offsetParent as HTMLElement | null : null
    let originX = 0
    let originY = 0
    let width = window.innerWidth
    let height = window.innerHeight
    if (parent) {
      const parentRect = parent.getBoundingClientRect()
      originX = parentRect.left + parent.clientLeft
      originY = parentRect.top + parent.clientTop
      width = parent.clientWidth
      height = parent.clientHeight
    }
    const gap = toValue(options.gap) ?? 0
    const sides = typeof gap === 'number' ? { top: gap, right: gap, bottom: gap, left: gap } : gap
    const minX = sides.left ?? 0
    const minY = sides.top ?? 0
    bounds = {
      minX,
      maxX: Math.max(minX, width - rect.width - (sides.right ?? 0)),
      minY,
      maxY: Math.max(minY, height - rect.height - (sides.bottom ?? 0)),
    }
    return { x: rect.left - originX, y: rect.top - originY }
  }

  function onTouchStart(event: TouchEvent) {
    const el = target.value
    if (toValue(options.disabled) || !el)
      return
    touch.start(event)
    const current = measure(el)
    startPosition = position.value ?? current
    dragging.value = true
    options.onStart?.()
  }

  function applyMove() {
    const axis = toValue(options.axis) ?? 'xy'
    const next = { ...startPosition }
    if (axis !== 'y')
      next.x = clamp(startPosition.x + touch.deltaX.value, bounds.minX, bounds.maxX)
    if (axis !== 'x')
      next.y = clamp(startPosition.y + touch.deltaY.value, bounds.minY, bounds.maxY)
    position.value = next
  }

  function onTouchMove(event: TouchEvent) {
    if (!dragging.value)
      return
    touch.move(event)
    if (touch.isTap.value)
      return
    preventDefault(event)
    applyMove()
  }

  function onTouchEnd() {
    if (!dragging.value)
      return
    dragging.value = false
    if (touch.isTap.value || !position.value)
      return
    const magnetic = toValue(options.magnetic)
    const next = { ...position.value }
    if (magnetic === 'x')
      next.x = next.x - bounds.minX < bounds.maxX - next.x ? bounds.minX : bounds.maxX
    else if (magnetic === 'y')
      next.y = next.y - bounds.minY < bounds.maxY - next.y ? bounds.minY : bounds.maxY
    position.value = next
    options.onEnd?.(next)
    // a drag must not be followed by a click
    justDragged = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      justDragged = false
    }, 0)
  }

  function toTouchEvent(event: MouseEvent) {
    return { touches: [{ clientX: event.clientX, clientY: event.clientY }] } as unknown as TouchEvent
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging.value)
      return
    touch.move(toTouchEvent(event))
    if (touch.isTap.value)
      return
    preventDefault(event)
    applyMove()
  }

  function removeMouseListeners() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  function onMouseUp() {
    removeMouseListeners()
    onTouchEnd()
  }

  function onMouseDown(event: MouseEvent) {
    if (event.button !== 0 || dragging.value)
      return
    onTouchStart(toTouchEvent(event))
    if (dragging.value) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
  }

  function consumeClick() {
    if (!justDragged)
      return false
    justDragged = false
    return true
  }

  function reset() {
    dragging.value = false
    position.value = initial ? { ...initial } : undefined
  }

  function resize() {
    const el = target.value
    if (!el || !position.value)
      return
    measure(el)
    position.value = {
      x: clamp(position.value.x, bounds.minX, bounds.maxX),
      y: clamp(position.value.y, bounds.minY, bounds.maxY),
    }
  }

  const style = computed<CSSProperties | undefined>(() => {
    if (!position.value)
      return undefined
    return {
      inset: '0 auto auto 0',
      transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`,
    }
  })

  if (getCurrentScope()) {
    onScopeDispose(() => {
      clearTimeout(resetTimer)
      removeMouseListeners()
    })
  }

  return { position, dragging, style, onTouchStart, onTouchMove, onTouchEnd, onMouseDown, consumeClick, reset, resize }
}
