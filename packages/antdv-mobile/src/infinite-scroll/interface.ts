import type { CSSProperties } from 'vue'
import type { Numeric, VueNode } from '../_util/type'

export type InfiniteScrollDirection = 'down' | 'up'

export interface InfiniteScrollSemanticClassNames {
  root?: string
  indicator?: string
}

export interface InfiniteScrollSemanticStyles {
  root?: CSSProperties
  indicator?: CSSProperties
}

export interface InfiniteScrollProps {
  /** Whether a page is being loaded. Supports `v-model:loading`; set it back to `false` when the data arrived. */
  loading?: boolean
  /** Whether more data can be loaded */
  hasMore?: boolean
  /** Everything is loaded (the opposite of `hasMore`, either one stops the loading) */
  finished?: boolean
  /** The last load failed. Supports `v-model:error`; tapping the hint retries. */
  error?: boolean
  /** Distance in px from the end of the list at which `load` fires */
  threshold?: Numeric
  /** `up` loads when scrolling to the top (chat history) */
  direction?: InfiniteScrollDirection
  disabled?: boolean
  /** Check the position right after mount */
  immediateCheck?: boolean
  /** The same-named slot `loading` wins */
  loadingText?: VueNode
  /** The same-named slot `finished` wins */
  finishedText?: VueNode
  /** The same-named slot `error` wins */
  errorText?: VueNode
  rootClass?: string
  classes?: InfiniteScrollSemanticClassNames
  styles?: InfiniteScrollSemanticStyles
}

export interface InfiniteScrollEmits {
  'update:loading': [loading: boolean]
  'update:error': [error: boolean]
  /** The end of the list is within `threshold`: load the next page */
  'load': []
}

export interface InfiniteScrollSlots {
  default?: () => any
  loading?: () => any
  finished?: () => any
  error?: () => any
}

export interface InfiniteScrollRef {
  /** check the scroll position and emit `load` when needed */
  check: () => void
}
