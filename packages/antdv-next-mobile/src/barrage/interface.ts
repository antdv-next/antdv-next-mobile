import type { CSSProperties } from 'vue'
import type { Key, VueNode } from '../_util/type'

export interface BarrageItem {
  /** Unique id, a bullet is created once per id */
  id: Key
  /** Bullet content, the `item` slot wins */
  text?: VueNode
  class?: string
  style?: CSSProperties
}

export interface BarrageSemanticClassNames {
  root?: string
  item?: string
}

export interface BarrageSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
}

export interface BarrageProps {
  /** Bullets waiting / in flight (`v-model:value`). A bullet is removed from the list once it has crossed the container. */
  value?: BarrageItem[]
  defaultValue?: BarrageItem[]
  /** Number of tracks, bullets are distributed round-robin */
  rows?: number
  /** Offset in px of the first track from the top of the container */
  top?: number
  /** Time in milliseconds a bullet needs to cross the container */
  duration?: number
  /** Interval in milliseconds between bullets added together; the initial list also waits one `delay` before its first bullet */
  delay?: number
  /** Start playing right away, otherwise call `play()` */
  autoPlay?: boolean
  rootClass?: string
  classes?: BarrageSemanticClassNames
  styles?: BarrageSemanticStyles
}

export interface BarrageEmits {
  'update:value': [value: BarrageItem[]]
  /** The component removed a finished bullet from the list */
  'change': [value: BarrageItem[]]
  /** A bullet has left the container */
  'finish': [item: BarrageItem]
}

export interface BarrageSlots {
  /** Content the bullets fly above (video, image ...) */
  default?: () => any
  item?: (props: { item: BarrageItem }) => any
}

export interface BarrageExpose {
  play: () => void
  pause: () => void
}
