import type { ComputedRef, InjectionKey, PropType } from 'vue'
import type { SizeType } from '../_util/type'
import { computed, defineComponent, inject, provide } from 'vue'

export type CompactOrientation = 'horizontal' | 'vertical'

export interface CompactItemContext {
  size: SizeType
  orientation: CompactOrientation
  isFirstItem: boolean
  isLastItem: boolean
}

/** `null` means "explicitly not in a compact group" (set by Portal for teleported content). */
export const compactItemContextKey: InjectionKey<ComputedRef<CompactItemContext> | null> = Symbol('AmCompactItemContext')

export interface UseCompactItemContextReturn {
  /** rendered inside a `Space.Compact` */
  inCompact: ComputedRef<boolean>
  /** size of the compact group; wins over ConfigProvider `componentSize`, loses to the component's own `size` */
  size: ComputedRef<SizeType>
  /** classes for the element that draws the border / background of the component */
  classes: ComputedRef<string[]>
}

/**
 * Lets a bordered component (Button, Input, InputNumber, picker triggers, Space.Addon ...)
 * take part in a `Space.Compact` group: put `classes` on the root and merge `size`.
 * The seam styles (radius, collapsed borders, stacking) live in `space/style/compact.css`.
 */
export function useCompactItemContext(): UseCompactItemContextReturn {
  const context = inject(compactItemContextKey, null)
  const inCompact = computed(() => !!context)
  const classes = computed(() => {
    const ctx = context?.value
    if (!ctx)
      return []
    const prefix = ctx.orientation === 'vertical' ? 'am-compact-vertical' : 'am-compact'
    const list = [`${prefix}-item`]
    if (ctx.isFirstItem)
      list.push(`${prefix}-first-item`)
    if (ctx.isLastItem)
      list.push(`${prefix}-last-item`)
    return list
  })
  return {
    inCompact,
    size: computed(() => context?.value.size),
    classes,
  }
}

/** Stops the compact styling for everything below (popups, panels rendered inside a compact item). */
export function provideNoCompact() {
  provide(compactItemContextKey, null)
}

/** Provides the position of one child of `Space.Compact`. */
export const CompactItem = defineComponent({
  name: 'AmCompactItem',
  props: {
    size: { type: String as PropType<SizeType>, default: undefined },
    orientation: { type: String as PropType<CompactOrientation>, default: 'horizontal' },
    isFirstItem: Boolean,
    isLastItem: Boolean,
  },
  setup(props, { slots }) {
    provide(compactItemContextKey, computed<CompactItemContext>(() => ({
      size: props.size,
      orientation: props.orientation,
      isFirstItem: props.isFirstItem,
      isLastItem: props.isLastItem,
    })))
    return () => slots.default?.()
  },
})
