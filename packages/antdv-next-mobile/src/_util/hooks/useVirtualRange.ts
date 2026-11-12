import type { ComputedRef } from 'vue'
import { computed } from 'vue'

export interface UseVirtualRangeOptions {
  /** number of items */
  count: () => number
  /** one fixed size for every item, or the size of the item at `index` */
  size: () => number | ((index: number) => number)
  /** current scroll position (px from the start of the list) */
  scrollOffset: () => number
  /** size of the visible window (px) */
  viewportSize: () => number
  /** extra items rendered before / after the window. Default `3`. */
  overscan?: () => number
  /** `false` renders everything */
  enabled?: () => boolean
}

export interface VirtualRange {
  /** first rendered index */
  start: ComputedRef<number>
  /** last rendered index + 1 */
  end: ComputedRef<number>
  /** total size of all items */
  totalSize: ComputedRef<number>
  /** leading space before the first rendered item */
  offsetBefore: ComputedRef<number>
  /** trailing space after the last rendered item */
  offsetAfter: ComputedRef<number>
  /** start position of the item at `index` */
  offsetOf: (index: number) => number
  /** size of the item at `index` */
  sizeOf: (index: number) => number
  /** index of the item that contains `offset` */
  indexAt: (offset: number) => number
}

/**
 * Windowing math shared by every virtualized component: VirtualList (native scrolling),
 * PickerView (transform-based wheel) and Calendar (month list).
 *
 * It only computes *which* items to render; the caller owns scrolling and layout.
 */
export function useVirtualRange(options: UseVirtualRangeOptions): VirtualRange {
  /** prefix sums for variable sizes: offsets[i] = start of item i, offsets[count] = total */
  const offsets = computed(() => {
    const size = options.size()
    if (typeof size === 'number')
      return null
    const count = options.count()
    const list: number[] = Array.from({ length: count + 1 })
    list[0] = 0
    for (let i = 0; i < count; i++)
      list[i + 1] = list[i] + size(i)
    return list
  })

  const offsetOf = (index: number) => {
    const count = options.count()
    const i = Math.min(Math.max(index, 0), count)
    return offsets.value ? offsets.value[i] : i * (options.size() as number)
  }

  const sizeOf = (index: number) => {
    const size = options.size()
    return typeof size === 'number' ? size : size(index)
  }

  const totalSize = computed(() => offsetOf(options.count()))

  const indexAt = (offset: number) => {
    const count = options.count()
    if (count === 0)
      return 0
    if (!offsets.value) {
      const size = options.size() as number
      return size > 0 ? Math.min(Math.max(Math.floor(offset / size), 0), count - 1) : 0
    }
    // binary search: greatest i with offsets[i] <= offset
    const list = offsets.value
    let low = 0
    let high = count - 1
    while (low < high) {
      const mid = (low + high + 1) >> 1
      if (list[mid] <= offset)
        low = mid
      else
        high = mid - 1
    }
    return low
  }

  const range = computed<[number, number]>(() => {
    const count = options.count()
    if (options.enabled && !options.enabled())
      return [0, count]
    if (count === 0)
      return [0, 0]
    const overscan = options.overscan?.() ?? 3
    const scroll = Math.max(options.scrollOffset(), 0)
    const first = indexAt(scroll)
    const last = indexAt(scroll + Math.max(options.viewportSize(), 0))
    return [Math.max(first - overscan, 0), Math.min(last + overscan + 1, count)]
  })

  return {
    start: computed(() => range.value[0]),
    end: computed(() => range.value[1]),
    totalSize,
    offsetBefore: computed(() => offsetOf(range.value[0])),
    offsetAfter: computed(() => totalSize.value - offsetOf(range.value[1])),
    offsetOf,
    sizeOf,
    indexAt,
  }
}
