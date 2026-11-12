import type { CSSProperties } from 'vue'
import type { Key } from '../_util/type'

export interface IndexBarSemanticClassNames {
  root?: string
  sidebar?: string
  index?: string
  hint?: string
}

export interface IndexBarSemanticStyles {
  root?: CSSProperties
  sidebar?: CSSProperties
  index?: CSSProperties
  hint?: CSSProperties
}

export interface IndexBarProps {
  /** Indexes shown in the side bar. Defaults to the indexes of the anchors inside, in document order. */
  indexList?: Key[]
  /** Stick the active anchor to the top of the scroll container */
  sticky?: boolean
  /** Offset from the top of the scroll container (e.g. the height of a fixed NavBar) */
  stickyOffsetTop?: number
  zIndex?: number
  rootClass?: string
  classes?: IndexBarSemanticClassNames
  styles?: IndexBarSemanticStyles
}

export interface IndexBarEmits {
  /** An index of the side bar was tapped / dragged over */
  select: [index: Key]
  /** The active anchor changed while scrolling */
  change: [index: Key]
}

export interface IndexBarSlots {
  default?: () => any
}

export interface IndexBarExpose {
  scrollTo: (index: Key) => void
}

export interface IndexBarAnchorProps {
  index: Key
  rootClass?: string
}

export interface IndexBarAnchorSlots {
  /** Defaults to `index` */
  default?: () => any
}
