/**
 * Translates mouse events into touch events, so every gesture (swipe, drag, pull-to-refresh,
 * picker wheel ...) works with a mouse inside the desktop phone simulator. Touch input keeps
 * the native events: the compatibility mouse events a touch produces are skipped. A synthetic
 * touch never triggers the browser's native panning, so a mouse drag also scrolls the nearest
 * scrollable container by hand (a finger would scroll it natively). Once the press leaves the
 * tap zone it also stops selecting text and swallows the trailing click, like a finger drag.
 */
export function setupTouchEmulator() {
  if (typeof window === 'undefined')
    return

  let target: EventTarget | null = null
  // `pointerdown` fires before the compatibility mouse events; remember what produced them.
  // Devices with a touch screen (or an emulated one) still get mouse translation.
  let pointerType = ''
  let scroller: Element | null = null
  let scrollAxis: 'x' | 'y' | null = null
  let scrollBlocked = false
  let dragging = false
  let suppressClick = false
  let startX = 0
  let startY = 0
  let lastX = 0
  let lastY = 0

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

  /** the nearest ancestor a finger drag would pan on the given axis */
  const findScroller = (el: EventTarget | null, horizontal: boolean) => {
    for (let node = el instanceof Element ? el : null; node; node = node.parentElement) {
      const { overflowX, overflowY } = getComputedStyle(node)
      if (!/^(?:auto|scroll|overlay)$/.test(horizontal ? overflowX : overflowY))
        continue
      const rest = horizontal
        ? node.scrollWidth - node.clientWidth
        : node.scrollHeight - node.clientHeight
      if (rest > 1)
        return node
    }
    return null
  }

  window.addEventListener('pointerdown', (event) => {
    pointerType = event.pointerType
  }, true)

  window.addEventListener('mousedown', (event) => {
    const source = pointerType
    pointerType = ''
    // a touch screen or an emulated touch device: the browser already dispatches touch events
    if (event.button !== 0 || (source && source !== 'mouse'))
      return
    target = event.target
    scroller = null
    scrollAxis = null
    scrollBlocked = false
    dragging = false
    suppressClick = false
    startX = lastX = event.clientX
    startY = lastY = event.clientY
    // a component that swallows the touchstart does not want the container to scroll either
    scrollBlocked = !!dispatch('touchstart', event)?.defaultPrevented
  }, true)

  // the gesture ended: mouseup, or a mousemove after a release outside the frame
  const finish = (event: MouseEvent) => {
    if (!target)
      return
    dispatch('touchend', event)
    target = null
    scroller = null
    scrollAxis = null
    scrollBlocked = false
    if (!dragging)
      return
    dragging = false
    document.documentElement.style.removeProperty('user-select')
    // browsers still fire a click after a drag; a finger drag never does
    suppressClick = true
    setTimeout(() => {
      suppressClick = false
    }, 0)
  }

  window.addEventListener('mousemove', (event) => {
    if (!target)
      return
    // the button was released outside the frame: no mouseup will arrive
    if (!(event.buttons & 1)) {
      finish(event)
      return
    }

    // a finger drag selects nothing and presses nothing: once the press leaves the tap zone,
    // keep the page selection-free for the rest of the gesture
    if (!dragging && Math.max(Math.abs(event.clientX - startX), Math.abs(event.clientY - startY)) > 8) {
      dragging = true
      window.getSelection()?.removeAllRanges()
      document.documentElement.style.setProperty('user-select', 'none')
    }
    if (dragging)
      event.preventDefault()

    const touchEvent = dispatch('touchmove', event)
    // a component that prevents the touchmove is handling a drag: keep selection / native drag off
    if (touchEvent?.defaultPrevented) {
      scrollBlocked = true
      event.preventDefault()
      return
    }
    if (scrollBlocked)
      return
    const deltaX = event.clientX - lastX
    const deltaY = event.clientY - lastY
    lastX = event.clientX
    lastY = event.clientY
    if (!scrollAxis) {
      const totalX = event.clientX - startX
      const totalY = event.clientY - startY
      // wait until the direction is clear, then lock it
      if (Math.max(Math.abs(totalX), Math.abs(totalY)) < 8)
        return
      const horizontal = Math.abs(totalX) > Math.abs(totalY)
      scroller = findScroller(target, horizontal)
      if (!scroller) {
        scrollBlocked = true
        return
      }
      scrollAxis = horizontal ? 'x' : 'y'
    }
    if (!scroller)
      return
    if (scrollAxis === 'x')
      scroller.scrollLeft -= deltaX
    else
      scroller.scrollTop -= deltaY
    event.preventDefault()
  }, true)

  window.addEventListener('mouseup', finish, true)

  // the browser starts a selection as the default action of the drag; a finger drag has none
  window.addEventListener('selectstart', (event) => {
    if (dragging)
      event.preventDefault()
  }, true)

  // a drag must not press the element it ends on (dates, options, rows ...)
  window.addEventListener('click', (event) => {
    if (!suppressClick)
      return
    suppressClick = false
    event.preventDefault()
    event.stopImmediatePropagation()
  }, true)

  // images and links would start a native drag and swallow the following mouse events
  window.addEventListener('dragstart', event => event.preventDefault(), true)
}
