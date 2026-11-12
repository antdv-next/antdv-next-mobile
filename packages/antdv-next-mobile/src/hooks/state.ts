import type { Ref } from 'vue'
import { ref } from 'vue'

export interface UseBooleanReturn {
  state: Ref<boolean>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
  set: (value: boolean) => void
}

/** Boolean state with named setters: popups, loading flags ... */
export function useBoolean(defaultValue = false): UseBooleanReturn {
  const state = ref(defaultValue)
  return {
    state,
    setTrue: () => (state.value = true),
    setFalse: () => (state.value = false),
    toggle: () => (state.value = !state.value),
    set: (value: boolean) => (state.value = value),
  }
}

/**
 * Toggles between two values (default `false` / `true`).
 *
 * ```ts
 * const [open, toggle] = useToggle()
 * const [mode, toggleMode] = useToggle('light', 'dark')
 * ```
 */
export function useToggle(): [Ref<boolean>, (value?: boolean) => void]
export function useToggle<T, U = T>(defaultValue: T, reverseValue: U): [Ref<T | U>, (value?: T | U) => void]
export function useToggle(defaultValue: any = false, reverseValue: any = true) {
  const state = ref(defaultValue)
  const toggle = (value?: any) => {
    state.value = value !== undefined ? value : state.value === defaultValue ? reverseValue : defaultValue
  }
  return [state, toggle]
}
