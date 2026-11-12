import type { Ref } from 'vue'
import { unref } from 'vue'
import { inBrowser } from '../index'
import { useEventListener } from './useEventListener'

type Target = Element | null | undefined | Ref<Element | null | undefined>

export interface UseClickAwayOptions {
  /** default `'click'`; use `'touchstart'` to react before the page scrolls. Several names are allowed. */
  eventName?: string | string[]
  /** skip the check entirely (e.g. while closed) */
  enabled?: () => boolean
}

/**
 * Calls `listener` when a click / touch lands outside every `target`.
 * The single place for "close on outside tap" (Popover, Dropdown, SwipeAction, NumberKeyboard ...).
 */
export function useClickAway(
  target: Target | Target[],
  listener: (event: Event) => void,
  options: UseClickAwayOptions = {},
) {
  if (!inBrowser)
    return
  const { eventName = 'click', enabled } = options
  const onEvent = (event: Event) => {
    if (enabled && !enabled())
      return
    const targets = Array.isArray(target) ? target : [target]
    const node = event.target as Node
    const inside = targets.some((item) => {
      const el = unref(item)
      return !!el && el.contains(node)
    })
    if (!inside)
      listener(event)
  }
  const names = Array.isArray(eventName) ? eventName : [eventName]
  names.forEach(name => useEventListener(name, onEvent, { target: document, capture: true, passive: true }))
}
