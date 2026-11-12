import type { Ref } from 'vue'
import { isRef, onBeforeUnmount, onMounted, unref, watch } from 'vue'
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

  onMounted(() => add(unref(target)))
  onBeforeUnmount(remove)
  if (isRef(target))
    watch(target, el => add(el))

  return remove
}
