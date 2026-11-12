import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { inBrowser } from '../_util'
import { useEventListener } from '../_util/hooks'
import { useTimeoutFn } from './timer'

export interface UseClipboardOptions {
  /** how long `copied` stays true, in ms. Default `1500`. */
  copiedDuring?: number
}

function legacyCopy(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px;'
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, text.length)
  let ok = false
  try {
    ok = document.execCommand('copy')
  }
  catch {}
  document.body.removeChild(textarea)
  return ok
}

/** Copy text, with a fallback for WebViews without the async Clipboard API. */
export function useClipboard(options: UseClipboardOptions = {}) {
  const { copiedDuring = 1500 } = options
  const copied = ref(false)
  const text = ref('')
  const timer = useTimeoutFn(() => (copied.value = false), copiedDuring, { immediate: false })

  async function copy(value: string): Promise<boolean> {
    if (!inBrowser)
      return false
    let ok = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        ok = true
      }
    }
    catch {}
    if (!ok)
      ok = legacyCopy(value)
    if (ok) {
      text.value = value
      copied.value = true
      timer.start()
    }
    return ok
  }

  return { copy, copied, text }
}

export interface UseStorageOptions<T> {
  /** default: `localStorage` */
  storage?: Storage
  serializer?: { read: (raw: string) => T, write: (value: T) => string }
  /** follow changes made in other tabs. Default `true`. */
  listenToStorageChanges?: boolean
}

/** A ref persisted in `localStorage` (or any Storage). `null` / `undefined` removes the key. */
export function useStorage<T>(key: string, defaultValue: T, options: UseStorageOptions<T> = {}): Ref<T> {
  const { listenToStorageChanges = true } = options
  const serializer = options.serializer ?? { read: (raw: string) => JSON.parse(raw) as T, write: (value: T) => JSON.stringify(value) }
  let storage: Storage | undefined
  try {
    storage = options.storage ?? (inBrowser ? window.localStorage : undefined)
  }
  catch {}

  const read = (): T => {
    try {
      const raw = storage?.getItem(key)
      return raw === null || raw === undefined ? defaultValue : serializer.read(raw)
    }
    catch {
      return defaultValue
    }
  }

  const state = ref(read()) as Ref<T>
  let paused = false

  watch(state, (value) => {
    if (paused)
      return
    try {
      if (value === null || value === undefined)
        storage?.removeItem(key)
      else
        storage?.setItem(key, serializer.write(value))
    }
    catch {}
  }, { deep: true })

  if (listenToStorageChanges && storage) {
    useEventListener('storage', ((event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== storage)
        return
      paused = true
      state.value = read()
      Promise.resolve().then(() => (paused = false))
    }) as EventListener)
  }
  return state
}
