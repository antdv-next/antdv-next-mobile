import type { Ref } from 'vue'
import type { MaybeElementRef } from './shared'
import { computed, ref } from 'vue'
import { useEventListener, useTouch } from '../_util/hooks'
import { unrefElement } from './shared'

function targetRef(target: MaybeElementRef) {
  return computed(() => unrefElement(target)) as unknown as Ref<EventTarget | undefined>
}

export interface UseLongPressOptions {
  /** hold time in ms. Default `500`. */
  delay?: number
  /** finger travel (px) that cancels the press. Default `10`. */
  distance?: number
  /** called when the finger lifts after a long press fired */
  onRelease?: (event: TouchEvent) => void
}

/** Long press on an element; a move beyond `distance` or an early release cancels it. */
export function useLongPress(target: MaybeElementRef, handler: (event: TouchEvent) => void, options: UseLongPressOptions = {}) {
  const { delay = 500, distance = 10 } = options
  const pressed = ref(false)
  const touch = useTouch()
  const el = targetRef(target)
  let timer: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (timer !== undefined)
      clearTimeout(timer)
    timer = undefined
  }

  useEventListener('touchstart', ((event: TouchEvent) => {
    clear()
    touch.start(event)
    timer = setTimeout(() => {
      timer = undefined
      pressed.value = true
      handler(event)
    }, delay)
  }) as EventListener, { target: el, passive: true })

  useEventListener('touchmove', ((event: TouchEvent) => {
    touch.move(event)
    if (touch.offsetX.value > distance || touch.offsetY.value > distance)
      clear()
  }) as EventListener, { target: el, passive: true })

  const end = ((event: TouchEvent) => {
    clear()
    if (pressed.value) {
      pressed.value = false
      options.onRelease?.(event)
    }
  }) as EventListener
  useEventListener('touchend', end, { target: el, passive: true })
  useEventListener('touchcancel', end, { target: el, passive: true })

  return { pressed, cancel: clear }
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down'

export interface UseSwipeOptions {
  /** minimum travel in px to count as a swipe. Default `50`. */
  threshold?: number
  onSwipeStart?: (event: TouchEvent) => void
  onSwipe?: (event: TouchEvent, state: { deltaX: number, deltaY: number }) => void
  onSwipeEnd?: (event: TouchEvent, direction: SwipeDirection | undefined) => void
}

/** Swipe detection on an element: live deltas while moving, direction on release. */
export function useSwipe(target: MaybeElementRef, options: UseSwipeOptions = {}) {
  const { threshold = 50 } = options
  const touch = useTouch()
  const isSwiping = ref(false)
  const direction = ref<SwipeDirection>()
  const el = targetRef(target)

  const resolve = (): SwipeDirection | undefined => {
    const { deltaX, deltaY, offsetX, offsetY } = touch
    if (Math.max(offsetX.value, offsetY.value) < threshold)
      return undefined
    if (offsetX.value > offsetY.value)
      return deltaX.value > 0 ? 'right' : 'left'
    return deltaY.value > 0 ? 'down' : 'up'
  }

  useEventListener('touchstart', ((event: TouchEvent) => {
    touch.start(event)
    direction.value = undefined
    isSwiping.value = true
    options.onSwipeStart?.(event)
  }) as EventListener, { target: el, passive: true })

  useEventListener('touchmove', ((event: TouchEvent) => {
    if (!isSwiping.value)
      return
    touch.move(event)
    options.onSwipe?.(event, { deltaX: touch.deltaX.value, deltaY: touch.deltaY.value })
  }) as EventListener, { target: el, passive: true })

  const end = ((event: TouchEvent) => {
    if (!isSwiping.value)
      return
    isSwiping.value = false
    direction.value = resolve()
    options.onSwipeEnd?.(event, direction.value)
  }) as EventListener
  useEventListener('touchend', end, { target: el, passive: true })
  useEventListener('touchcancel', end, { target: el, passive: true })

  return { isSwiping, direction, deltaX: touch.deltaX, deltaY: touch.deltaY }
}
