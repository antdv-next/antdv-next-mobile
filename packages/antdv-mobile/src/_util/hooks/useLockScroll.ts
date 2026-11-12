import type { Ref } from 'vue'
import { onBeforeUnmount, onDeactivated, watch } from 'vue'
import { getScrollParent, inBrowser, preventDefault } from '../index'
import { useTouch } from './useTouch'

let totalLockCount = 0
const BODY_LOCK_CLASS = 'am-overflow-hidden'

/**
 * Locks page scrolling while `shouldLock()` is true, but keeps scrolling inside `rootRef` working.
 */
export function useLockScroll(rootRef: Ref<HTMLElement | undefined | null>, shouldLock: () => boolean) {
  const touch = useTouch()
  let locked = false

  const onTouchMove = (event: TouchEvent) => {
    touch.move(event)
    const direction = touch.deltaY.value > 0 ? '10' : '01'
    const el = getScrollParent(event.target as Element, rootRef.value as HTMLElement) as HTMLElement
    const { scrollHeight, offsetHeight, scrollTop } = el
    let status = '11'
    if (scrollTop === 0)
      status = offsetHeight >= scrollHeight ? '00' : '01'
    else if (scrollTop + offsetHeight >= scrollHeight)
      status = '10'

    if (status !== '11' && touch.isVertical() && !(Number.parseInt(status, 2) & Number.parseInt(direction, 2)))
      preventDefault(event, true)
  }

  const lock = () => {
    if (!inBrowser || locked)
      return
    locked = true
    document.addEventListener('touchstart', touch.start)
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.body.classList.add(BODY_LOCK_CLASS)
    totalLockCount++
  }

  const unlock = () => {
    if (!locked)
      return
    locked = false
    document.removeEventListener('touchstart', touch.start)
    document.removeEventListener('touchmove', onTouchMove)
    totalLockCount = Math.max(totalLockCount - 1, 0)
    if (!totalLockCount)
      document.body.classList.remove(BODY_LOCK_CLASS)
  }

  watch(shouldLock, value => (value ? lock() : unlock()), { immediate: true })
  onDeactivated(unlock)
  onBeforeUnmount(unlock)

  return { lock, unlock }
}
