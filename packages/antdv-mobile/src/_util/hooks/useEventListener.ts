import type { Ref } from 'vue'
import { getCurrentInstance, getCurrentScope, isRef, onMounted, onScopeDispose, unref, watch } from 'vue'
import { inBrowser } from '../index'

type TargetRef = EventTarget | Ref<EventTarget | undefined | null>

export interface UseEventListenerOptions {
  target?: TargetRef
  capture?: boolean
  passive?: boolean
}

/** Adds an event listener on mount (default target: window) and removes it on unmount. */
export function useEventListener<K extends keyof DocumentEventMap>(type: K, listener: (event: DocumentEventMap[K]) => void, options?: UseEventListenerOptions): () => void
export function useEventListener(type: string, listener: EventListener, options?: UseEventListenerOptions): () => void
export function useEventListener(type: string, listener: EventListener, options: UseEventListenerOptions = {}) {
  if (!inBrowser)
    return () => {}
  const { target = window, passive = false, capture = false } = options
  let attached: EventTarget | undefined | null

  const add = (el?: EventTarget | null) => {
    remove()
    if (el) {
      el.addEventListener(type, listener, { capture, passive })
      attached = el
    }
  }
  function remove() {
    if (attached) {
      attached.removeEventListener(type, listener, capture)
      attached = undefined
    }
  }

  let stopped = false
  let stopWatching: (() => void) | undefined
  const start = () => {
    if (stopped)
      return
    if (isRef(target))
      stopWatching = watch(target, add, { immediate: true })
    else
      add(unref(target))
  }
  const stop = () => {
    stopped = true
    stopWatching?.()
    remove()
  }
  if (getCurrentInstance())
    onMounted(start)
  else
    start()
  if (getCurrentScope())
    onScopeDispose(stop)
  return stop
}
