import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'

export interface UseControlledOptions<T> {
  /** Used when the prop is `undefined` (uncontrolled mode). */
  defaultValue?: T | (() => T)
  /** Called with the next value on every `set` (emit `update:xxx` / `change` here). */
  onChange?: (value: T, prev: T) => void
}

/**
 * Controlled / uncontrolled state, the SFC equivalent of antdv-next's `useMergedState`.
 *
 * - `props[key] !== undefined` -> controlled, the returned ref mirrors the prop.
 * - otherwise the component keeps its own state so it works without `v-model`.
 *
 * NOTE: boolean props must be declared with `undefined` as default
 * (`withDefaults(defineProps<Props>(), { open: undefined })`), otherwise Vue casts
 * an absent boolean prop to `false` and the component is always "controlled".
 */
export function useControlled<P extends Record<string, any>, K extends keyof P, T = NonNullable<P[K]>>(
  props: P,
  key: K,
  options: UseControlledOptions<T> = {},
): [Ref<T>, (value: T) => void] {
  const { defaultValue, onChange } = options
  const initial = (): T => {
    if (props[key] !== undefined)
      return props[key] as T
    return typeof defaultValue === 'function' ? (defaultValue as () => T)() : (defaultValue as T)
  }
  const inner = ref(initial()) as Ref<T>

  watch(
    () => props[key],
    (val) => {
      if (val !== undefined)
        inner.value = val as T
    },
  )

  const merged = computed<T>({
    get: () => (props[key] !== undefined ? (props[key] as T) : inner.value),
    set: (val) => {
      setValue(val)
    },
  })

  function setValue(val: T) {
    const prev = merged.value
    inner.value = val
    onChange?.(val, prev)
  }

  return [merged as unknown as Ref<T>, setValue]
}
