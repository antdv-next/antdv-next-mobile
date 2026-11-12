import type { Ref } from 'vue'
import type { BorderWidth } from './util'
import { shallowRef, watch } from 'vue'
import { isSameBorderWidth } from './util'

const DEFAULT_BORDER_WIDTH: BorderWidth = [0, 0, 0, 0]

function normalizeValue(val: string): number {
  const size = Number.parseFloat(val)
  return Number.isFinite(size) ? size : 0
}

const isClipped = (value: string) => !!value && value !== 'visible'

/**
 * Border width (top, right, bottom, left) of the host element. The beam layer is positioned
 * against the padding box of its host, so it is pushed outwards by these to cover the border.
 * A host that clips its overflow (Card, Image ...) would cut that part off: the layer then
 * stays on the padding box (`0`), right inside the border.
 * Read once per host element (after it is mounted), like the PC implementation.
 */
export default function useBorderSize(domNode: Ref<HTMLElement | null | undefined>) {
  const borderWidth = shallowRef<BorderWidth>(DEFAULT_BORDER_WIDTH)

  const setBorderWidth = (next: BorderWidth) => {
    if (!isSameBorderWidth(borderWidth.value, next))
      borderWidth.value = next
  }

  watch(
    domNode,
    (node) => {
      if (!node) {
        setBorderWidth(DEFAULT_BORDER_WIDTH)
        return
      }
      // `getComputedStyle` may throw outside a real browser; never break the host tree for a decoration
      let computedStyle: CSSStyleDeclaration
      try {
        computedStyle = getComputedStyle(node)
      }
      catch {
        setBorderWidth(DEFAULT_BORDER_WIDTH)
        return
      }
      const { borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, overflow, overflowX, overflowY } = computedStyle
      if (isClipped(overflow) || isClipped(overflowX) || isClipped(overflowY)) {
        setBorderWidth(DEFAULT_BORDER_WIDTH)
        return
      }
      setBorderWidth([
        normalizeValue(borderTopWidth),
        normalizeValue(borderRightWidth),
        normalizeValue(borderBottomWidth),
        normalizeValue(borderLeftWidth),
      ])
    },
    { immediate: true, flush: 'post' },
  )

  return borderWidth
}
