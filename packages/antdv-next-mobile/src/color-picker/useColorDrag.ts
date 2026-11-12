import type { Ref } from 'vue'
import { onBeforeUnmount, ref } from 'vue'
import { clamp, preventDefault } from '../_util'
import { useTouch } from '../_util/hooks'

export interface UseColorDragOptions {
  disabled: () => boolean
  /** position of the finger inside the target, both 0 - 1 */
  onChange: (x: number, y: number) => void
  onEnd: () => void
}

/** Touch (and mouse) drag inside an element, reported as a ratio of its box. */
export function useColorDrag(target: Ref<HTMLElement | undefined>, options: UseColorDragOptions) {
  const touch = useTouch()
  const dragging = ref(false)
  let lastTouchTime = 0

  function update(clientX: number, clientY: number) {
    const rect = target.value?.getBoundingClientRect()
    if (!rect)
      return
    options.onChange(
      rect.width > 0 ? clamp((clientX - rect.left) / rect.width, 0, 1) : 0,
      rect.height > 0 ? clamp((clientY - rect.top) / rect.height, 0, 1) : 0,
    )
  }

  function end() {
    if (!dragging.value)
      return
    dragging.value = false
    options.onEnd()
  }

  function onTouchstart(event: TouchEvent) {
    if (options.disabled())
      return
    lastTouchTime = Date.now()
    touch.start(event)
    dragging.value = true
    update(touch.startX.value, touch.startY.value)
  }

  function onTouchmove(event: TouchEvent) {
    if (!dragging.value)
      return
    preventDefault(event)
    touch.move(event)
    update(touch.startX.value + touch.deltaX.value, touch.startY.value + touch.deltaY.value)
  }

  function onTouchend() {
    lastTouchTime = Date.now()
    end()
  }

  // mouse support, so the panel also works in desktop browsers
  function onMousemove(event: MouseEvent) {
    update(event.clientX, event.clientY)
  }

  function removeMouseListeners() {
    document.removeEventListener('mousemove', onMousemove)
    document.removeEventListener('mouseup', onMouseup)
  }

  function onMouseup() {
    removeMouseListeners()
    end()
  }

  function onMousedown(event: MouseEvent) {
    // ignore the mouse events emulated after a touch
    if (options.disabled() || event.button !== 0 || Date.now() - lastTouchTime < 500)
      return
    event.preventDefault()
    dragging.value = true
    update(event.clientX, event.clientY)
    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }

  onBeforeUnmount(() => {
    if (typeof document !== 'undefined')
      removeMouseListeners()
  })

  return {
    dragging,
    handlers: { touchstart: onTouchstart, touchmove: onTouchmove, touchend: onTouchend, touchcancel: onTouchend, mousedown: onMousedown },
  }
}
