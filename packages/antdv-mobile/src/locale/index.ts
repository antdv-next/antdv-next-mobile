import type { ComputedRef } from 'vue'
import type { Locale } from './interface'
import { computed } from 'vue'
import { useConfig } from '../config-provider/context'

export type { Locale, ValidateMessages } from './interface'

/**
 * Locale of one component, merged with an optional per-instance override.
 *
 * ```ts
 * const locale = useLocale('Modal')
 * locale.value.okText
 * ```
 */
export function useLocale<K extends keyof Locale>(
  componentName: K,
  override?: () => Partial<Locale[K]> | undefined,
): ComputedRef<Locale[K]> {
  const config = useConfig()
  return computed(() => {
    const base = config.locale.value[componentName]
    const extra = override?.()
    if (extra && typeof base === 'object')
      return { ...(base as object), ...extra } as Locale[K]
    return base
  })
}
