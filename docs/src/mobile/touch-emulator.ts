/**
 * Translates mouse events into touch events on devices without touch support, so every
 * gesture (swipe, drag, pull-to-refresh, picker wheel ...) works with a mouse inside the
 * desktop phone simulator. No-op on real touch devices.
 */
export function setupTouchEmulator() {
  if (typeof window === 'undefined' || 'ontouchstart' in window || navigator.maxTouchPoints > 0)
    return

  let target: EventTarget | null = null

  const createTouch = (event: MouseEvent, el: EventTarget) => ({
    identifier: 1,
    target: el,
    clientX: event.clientX,
    clientY: event.clientY,
    pageX: event.pageX,
    pageY: event.pageY,
    screenX: event.screenX,
    screenY: event.screenY,
    radiusX: 1,
    radiusY: 1,
    rotationAngle: 0,
    force: 1,
  })

  const dispatch = (type: string, event: MouseEvent) => {
    if (!target)
      return
    const touchEvent = new Event(type, { bubbles: true, cancelable: true }) as any
    const touches = type === 'touchend' ? [] : [createTouch(event, target)]
    touchEvent.touches = touches
    touchEvent.targetTouches = touches
    touchEvent.changedTouches = [createTouch(event, target)]
    touchEvent.altKey = event.altKey
    touchEvent.ctrlKey = event.ctrlKey
    touchEvent.metaKey = event.metaKey
    touchEvent.shiftKey = event.shiftKey
    target.dispatchEvent(touchEvent)
    return touchEvent as Event
  }

  window.addEventListener('mousedown', (event) => {
    if (event.button !== 0)
      return
    target = event.target
    dispatch('touchstart', event)
  }, true)

  window.addEventListener('mousemove', (event) => {
    if (!target)
      return
    const touchEvent = dispatch('touchmove', event)
    // a component that prevents the touchmove is handling a drag: stop text selection / native drag
    if (touchEvent?.defaultPrevented)
      event.preventDefault()
  }, true)

  window.addEventListener('mouseup', (event) => {
    if (!target)
      return
    dispatch('touchend', event)
    target = null
  }, true)

  // images and links would start a native drag and swallow the following mouse events
  window.addEventListener('dragstart', event => event.preventDefault(), true)
}
